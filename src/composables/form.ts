import type { AxiosError } from 'axios';
import {
    computed, ref,
    watch,
    type ComputedRef,
} from 'vue';
import { useI18n } from 'vue-i18n';
import type { ErrorResponseBody } from '~api/interfaces/api';
import type AbstractDefaultService from '~api/services/abstractDefaultService';
import { decapitalizeFirstLetter } from '~/helpers/misc';

import { useNotificationStore } from '~/store/notifications';

export default function useForm<ViewType, CreateType, PatchType extends object, SearchParametersType>({
    emit,
    service,
    getDefaultFormProperties,
    validationFunctions,
    editId,
}: {
    emit?: CallableFunction;
    service: AbstractDefaultService<ViewType, CreateType, PatchType, SearchParametersType>;
    getDefaultFormProperties: CallableFunction;
    validationFunctions?: Record<string, CallableFunction[]>,
    editId?: ComputedRef<string | null | undefined>;
}) {
    const { t } = useI18n();

    const notificationStore = useNotificationStore();

    const isSaving = ref<boolean>(false);
    const isLoading = ref<boolean>(false);
    const savingFailed = ref<boolean>(false);
    const editModel = ref<CreateType>(getDefaultFormProperties() as CreateType);
    const origin = ref<ViewType | null>(null);
    const errors = ref<Record<string, string[]>>({});
    const loadingOriginFailed = ref<boolean>(false);
    const resErrors = ref<Record<string, string[]>[]>([]);

    function getChangedPatch(model: PatchType) {
        if (!origin.value) return model;
        const changed = {} as PatchType;
        Object.keys(model).forEach((prop) => {
            const originValue = (origin.value as ViewType)[prop as keyof ViewType] as never;
            const patchValue = (model)[prop as keyof PatchType] as never;
            if (patchValue !== originValue) {
                changed[prop as keyof PatchType] = patchValue;
            }
        });
        return changed;
    }

    const changedPatch = computed<PatchType>(() => getChangedPatch(editModel.value as PatchType));
    const toCreate = computed<CreateType>(() => changedPatch.value as unknown as CreateType);
    const hasErrors = computed<boolean>(() => Object.keys(errors.value).length > 0);
    const hasChanges = computed<boolean>(() => Object.keys(changedPatch.value).length > 0);
    const canSave = computed<boolean>(() => hasChanges.value);

    function validateForm(): void {
        errors.value = {};
        savingFailed.value = false;
        if (validationFunctions) {
            Object.keys(validationFunctions).forEach((key) => {
                const propertyErrors: string[] = [];
                validationFunctions[key].forEach((validationFunction) => {
                    const result = validationFunction((editModel.value as CreateType)[key as keyof CreateType] as never);
                    if (result) propertyErrors.push(result);
                });
                if (propertyErrors.length) errors.value[key] = propertyErrors;
            });
        }
    }

    function mapToFormProperties(): void {
        if (!origin.value) return;
        Object.keys(editModel.value as PatchType).forEach((key) => {
            (editModel.value as PatchType)[key as keyof PatchType] = (origin.value as ViewType)[key as keyof ViewType] as never;
        });
    }

    async function save(preparedModel?: CreateType): Promise<ViewType[] | Record<string, ViewType>> {
        validateForm();
        if (Object.keys(errors.value).length > 0) {
            notificationStore.addNotification({
                text: t('validationErrorsOccured'),
                type: 'error',
            });
            return [];
        }
        isSaving.value = true;
        savingFailed.value = false;
        resErrors.value = [];
        try {
            if (editId?.value) {
                const result = (await service.patch({ [editId.value]: preparedModel ? getChangedPatch(preparedModel as unknown as PatchType) : changedPatch.value })).data;
                if (emit) emit('patched', result);
                if (emit) emit('saved', result);
                notificationStore.addNotification({
                    text: t('saved'),
                    type: 'success',
                });
                isSaving.value = false;
                return result;
            }
            const result = (await service.create([preparedModel || toCreate.value])).data;
            if (emit) emit('created', result);
            if (emit) emit('saved', result);
            notificationStore.addNotification({
                text: t('saved'),
                type: 'success',
            });
            isSaving.value = false;
            return result;
        } catch (error) {
            const axiosError = error as AxiosError;
            savingFailed.value = true;
            if (axiosError.response?.status === 400 && (axiosError.response?.data as ErrorResponseBody).errors) {
                const responseErrors = (axiosError.response?.data as ErrorResponseBody).errors;
                if (responseErrors) {
                    Object.keys(responseErrors).forEach((key) => {
                        const result = key.match(/\[([0-9]+)\]\.([a-zA-Z0-9]+)/);
                        if (!result) return;
                        const [_, index, property] = result;
                        if (index === undefined || !property) return;
                        const indexNumeric = Number.parseInt(index, 10);
                        if (!resErrors.value[indexNumeric]) resErrors.value[indexNumeric] = {};
                        resErrors.value[indexNumeric][decapitalizeFirstLetter(property)] = responseErrors[key];
                    });
                }
            } else {
                notificationStore.addNotification({
                    text: t('savingFailed'),
                    type: 'error',
                });
            }
        }
        isSaving.value = false;
        return [] as ViewType[];
    }

    async function load(): Promise<void> {
        if (!editId?.value) return;
        loadingOriginFailed.value = false;
        isLoading.value = true;
        try {
            const res = await service.getOneOrDefault(editId.value);
            (origin.value as ViewType) = res.data;
            mapToFormProperties();
        } catch {
            loadingOriginFailed.value = true;
        }
        isLoading.value = false;
    }

    async function onInit(): Promise<void> {
        if (editId?.value) {
            await load();
        }
    }

    watch(() => editId?.value, () => {
        onInit();
    });

    onInit();

    return {
        emit,
        isSaving,
        isLoading,
        savingFailed,
        editModel,
        origin,
        errors,
        resErrors,
        loadingOriginFailed,
        changedPatch,
        canSave,
        hasErrors,
        hasChanges,
        validateForm,
        mapToFormProperties,
        save,
        load,
    };
}

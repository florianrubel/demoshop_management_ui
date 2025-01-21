import {
    computed, ref, watch, type ComputedRef, type ModelRef,
} from 'vue';
import { useI18n } from 'vue-i18n';

import type { DataTableAction, DataTableActionEvent, DataTableHeader } from '~/interfaces/dataTable';
import type { SelectOption } from '~/interfaces/ui';
import type { SearchParameters } from '~/sharedLib/api/src/interfaces/api';
import type { CreateProperty, PatchProperty, ViewProperty } from '~/sharedLib/api/src/interfaces/pim/properties/property';
import type {
    ViewProductVariantRelation,
    CreateProductVariantRelation,
    PatchProductVariantRelation,
    ProductVariantRelationSearchParameters,
} from '~/sharedLib/api/src/interfaces/pim/productVariantRelation';
import type { HydratedProperty } from '~/composables/products/productVariantFactory';
import type AbstractWithDeleteService from '~/sharedLib/api/src/services/abstractWithDeleteService';
import type AbstractDefaultService from '~/sharedLib/api/src/services/abstractDefaultService';

import { ArrowUturnLeftIcon, XMarkIcon } from '~/helpers/icons';

import { useNotificationStore } from '~/store/notifications';

import useSearchable from '~/composables/searchable';

export default function useManageProductVariantRelations<
    ValueType,
    RelationViewType extends ViewProductVariantRelation<ValueType>,
    RelationCreateType extends CreateProductVariantRelation<ValueType>,
    RelationPatchType extends PatchProductVariantRelation<ValueType>,
    RelationSearchParametersType extends ProductVariantRelationSearchParameters<ValueType>,
    PropertyViewType extends ViewProperty,
    PropertyCreateType extends CreateProperty,
    PropertyPatchType extends PatchProperty,
    PropertySearchParametersType extends SearchParameters,
>({
    relationService,
    propertyService,
    additionalSearchParameters,
    props,
    newRelationValueFunction,
    toDelete,
    toCreate,
    toPatch,
    hydratedProductVariantRelations,
}: {
    relationService: AbstractWithDeleteService<RelationViewType, RelationCreateType, RelationPatchType, RelationSearchParametersType>;
    propertyService: AbstractDefaultService<PropertyViewType, PropertyCreateType, PropertyPatchType, PropertySearchParametersType>;
    additionalSearchParameters: ComputedRef<Record<string, string>>;
    props: {
        productVariantId: string;
    };
    newRelationValueFunction: (property: PropertyViewType) => ValueType;
    toDelete: ModelRef<string[]>;
    toCreate: ModelRef<RelationCreateType[]>;
    toPatch: ModelRef<RelationViewType[]>;
    hydratedProductVariantRelations?: ComputedRef<Record<string, HydratedProperty<ValueType>>>;
}) {
    const { t } = useI18n();

    const notificationStore = useNotificationStore();

    const searchableRelations = useSearchable<
        RelationViewType,
        RelationCreateType,
        RelationPatchType,
        RelationSearchParametersType
    >({
        service: relationService,
        initialPageSize: -1,
        additionalSearchParameters,
    });

    const searchableProperties = useSearchable<
        PropertyViewType,
        PropertyCreateType,
        PropertyPatchType,
        PropertySearchParametersType
    >({
        service: propertyService,
        initialPageSize: -1,
    });

    const newRelationHandle = ref<string | null>(null);
    const isSaving = {
        toCreate: ref<boolean>(false),
        toPatch: ref<boolean>(false),
        toDelete: ref<boolean>(false),
    };

    const propertiesMap = computed<Record<string, PropertyViewType>>(() => {
        const map: Record<string, PropertyViewType> = {};
        searchableProperties.records.value.forEach((record) => {
            map[record.id] = record as PropertyViewType;
        });
        return map;
    });

    const availableProperties = computed<PropertyViewType[]>(() => (searchableProperties.records.value as PropertyViewType[])
        .filter(({ id }) => !searchableRelations.records.value.some(({ propertyId }) => propertyId === id)));

    const propertiesSelectOptions = computed<SelectOption<string>[]>(() => [
        { value: null, label: t('pleaseChoose') },
        ...availableProperties.value.map(({ id, name }) => ({
            value: id,
            label: name,
        })),
    ]);

    const headers = computed<DataTableHeader[]>(() => [
        { label: t('name') },
        { label: t('value') },
    ]);

    const existingAndNew = computed<(RelationViewType | RelationCreateType)[]>(() => [
        ...searchableRelations.records.value as RelationViewType[],
        ...toCreate.value,
    ]);

    const dataTableActions = computed<DataTableAction[]>(() => [
        {
            name: 'restore',
            icon: ArrowUturnLeftIcon,
            label: t('restore'),
            conditionalFunction: (value?: string | null) => !!value && toDelete.value.includes(value),
        },
        {
            name: 'delete',
            icon: XMarkIcon,
            label: t('delete'),
            conditionalFunction: (value?: string | null) => !!value && !toDelete.value.includes(value),
        },
    ]);

    const changedRelations = computed<RelationViewType[]>(() => {
        if (!hydratedProductVariantRelations) return searchableRelations.records.value as RelationViewType[];

        return searchableRelations.records.value.filter((relation) => {
            const property = propertiesMap.value[relation.propertyId];
            if (!property) return false;

            const hydratedRelation = hydratedProductVariantRelations.value[property.name];
            if (!hydratedRelation) return false;

            return relation.value !== hydratedRelation.value;
        }) as RelationViewType[];
    });

    const isSavingSomething = computed<boolean>(() => isSaving.toCreate.value || isSaving.toPatch.value || isSaving.toDelete.value);

    function handleDataTableAction(actionEvent: DataTableActionEvent) {
        if (!actionEvent.value) return;
        switch (actionEvent.name) {
        case 'delete':
            if (toCreate.value.find(({ propertyId }) => propertyId === actionEvent.value)) {
                // This is fine, because it's a ref.
                // eslint-disable-next-line no-param-reassign
                toCreate.value = toCreate.value.filter(({ propertyId }) => propertyId !== actionEvent.value);
                return;
            }
            // This is fine, because it's a ref.
            // eslint-disable-next-line no-param-reassign
            toDelete.value = [
                ...toDelete.value,
                actionEvent.value,
            ];
            break;

        case 'restore':
            // This is fine, because it's a ref.
            // eslint-disable-next-line no-param-reassign
            toDelete.value = toDelete.value.filter((fValue) => fValue !== actionEvent.value);
            break;

        default:
            // no default case
        }
    }

    function addNewRelation(): void {
        if (!newRelationHandle.value) return;
        const property = propertiesMap.value[newRelationHandle.value];
        if (!property) return;

        // @ts-expect-error TS cannot resolve this relation somehow.
        const newRelation: RelationCreateType = {
            productVariantId: props.productVariantId,
            propertyId: newRelationHandle.value,
            value: newRelationValueFunction(property),
        };

        // This is fine, because it's a ref.
        // eslint-disable-next-line no-param-reassign
        toCreate.value = [
            ...(toCreate.value || []),
            newRelation,
        ];
        newRelationHandle.value = null;
    }

    async function saveCreated(): Promise<void> {
        if (!toCreate.value.length) return;
        isSaving.toCreate.value = true;
        try {
            await relationService.create(toCreate.value);
        } catch {
            notificationStore.addNotification({
                text: t('savingFailed'),
                type: 'error',
            });
        }
        isSaving.toCreate.value = false;
    }
    async function savePatched(): Promise<void> {
        if (!toPatch.value.length) return;
        isSaving.toCreate.value = true;
        try {
            const patchObj: Record<string, RelationPatchType> = {};
            toPatch.value.forEach((patch) => {
                patchObj[patch.id] = { value: patch.value } as RelationPatchType;
            });
            await relationService.patch(patchObj);
        } catch {
            notificationStore.addNotification({
                text: t('savingFailed'),
                type: 'error',
            });
        }
        isSaving.toCreate.value = false;
    }
    async function saveDeleted(): Promise<void> {
        if (!toDelete.value.length) return;
        isSaving.toDelete.value = true;
        try {
            const deleteIds: string [] = [];
            searchableRelations.records.value.forEach(({ id, propertyId }) => {
                if (toDelete.value.includes(propertyId)) {
                    deleteIds.push(id);
                }
            });
            await relationService.delete(deleteIds);
        } catch {
            notificationStore.addNotification({
                text: t('savingFailed'),
                type: 'error',
            });
        }
        isSaving.toDelete.value = false;
    }

    async function save(): Promise<void> {
        await Promise.all([
            saveDeleted(),
            savePatched(),
            saveCreated(),
        ]);
        await searchableRelations.load();
        // This is fine, because it's a ref.
        // eslint-disable-next-line no-param-reassign
        toPatch.value = changedRelations.value;
        // eslint-disable-next-line no-param-reassign
        toCreate.value = [];
        // eslint-disable-next-line no-param-reassign
        toDelete.value = [];
    }

    watch(changedRelations, () => {
        // This is fine, because it's a ref.
        // eslint-disable-next-line no-param-reassign
        toPatch.value = changedRelations.value;
    });

    searchableRelations.load();
    searchableProperties.load();

    return {
        newRelationHandle,

        propertiesMap,
        availableProperties,
        propertiesSelectOptions,
        headers,
        existingAndNew,
        searchableRelations,
        searchableProperties,
        dataTableActions,
        changedRelations,
        isSavingSomething,

        handleDataTableAction,
        addNewRelation,
        save,
    };
}

<script lang="ts" setup>
import {
    computed,
} from 'vue';
import { useI18n } from 'vue-i18n';

import type { CreateNumericProperty, PatchNumericProperty, ViewNumericProperty } from '~api/interfaces/pim/properties/numericProperty';
import type { SearchParameters } from '~api/interfaces/api';

import { DEFAULT_INPUT_MAX_LENGTH, DEFAULT_INPUT_MIN_LENGTH } from '~/constants/app';

import NumericPropertyService from '~api/services/pim/properties/numericPropertyService';

import { useAuthenticationStore } from '~/store/authentication';

import useForm from '~/composables/form';
import useValidation from '~/composables/validation';

import TextField from '~/components/controls/TextField.vue';
import Dialog from '~/components/dialogs/Dialog.vue';

const { t } = useI18n();

const authenticationStore = useAuthenticationStore();

const emit = defineEmits<{
    created: [results: ViewNumericProperty[]],
    patched: [results: ViewNumericProperty[]],
    saved: [results: ViewNumericProperty[]],
    cancel: [],
}>();

const numericPropertyService = new NumericPropertyService(
    () => authenticationStore.setUser(),
    () => authenticationStore.deleteUser(),
);

interface Props {
    editId?: string | null;
}
const props = defineProps<Props>();

const editId = computed(() => props.editId);

const getDefaultFormProperties = (): (PatchNumericProperty | CreateNumericProperty) => ({
    name: '',
    minValue: null,
    maxValue: null,
});

const validation = useValidation();
// This is fine here, because the component will be recreated.

const form = useForm<ViewNumericProperty, CreateNumericProperty, PatchNumericProperty, SearchParameters>({
    emit,
    service: numericPropertyService,
    getDefaultFormProperties,
    validationFunctions: {
        name: [(value: string | undefined | null) => validation.limitedString(value, DEFAULT_INPUT_MIN_LENGTH, DEFAULT_INPUT_MAX_LENGTH, false)],
    },
    editId,
});

const dialogTitle = computed<string>(() => (props.editId ? t('editNumericProperty') : t('createNumericProperty')));
</script>

<template lang="pug">
Dialog(
    :title="dialogTitle"
    :save-and-cancel="true"
    :disable-saving="form.isSaving.value || form.isLoading.value || !form.hasChanges.value"
    :disable-cancel="form.isSaving.value || form.isLoading.value"
    :has-changes="form.hasChanges.value"
    :is-loading="form.isSaving.value"
    @save="form.save()"
    @close="emit('cancel')"
)
    TextField(
        v-model="form.editModel.value.name"
        :label="t('name')"
        :errors="form.errorsAndConflicts.value.name"
        class="margin-top"
        required
    )
    TextField(
        v-model="form.editModel.value.minValue"
        type="number"
        :label="t('minValue')"
        :errors="form.errors.value.minValue"
        class="margin-top"
    )
    TextField(
        v-model="form.editModel.value.maxValue"
        type="number"
        :label="t('maxValue')"
        :errors="form.errors.value.maxValue"
        class="margin-top"
    )

</template>

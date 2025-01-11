<script lang="ts" setup>
import {
    computed,
} from 'vue';
import { useI18n } from 'vue-i18n';

import type { CreateBooleanProperty, PatchBooleanProperty, ViewBooleanProperty } from '~api/interfaces/pim/properties/booleanProperty';
import type { SearchParameters } from '~api/interfaces/api';

import { DEFAULT_INPUT_MAX_LENGTH, DEFAULT_INPUT_MIN_LENGTH } from '~/constants/app';

import BooleanPropertyService from '~api/services/pim/properties/booleanPropertyService';

import { useAuthenticationStore } from '~/store/authentication';

import useForm from '~/composables/form';
import useValidation from '~/composables/validation';

import TextField from '~/components/controls/TextField.vue';
import Dialog from '~/components/dialogs/Dialog.vue';

const { t } = useI18n();

const authenticationStore = useAuthenticationStore();

const emit = defineEmits<{
    created: [results: ViewBooleanProperty[]],
    patched: [results: ViewBooleanProperty[]],
    saved: [results: ViewBooleanProperty[]],
    cancel: [],
}>();

const booleanPropertyService = new BooleanPropertyService(
    () => authenticationStore.setUser(),
    () => authenticationStore.deleteUser(),
);

interface Props {
    editId?: string | null;
}
const props = defineProps<Props>();

const getDefaultFormProperties = (): (PatchBooleanProperty | CreateBooleanProperty) => ({
    name: '',
});

const validation = useValidation();
// This is fine here, because the component will be recreated.
// eslint-disable-next-line vue/no-setup-props-destructure
const form = useForm<ViewBooleanProperty, CreateBooleanProperty, PatchBooleanProperty, SearchParameters>({
    emit,
    service: booleanPropertyService,
    getDefaultFormProperties,
    validationFunctions: {
        name: [(value: string | undefined | null) => validation.limitedString(value, DEFAULT_INPUT_MIN_LENGTH, DEFAULT_INPUT_MAX_LENGTH, false)],
    },
    editId: props.editId,
});

const dialogTitle = computed<string>(() => (props.editId ? t('editStringProperty') : t('createStringProperty')));
</script>

<template lang="pug">
Dialog(
    :title="dialogTitle"
    :save-and-cancel="true"
    :disable-saving="form.isSaving.value || form.isLoading.value"
    :is-loading="form.isSaving.value"
    @save="form.save()"
    @close="emit('cancel')"
)
    TextField(
        v-model="form.editModel.value.name"
        :label="t('name')"
        :errors="form.errors.value.name"
        class="margin-top"
        required
    )

</template>

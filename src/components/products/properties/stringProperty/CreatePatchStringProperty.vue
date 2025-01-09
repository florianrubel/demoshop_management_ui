<script lang="ts" setup>
import {
    computed,
    ref,
} from 'vue';
import { useI18n } from 'vue-i18n';

import type { CreateStringProperty, PatchStringProperty, ViewStringProperty } from '~api/interfaces/pim/properties/stringProperty';
import type { SearchParameters } from '~api/interfaces/api';

import { DEFAULT_INPUT_MAX_LENGTH, DEFAULT_INPUT_MIN_LENGTH } from '~/constants/app';

import StringPropertyService from '~api/services/pim/properties/stringPropertyService';

import { useAuthenticationStore } from '~/store/authentication';

import useForm from '~/composables/form';
import useValidation from '~/composables/validation';

import TextField from '~/components/controls/TextField.vue';
import Dialog from '~/components/dialogs/Dialog.vue';
import Chip from '~/components/controls/Chip.vue';

const { t } = useI18n();

const authenticationStore = useAuthenticationStore();

const emit = defineEmits<{
    created: [results: ViewStringProperty[]],
    patched: [results: ViewStringProperty[]],
    saved: [results: ViewStringProperty[]],
    cancel: [],
}>();

const stringPropertyService = new StringPropertyService(
    () => authenticationStore.setUser(),
    () => authenticationStore.deleteUser(),
);

interface Props {
    editId?: string | null;
}
const props = defineProps<Props>();

const getDefaultFormProperties = (): (PatchStringProperty | CreateStringProperty) => ({
    name: '',
    allowedValues: [],
});

const validation = useValidation();
// This is fine here, because the component will be recreated.
// eslint-disable-next-line vue/no-setup-props-destructure
const form = useForm<ViewStringProperty, CreateStringProperty, PatchStringProperty, SearchParameters>({
    emit,
    service: stringPropertyService,
    getDefaultFormProperties,
    validationFunctions: {
        name: [(value: string | undefined | null) => validation.limitedString(value, DEFAULT_INPUT_MIN_LENGTH, DEFAULT_INPUT_MAX_LENGTH, false)],
    },
    editId: props.editId,
});

const newAllowedValue = ref<string>('');

const dialogTitle = computed<string>(() => (props.editId ? t('editBooleanProperty') : t('createBooleanProperty')));

function addAllowedValue() {
    if (!form.editModel.value.allowedValues?.includes(newAllowedValue.value)) {
        if (!form.editModel.value.allowedValues) {
            form.editModel.value.allowedValues = [];
        }
        form.editModel.value.allowedValues.push(newAllowedValue.value);
    }
}

function removeAllowed(value: string) {
    if (!form.editModel.value.allowedValues) return;
    form.editModel.value.allowedValues = form.editModel.value.allowedValues.filter((allowedValue) => allowedValue !== value);
}
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

    p {{ t('allowedValues') }}
    div(
        v-if="form.editModel.value.allowedValues?.length"
        class="flex flex--wrap flex--gap"
    )
        Chip(
            v-for="allowedValue in form.editModel.value.allowedValues"
            :key="allowedValue"
            :text="allowedValue"
            :removable="true"
            @clicked="removeAllowed(allowedValue)"
        )
    div(v-else) {{ t('noRestrictions') }}

    TextField(
        v-model="newAllowedValue"
        :label="t('addValue')"
        :errors="form.errors.value.minValue"
        class="margin-top"
        @keyup.enter="addAllowedValue()"
    )

</template>

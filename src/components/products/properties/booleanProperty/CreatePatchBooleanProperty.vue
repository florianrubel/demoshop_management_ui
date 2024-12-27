<script lang="ts" setup>
import {
    computed,
} from 'vue';
import { useI18n } from 'vue-i18n';

import type { CreateBooleanProperty, PatchBooleanProperty, ViewBooleanProperty } from '~/sharedLib/api/src/interfaces/pim/properties/booleanProperty';
import type { SearchParameters } from '~/sharedLib/api/src/interfaces/api';

import { DEFAULT_INPUT_MAX_LENGTH, DEFAULT_INPUT_MIN_LENGTH } from '~/constants/app';

import { XMarkIcon } from '~/helpers/icons';

import { useAuthenticationStore } from '~/store/authentication';

import useForm from '~/composables/form';
import useValidation from '~/composables/validation';

import Button from '~/components/controls/Button.vue';
import TextField from '~/components/controls/TextField.vue';
import Dialog from '~/components/dialogs/Dialog.vue';
import BooleanPropertyService from '~/sharedLib/api/src/services/pim/properties/booleanPropertyService';

const { t } = useI18n();

const authenticationStore = useAuthenticationStore();

const emit = defineEmits<{
    created: [results: ViewBooleanProperty[]],
    patched: [results: ViewBooleanProperty[]],
    saved: [results: ViewBooleanProperty[]],
    cancel: [],
}>();

const booleanPropertyService = new BooleanPropertyService(
    authenticationStore.setUser,
    authenticationStore.deleteUser,
);

interface Props {
    editId?: string | null;
}
const props = defineProps<Props>();

const getDefaultFormProperties = (): (PatchBooleanProperty | CreateBooleanProperty) => ({
    name: '',
});

const validation = useValidation();
const form = useForm<ViewBooleanProperty, CreateBooleanProperty, PatchBooleanProperty, SearchParameters>({
    emit,
    service: booleanPropertyService,
    getDefaultFormProperties,
    validationFunctions: {
        name: [(value: string | undefined | null) => validation.limitedString(value, DEFAULT_INPUT_MIN_LENGTH, DEFAULT_INPUT_MAX_LENGTH, false)],
    },
    editId: undefined,
});

const dialogTitle = computed<string>(() => (props.editId ? t('editRelease') : t('createRelease')));
</script>

<template lang="pug">
Dialog
    div {{ dialogTitle }}
    TextField(
        v-model="form.editModel.value.name"
        :label="t('name')"
        :errors="form.errors.value.name"
        class="margin-top"
        required
    )

    div(class="margin-top--x2 flex flex--justify-between")
        Button(:disabled="form.isSaving.value" type="error" @click="emit('cancel')" ) {{ t('cancel') }}
            template(#iconLeft)
                XMarkIcon(class="icon")
        Button(:disabled="form.isSaving.value" :loading="form.isSaving.value" @click="form.save()") {{ t('save') }}
            template(#iconLeft)
                CheckIcon(class="icon")

</template>

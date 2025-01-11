<script lang="ts" setup>
import {
    computed,
} from 'vue';
import { useI18n } from 'vue-i18n';

import type { CreateProduct, PatchProduct, ViewProduct } from '~api/interfaces/pim/product';
import type { SearchParameters } from '~api/interfaces/api';

import { DEFAULT_INPUT_MAX_LENGTH, DEFAULT_INPUT_MIN_LENGTH } from '~/constants/app';

import { getDefaultDescriptionLocalized } from '~/helpers/misc';

import ProductService from '~api/services/pim/productService';

import { useAuthenticationStore } from '~/store/authentication';

import useForm from '~/composables/form';
import useValidation from '~/composables/validation';

import TextField from '~/components/controls/TextField.vue';
import Dialog from '~/components/dialogs/Dialog.vue';
import TextAreaLocalized from '~/components/controls/TextAreaLocalized.vue';
import CurrencyTextField from '~/components/controls/CurrencyTextField.vue';
import ProductVariantList from '~/components/products/productVariants/ProductVariantList.vue';

const { t } = useI18n();

const authenticationStore = useAuthenticationStore();

const emit = defineEmits<{
    created: [results: ViewProduct[]],
    patched: [results: ViewProduct[]],
    saved: [results: ViewProduct[]],
    cancel: [],
}>();

const productService = new ProductService(
    () => authenticationStore.setUser(),
    () => authenticationStore.deleteUser(),
);

interface Props {
    editId?: string | null;
}
const props = defineProps<Props>();

const getDefaultFormProperties = (): (PatchProduct | CreateProduct) => ({
    name: '',
    descriptionLocalized: getDefaultDescriptionLocalized(),
    defaultPriceInCents: 0,
});

const validation = useValidation();
// This is fine here, because the component will be recreated.
// eslint-disable-next-line vue/no-setup-props-destructure
const form = useForm<ViewProduct, CreateProduct, PatchProduct, SearchParameters>({
    emit,
    service: productService,
    getDefaultFormProperties,
    validationFunctions: {
        name: [(value: string | undefined | null) => validation.limitedString(value, DEFAULT_INPUT_MIN_LENGTH, DEFAULT_INPUT_MAX_LENGTH, false)],
    },
    editId: props.editId,
});

const dialogTitle = computed<string>(() => (props.editId ? t('editProduct') : t('createProduct')));

</script>

<template lang="pug">
Dialog(
    :title="dialogTitle"
    :save-and-cancel="true"
    :disable-saving="form.isSaving.value || form.isLoading.value"
    :is-loading="form.isSaving.value"
    :full-size="true"
    @save="form.save()"
    @close="emit('cancel')"
)

    div(class="grid grid--cols-1-s-2 grid--full-width grid--fix-full-height")
        div
            TextField(
                v-model="form.editModel.value.name"
                :label="t('name')"
                :errors="form.errors.value.name"
                class="margin-top"
                required
            )
            CurrencyTextField(
                v-model="form.editModel.value.defaultPriceInCents"
                :label="t('defaultPrice')"
                :errors="form.errors.value.defaultPriceInCents"
                class="margin-top"
                required
            )

            TextAreaLocalized(
                v-model="form.editModel.value.descriptionLocalized"
                :label="t('description')"
                class="margin-top"
            )
        div(class="vertical-separator")
        div(class="overflow--hidden")
            ProductVariantList(
                v-if="form.origin.value"
                :product="form.origin.value"
            )


</template>

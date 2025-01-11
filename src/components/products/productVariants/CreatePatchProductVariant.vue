<script lang="ts" setup>
import {
    computed,
    ref,
} from 'vue';
import { useI18n } from 'vue-i18n';

import type { CreateProductVariant, PatchProductVariant, ViewProductVariant } from '~api/interfaces/pim/productVariant';
import type { ViewProduct } from '~/sharedLib/api/src/interfaces/pim/product';
import type { SearchParameters } from '~/sharedLib/api/src/interfaces/api';
import type { CreateProductVariantBooleanProperty } from '~/sharedLib/api/src/interfaces/pim/productVariantBooleanProperty';
import type { CreateProductVariantNumericProperty } from '~/sharedLib/api/src/interfaces/pim/productVariantNumericProperty';

import ProductVariantService from '~api/services/pim/productVariantService';

import { useAuthenticationStore } from '~/store/authentication';

import useForm from '~/composables/form';

import Dialog from '~/components/dialogs/Dialog.vue';
import CurrencyTextField from '~/components/controls/CurrencyTextField.vue';
import SelectPicture from '~/components/controls/SelectPicture.vue';
import SelectPictures from '~/components/controls/SelectPictures.vue';
import ManageProductVariantBooleanProperties from '~/components/products/productVariantBooleanProperties/ManageProductVariantBooleanProperties.vue';
import ManageProductVariantNumericProperties from '~/components/products/productVariantNumericProperties/ManageProductVariantNumericProperties.vue';
import ManageProductVariantStringProperties from '~/components/products/productVariantStringProperties/ManageProductVariantStringProperties.vue';
import type { CreateProductVariantStringProperty } from '~/sharedLib/api/src/interfaces/pim/productVariantStringProperty';

const { t } = useI18n();

const authenticationStore = useAuthenticationStore();

const emit = defineEmits<{
    created: [results: ViewProductVariant[]],
    patched: [results: ViewProductVariant[]],
    saved: [results: ViewProductVariant[]],
    cancel: [],
}>();

const productvariantService = new ProductVariantService(
    () => authenticationStore.setUser(),
    () => authenticationStore.deleteUser(),
);

interface Props {
    product: ViewProduct;
    editId?: string | null;
}
const props = defineProps<Props>();

const getDefaultFormProperties = (): (PatchProductVariant | CreateProductVariant) => ({
    productId: props.product.id,
    listPicture: '',
    pictures: [],
    priceInCents: props.product.defaultPriceInCents,
});

// This is fine here, because the component will be recreated.
// eslint-disable-next-line vue/no-setup-props-destructure
const form = useForm<ViewProductVariant, CreateProductVariant, PatchProductVariant, SearchParameters>({
    emit,
    service: productvariantService,
    getDefaultFormProperties,
    editId: props.editId,
});

const toDelete = {
    booleanProperties: ref<string[]>([]),
    numericProperties: ref<string[]>([]),
    stringProperties: ref<string[]>([]),
};
const toCreate = {
    booleanProperties: ref<CreateProductVariantBooleanProperty[]>([]),
    numericProperties: ref<CreateProductVariantNumericProperty[]>([]),
    stringProperties: ref<CreateProductVariantStringProperty[]>([]),
};

const dialogTitle = computed<string>(() => (props.editId ? t('editProductVariant') : t('createProductVariant')));
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

    div(class="grid grid--cols-1-s-2 grid--full-width grid--full-height")
        div(class="flex flex--column flex--gap overflow--scroll-y")
            CurrencyTextField(
                v-model="form.editModel.value.priceInCents"
                :label="t('price')"
                :errors="form.errors.value.priceInCents"
                class="margin-top"
                required
            )

            hr

            ManageProductVariantBooleanProperties(
                v-if="props.editId"
                v-model:to-delete="toDelete.booleanProperties.value"
                v-model:to-create="toCreate.booleanProperties.value"
                :product-variant-id="props.editId"
            )

            hr

            ManageProductVariantNumericProperties(
                v-if="props.editId"
                v-model:to-delete="toDelete.numericProperties.value"
                v-model:to-create="toCreate.numericProperties.value"
                :product-variant-id="props.editId"
            )

            hr

            ManageProductVariantStringProperties(
                v-if="props.editId"
                v-model:to-delete="toDelete.stringProperties.value"
                v-model:to-create="toCreate.stringProperties.value"
                :product-variant-id="props.editId"
            )

        div(class="vertical-separator")
        div(class="overflow--scroll-y")
            SelectPicture(
                v-model="form.editModel.value.listPicture"
                :label="t('listPicture')"
            )
            SelectPictures(
                v-model="form.editModel.value.pictures"
                :label="t('pictures')"
            )


</template>

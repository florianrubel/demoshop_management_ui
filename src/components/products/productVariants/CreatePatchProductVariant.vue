<script lang="ts" setup>
import {
    computed,
    ref,
} from 'vue';
import { useI18n } from 'vue-i18n';

import type { CreateProductVariant, PatchProductVariant, ViewProductVariant } from '~api/interfaces/pim/productVariant';
import type { ViewProduct } from '~/sharedLib/api/src/interfaces/pim/product';
import type { SearchParameters } from '~/sharedLib/api/src/interfaces/api';
import type { CreateProductVariantBooleanProperty, ViewProductVariantBooleanProperty } from '~/sharedLib/api/src/interfaces/pim/productVariantBooleanProperty';
import type { CreateProductVariantNumericProperty, ViewProductVariantNumericProperty } from '~/sharedLib/api/src/interfaces/pim/productVariantNumericProperty';
import type { CreateProductVariantStringProperty, ViewProductVariantStringProperty } from '~/sharedLib/api/src/interfaces/pim/productVariantStringProperty';

import ProductVariantService from '~api/services/pim/productVariantService';

import { useAuthenticationStore } from '~/store/authentication';

import useForm from '~/composables/form';
import { type HydratedProductVariant } from '~/composables/products/productVariantFactory';

import Dialog from '~/components/dialogs/Dialog.vue';
import CurrencyTextField from '~/components/controls/CurrencyTextField.vue';
import SelectPicture from '~/components/controls/SelectPicture.vue';
import SelectPictures from '~/components/controls/SelectPictures.vue';
import ManageProductVariantBooleanProperties from '~/components/products/productVariantBooleanProperties/ManageProductVariantBooleanProperties.vue';
import ManageProductVariantNumericProperties from '~/components/products/productVariantNumericProperties/ManageProductVariantNumericProperties.vue';
import ManageProductVariantStringProperties from '~/components/products/productVariantStringProperties/ManageProductVariantStringProperties.vue';
import LoadingWrapper from '~/components/layout/LoadingWrapper.vue';
import Notification from '~/components/notifications/Notification.vue';

const { t } = useI18n();

const authenticationStore = useAuthenticationStore();

const emit = defineEmits<{
    created: [results: ViewProductVariant[]],
    patched: [results: ViewProductVariant[]],
    saved: [results: ViewProductVariant[]],
    cancel: [],
    refresh: [],
}>();

const productvariantService = new ProductVariantService(
    () => authenticationStore.setUser(),
    () => authenticationStore.deleteUser(),
);

interface Props {
    product: ViewProduct;
    hydratedProductVariant?: HydratedProductVariant;
    editId?: string | null;
}
const props = defineProps<Props>();

const getDefaultFormProperties = (): (PatchProductVariant | CreateProductVariant) => ({
    productId: props.product.id,
    listPicture: '',
    pictures: [],
    priceInCents: props.product.defaultPriceInCents,
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

const toPatch = {
    booleanProperties: ref<ViewProductVariantBooleanProperty[]>([]),
    numericProperties: ref<ViewProductVariantNumericProperty[]>([]),
    stringProperties: ref<ViewProductVariantStringProperty[]>([]),
};

const manageBooleanProperties = ref();
const manageNumericProperties = ref();
const manageStringProperties = ref();

const editId = computed(() => props.editId);
const dialogTitle = computed<string>(() => (props.editId ? t('editProductVariant') : t('createProductVariant')));
const hasChanges = computed<boolean>(() => form.hasChanges.value
    || toDelete.booleanProperties.value.length > 0
    || toDelete.numericProperties.value.length > 0
    || toDelete.stringProperties.value.length > 0
    || toCreate.booleanProperties.value.length > 0
    || toCreate.numericProperties.value.length > 0
    || toCreate.stringProperties.value.length > 0
    || toPatch.booleanProperties.value.length > 0
    || toPatch.numericProperties.value.length > 0
    || toPatch.stringProperties.value.length > 0);

const form = useForm<ViewProductVariant, CreateProductVariant, PatchProductVariant, SearchParameters>({
    emit,
    service: productvariantService,
    getDefaultFormProperties,
    editId,
});

async function save(): Promise<void> {
    await form.save();
    if (props.editId) {
        manageBooleanProperties.value.save();
        manageNumericProperties.value.save();
        manageStringProperties.value.save();
    }
    emit('refresh');
}
</script>

<template lang="pug">
Dialog(
    :title="dialogTitle"
    :save-and-cancel="true"
    :disable-saving="form.isSaving.value || form.isLoading.value || !hasChanges"
    :disable-cancel="form.isSaving.value || form.isLoading.value"
    :has-changes
    :is-loading="form.isSaving.value"
    :full-size="true"
    @save="save()"
    @close="emit('cancel')"
)

    LoadingWrapper(:is-loading="form.isLoading.value")
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

                    template(v-if="props.editId")

                        ManageProductVariantBooleanProperties(
                            ref="manageBooleanProperties"
                            v-model:to-delete="toDelete.booleanProperties.value"
                            v-model:to-create="toCreate.booleanProperties.value"
                            v-model:to-patch="toPatch.booleanProperties.value"
                            :product-variant-id="props.editId"
                            :hydrated-product-variant="props.hydratedProductVariant"
                        )

                        hr

                        ManageProductVariantNumericProperties(
                            ref="manageNumericProperties"
                            v-model:to-delete="toDelete.numericProperties.value"
                            v-model:to-create="toCreate.numericProperties.value"
                            v-model:to-patch="toPatch.numericProperties.value"
                            :product-variant-id="props.editId"
                            :hydrated-product-variant="props.hydratedProductVariant"
                        )

                        hr

                        ManageProductVariantStringProperties(
                            ref="manageStringProperties"
                            v-model:to-delete="toDelete.stringProperties.value"
                            v-model:to-create="toCreate.stringProperties.value"
                            v-model:to-patch="toPatch.stringProperties.value"
                            :product-variant-id="props.editId"
                            :hydrated-product-variant="props.hydratedProductVariant"
                        )

                    template(v-else)
                        Notification(:on-surface="true") {{ t('saveFirstToEditPropertyRelations') }}

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

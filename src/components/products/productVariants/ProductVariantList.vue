<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { CreateProductVariant, PatchProductVariant, ProductVariantPaginationParameters, ViewProductVariant } from '~api/interfaces/pim/productVariant';
import type { ViewProduct } from '~/sharedLib/api/src/interfaces/pim/product';
import type { DataTableAction, DataTableActionEvent, DataTableHeader } from '~/interfaces/dataTable';
import type { SortingDirection } from '~/interfaces/ui';

import { CheckIcon, InformationCircleIcon, PencilIcon, XMarkIcon } from '~/helpers/icons';
import { getCdnBaseUrl } from '~/helpers/env';

import { useAuthenticationStore } from '~/store/authentication';

import useEditable from '~/composables/createEdit';
import useSearchable from '~/composables/searchable';
import useProductVariantFactory, {
    type HydratedBooleanProperty,
    type HydratedNumericProperty,
    type HydratedProductVariant,
    type HydratedStringProperty,
} from '~/composables/products/productVariantFactory';

import ProductVariantService from '~api/services/pim/productVariantService';
import LoadingWrapper from '~/components/layout/LoadingWrapper.vue';
import DataTable from '~/components/layout/dataTable/DataTable.vue';
import DataTableRow from '~/components/layout/dataTable/DataTableRow.vue';
import DataTableColumn from '~/components/layout/dataTable/DataTableColumn.vue';
import CreatePatchProductVariant from '~/components/products/productVariants/CreatePatchProductVariant.vue';

const CDN_BASE_URL = getCdnBaseUrl();

const { t } = useI18n();

const authenticationStore = useAuthenticationStore();

const productvariantService = new ProductVariantService(
    () => authenticationStore.setUser(),
    () => authenticationStore.deleteUser(),
);

const props = defineProps<{
    product: ViewProduct;
}>();

const additionalSearchParameters = computed<Record<string, unknown>>(() => ({
    productIds: props.product.id,
}));

const searchable = useSearchable<
    ViewProductVariant,
    CreateProductVariant,
    PatchProductVariant,
    ProductVariantPaginationParameters
>({
    service: productvariantService,
    initialPageSize: -1,
    additionalSearchParameters,
    postLoadFunction: triggerHydration,
});

const productVariantFactory = useProductVariantFactory(searchable.records);

const editable = useEditable(searchable.delayedLoad);

const sortBy = ref<string>('createdAt');
const sortDirection = ref<SortingDirection>('desc');

async function triggerHydration() {
    await productVariantFactory.hydrate();
}

const headers = computed<DataTableHeader[]>(() => [
    { label: t('picture') },
    { label: t('price'), property: 'priceInCents', allowSorting: true, align: 'right' },
    ...productVariantFactory.booleanProperties.value.map(({ name }) => ({ label: name, property: `booleanProperties.${name}`, allowSorting: true })),
    ...productVariantFactory.numericProperties.value.map(({ name }) => ({ label: name, property: `numericProperties.${name}`, allowSorting: true, align: 'right' })),
    ...productVariantFactory.stringProperties.value.map(({ name }) => ({ label: name, property: `stringProperties.${name}`, allowSorting: true })),
    { label: t('createdAt'), property: 'createdAt', allowSorting: true },
    { label: t('updatedAt'), property: 'updatedAt', allowSorting: true },
]);

const editHydratedProductVariant = computed<HydratedProductVariant | undefined>(() => editable.showEditFor.value
    ? productVariantFactory.hydratedProductVariants.value.find(({ id }) => id === editable.showEditFor.value)
    : undefined);

const dataTableActions = computed<DataTableAction[]>(() => [
    { name: 'edit', icon: PencilIcon },
]);

function handleDataTableAction(actionEvent: DataTableActionEvent) {
    if (actionEvent.name === 'edit') {
        editable.showEditFor.value = actionEvent.value;
    }
}

watch(() => [
    sortBy.value,
    sortDirection.value,
], () => {
    let copy = productVariantFactory.hydratedProductVariants.value.splice(0);
    if (sortBy.value.includes('.')) {
        const [parent, child] = sortBy.value.split('.');
        if (copy.some((variant) => variant[parent as keyof HydratedProductVariant])) {
            copy = copy.sort((a, b) => {
                const fixedA = a[parent as keyof HydratedProductVariant] as Record<string, HydratedBooleanProperty | HydratedNumericProperty | HydratedStringProperty>;
                const fixedB = b[parent as keyof HydratedProductVariant] as Record<string, HydratedBooleanProperty | HydratedNumericProperty | HydratedStringProperty>;
                return sortDirection.value === 'asc' ? fixedA[child].value > fixedB[child].value ? 1 : -1 : fixedA[child].value > fixedB[child].value ? -1 : 1;
            });
        }
    } else {
        copy = copy.sort((a, b) => {
            const fixedA = a[sortBy.value as keyof HydratedProductVariant] as never;
            const fixedB = b[sortBy.value as keyof HydratedProductVariant] as never;
            return sortDirection.value === 'asc' ? fixedA > fixedB ? 1 : -1 : fixedA > fixedB ? -1 : 1;
        });
    }
    productVariantFactory.hydratedProductVariants.value = copy;
});

void searchable.load();
</script>

<template lang="pug">
div(class="flex flex--column flex--gap flex--fix-full-height")
    div
        h2 {{ t('productVariants') }}
        div(class="flex flex--gap-f2 text--neutral")
            InformationCircleIcon(class="icon")
            span {{ t('horizontalScrollHint') }}
    div(class="overflow--hidden flex flex--full-height")
        LoadingWrapper(:is-loading="searchable.isLoading.value")
            DataTable(
                v-model:sort-by="sortBy"
                v-model:sort-direction="sortDirection"
                :headers
                :has-actions="true"
                :first-column-is-picture="true"
            )
                DataTableRow(
                    v-for="productVariant in productVariantFactory.hydratedProductVariants.value"
                    :key="productVariant.id"
                    :actions="dataTableActions"
                    :value="productVariant.id"
                    @action="handleDataTableAction"
                )
                    DataTableColumn(
                        :value="`${CDN_BASE_URL}/${productVariant.listPicture}`"
                        format="picture"
                    )

                    DataTableColumn(
                        :value="productVariant.priceInCents"
                        format="price"
                        align="right"
                    )

                    DataTableColumn(
                        v-for="property in productVariantFactory.booleanProperties.value"
                        :key="property.id"
                    )
                        CheckIcon(
                            v-if="productVariant.booleanProperties[property.name]?.value === true"
                            class="icon text--success"
                        )
                        XMarkIcon(
                            v-else-if="productVariant.booleanProperties[property.name]?.value === false"
                            class="icon text--error"
                        )

                    DataTableColumn(
                        v-for="property in productVariantFactory.numericProperties.value"
                        :key="property.id"
                        format="number"
                        :value="productVariant.numericProperties[property.name]?.value"
                        align="right"
                    )
                    DataTableColumn(
                        v-for="property in productVariantFactory.stringProperties.value"
                        :key="property.id"
                        :value="productVariant.stringProperties[property.name]?.value"
                    )

                    DataTableColumn(
                        :value="product.createdAt"
                        format="datetime"
                    )
                    DataTableColumn(
                        :value="product.updatedAt"
                        format="datetime"
                    )

    CreatePatchProductVariant(
        v-if="editable.showCreate.value || (editable.showEditFor.value && editHydratedProductVariant)"
        :edit-id="editable.showEditFor.value"
        :product="props.product"
        :hydrated-product-variant="editHydratedProductVariant"
        @cancel="editable.hideCreateEdit(true)"
        @refresh="searchable.load()"
    )

</template>

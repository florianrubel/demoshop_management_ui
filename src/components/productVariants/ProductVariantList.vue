<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { CreateProductVariant, PatchProductVariant, ProductVariantPaginationParameters, ViewProductVariant } from '~api/interfaces/pim/productVariant';
import type { ViewProduct } from '~/sharedLib/api/src/interfaces/pim/product';
import type { DataTableAction, DataTableActionEvent, DataTableHeader } from '~/interfaces/dataTable';
import type { SortingDirection } from '~/interfaces/ui';

import { CheckIcon, PencilIcon, XMarkIcon } from '~/helpers/icons';

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
    { label: t('price'), property: 'priceInCents', allowSorting: true },
    ...productVariantFactory.booleanProperties.value.map(({ name }) => ({ label: name, property: `booleanProperties.${name}`, allowSorting: true })),
    ...productVariantFactory.numericProperties.value.map(({ name }) => ({ label: name, property: `numericProperties.${name}`, allowSorting: true })),
    ...productVariantFactory.stringProperties.value.map(({ name }) => ({ label: name, property: `stringProperties.${name}`, allowSorting: true })),
    { label: t('createdAt'), property: 'createdAt', allowSorting: true },
    { label: t('updatedAt'), property: 'updatedAt', allowSorting: true },
]);

const dataTableActions: DataTableAction[] = [
    { name: 'edit', icon: PencilIcon },
];

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
div(class="flex flex--column flex--gap")
    h2 {{ t('productVariants') }}

    LoadingWrapper(:is-loading="searchable.isLoading.value")
        DataTable(
            v-model:sort-by="sortBy"
            v-model:sort-direction="sortDirection"
            :headers
            :has-actions="true"
        )
            DataTableRow(
                v-for="productVariant in productVariantFactory.hydratedProductVariants.value"
                :key="productVariant.id"
                :actions="dataTableActions"
                :value="productVariant.id"
                @action="handleDataTableAction"
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
                        v-if="productVariant.booleanProperties[property.name].value"
                        class="icon text--success"
                    )
                    XMarkIcon(
                        v-else
                        class="icon text--error"
                    )

                DataTableColumn(
                    v-for="property in productVariantFactory.numericProperties.value"
                    :key="property.id"
                    format="number"
                    :value="productVariant.numericProperties[property.name].value"
                )
                DataTableColumn(
                    v-for="property in productVariantFactory.stringProperties.value"
                    :key="property.id"
                    :value="productVariant.stringProperties[property.name].value"
                )

                DataTableColumn(
                    :value="product.createdAt"
                    format="datetime"
                )
                DataTableColumn(
                    :value="product.updatedAt"
                    format="datetime"
                )

    //- CreatePatchProductVariant(
    //-     v-if="editable.showCreate.value || editable.showEditFor.value"
    //-     :edit-id="editable.showEditFor.value"
    //-     @cancel="editable.hideCreateEdit()"
    //-     @saved="editable.hideCreateEdit(true)"
    //- )

</template>

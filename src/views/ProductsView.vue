<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { CreateProduct, PatchProduct, ViewProduct } from '~api/interfaces/pim/product';
import type { SearchParameters } from '~api/interfaces/api';
import type { DataTableAction, DataTableActionEvent, DataTableHeader } from '~/interfaces/dataTable';

import { PencilIcon, PlusIcon } from '~/helpers/icons';

import { getAvailableLanguages } from '~/helpers/misc';

import { useAuthenticationStore } from '~/store/authentication';

import useEditable from '~/composables/createEdit';
import useSearchable from '~/composables/searchable';

import Page from '~/components/layout/Page.vue';
import Panel from '~/components/layout/Panel.vue';
import ProductService from '~api/services/pim/productService';
import CreatePatchProduct from '~/components/products/product/CreatePatchProduct.vue';
import ControlBar from '~/components/layout/ControlBar.vue';
import Button from '~/components/controls/Button.vue';
import DataTable from '~/components/layout/dataTable/DataTable.vue';
import DataTableRow from '~/components/layout/dataTable/DataTableRow.vue';
import DataTableColumn from '~/components/layout/dataTable/DataTableColumn.vue';
import Pagination from '~/components/controls/Pagination.vue';
import Badge from '~/components/layout/Badge.vue';
import LoadingWrapper from '~/components/layout/LoadingWrapper.vue';

const { t } = useI18n();

const authenticationStore = useAuthenticationStore();

const productService = new ProductService(
    () => authenticationStore.setUser(),
    () => authenticationStore.deleteUser(),
);

const searchable = useSearchable<
    ViewProduct,
    CreateProduct,
    PatchProduct,
    SearchParameters
>({
    service: productService,
    initialPageSize: 10,
});

const editable = useEditable(searchable.delayedLoad);

const headers = computed<DataTableHeader[]>(() => [
    { label: t('name'), property: 'name', allowSorting: true },
    { label: t('defaultPrice'), property: 'defaultPriceInCents', allowSorting: true },
    { label: t('description') },
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

void searchable.load();
</script>

<template lang="pug">
Page
    Panel
        Pagination(
            v-model="searchable.page.value"
            :pages="searchable.pages.value"
        )
        LoadingWrapper(:is-loading="searchable.isLoading.value")
            DataTable(
                v-model:sort-by="searchable.sortBy.value"
                v-model:sort-direction="searchable.sortDirection.value"
                class="margin-top"
                :headers
                :loading="searchable.isLoading.value"
                :has-actions="true"
            )
                DataTableRow(
                    v-for="product in searchable.records.value"
                    :key="product.id"
                    :actions="dataTableActions"
                    :value="product.id"
                    @action="handleDataTableAction"
                )
                    DataTableColumn(
                        :value="product.name"
                        format="ellipsis"
                    )
                    DataTableColumn(
                        :value="product.defaultPriceInCents"
                        format="price"
                        align="right"
                    )
                    DataTableColumn
                        div(class="flex flex--gap-f2")
                            Badge(
                                v-for="language in getAvailableLanguages()"
                                :key="language"
                                :type="product.descriptionLocalized[language] ? 'success' : 'error'"
                                :title="product.descriptionLocalized[language] || t('missing')"
                            ) {{ language }}

                    DataTableColumn(
                        :value="product.createdAt"
                        format="datetime"
                    )
                    DataTableColumn(
                        :value="product.updatedAt"
                        format="datetime"
                    )

        ControlBar(
            v-model:search-query="searchable.searchQuery.value"
            :title="t('products')"
            :show-search="true"
            @update:search-query="searchable.delayedLoad"
        )
            template(#actions)
                Button(@click="editable.showCreate.value = true")
                    template(#iconLeft)
                        PlusIcon(class="icon")
                    template(#default) {{ t('create') }}

        CreatePatchProduct(
            v-if="editable.showCreate.value || editable.showEditFor.value"
            :edit-id="editable.showEditFor.value"
            @cancel="editable.hideCreateEdit()"
            @saved="editable.hideCreateEdit(true)"
        )

</template>

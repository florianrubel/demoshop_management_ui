<script setup lang="ts">
import {
    computed, onUnmounted, ref,
} from 'vue';
import { useI18n } from 'vue-i18n';

import type { SearchParameters } from '~api/interfaces/api';
import type { DataTableHeader } from '~/interfaces/dataTable';
import type { ViewBooleanProperty } from '~/sharedLib/api/src/interfaces/pim/properties/booleanProperty';
import type { ViewNumericProperty } from '~/sharedLib/api/src/interfaces/pim/properties/numericProperty';
import type { ViewStringProperty } from '~/sharedLib/api/src/interfaces/pim/properties/stringProperty';

import {
    CheckIcon, InformationCircleIcon, PlusIcon, XMarkIcon,
} from '~/helpers/icons';

import { getCdnBaseUrl, getContentLanguages } from '~/helpers/env';

import { ProductCacheHub } from '~/sharedLib/api/src/signalR/productCacheHub';

import { useAuthenticationStore } from '~/store/authentication';

import useSearchable from '~/composables/searchable';

import Page from '~/components/layout/Page.vue';
import Panel from '~/components/layout/Panel.vue';
import ControlBar from '~/components/layout/ControlBar.vue';
import Button from '~/components/controls/Button.vue';
import DataTable from '~/components/layout/dataTable/DataTable.vue';
import DataTableRow from '~/components/layout/dataTable/DataTableRow.vue';
import DataTableColumn from '~/components/layout/dataTable/DataTableColumn.vue';
import Pagination from '~/components/controls/Pagination.vue';
import Badge from '~/components/layout/Badge.vue';
import LoadingWrapper from '~/components/layout/LoadingWrapper.vue';
import BooleanPropertyService from '~/sharedLib/api/src/services/pim/properties/booleanPropertyService';
import NumericPropertyService from '~/sharedLib/api/src/services/pim/properties/numericPropertyService';
import StringPropertyService from '~/sharedLib/api/src/services/pim/properties/stringPropertyService';
import Notification from '~/components/notifications/Notification.vue';
import ProductCacheService from '~/sharedLib/api/src/services/productCache/productCacheService';
import useProductSearch from '~/composables/products/productSearch';
import FacetControl from '~/components/products/productSearch/FacetControl.vue';

const { t } = useI18n();

const CDN_BASE_URL = getCdnBaseUrl();

const productSearch = useProductSearch();

const productCacheHub = new ProductCacheHub({
    onCacheProgress: (current: number, count: number) => {
        isCaching.value = true;
        cacheProgress.value = Math.round((current / count) * 100) / 100;
        if (cacheProgress.value === 1) {
            isCaching.value = false;
            cacheProgress.value = 0;
            productSearch.load();
        }
    },
});

const authenticationStore = useAuthenticationStore();

const productCacheService = new ProductCacheService(
    () => authenticationStore.setUser(),
    () => authenticationStore.deleteUser(),
);

const booleanPropertyService = new BooleanPropertyService(
    () => authenticationStore.setUser(),
    () => authenticationStore.deleteUser(),
);
const numericPropertyService = new NumericPropertyService(
    () => authenticationStore.setUser(),
    () => authenticationStore.deleteUser(),
);
const stringPropertyService = new StringPropertyService(
    () => authenticationStore.setUser(),
    () => authenticationStore.deleteUser(),
);

const searchableBooleanProperties = useSearchable<
    ViewBooleanProperty,
    SearchParameters
>({
    service: booleanPropertyService,
    initialPageSize: -1,
});
const searchableNumericProperties = useSearchable<
    ViewNumericProperty,
    SearchParameters
>({
    service: numericPropertyService,
    initialPageSize: -1,
});
const searchableStringProperties = useSearchable<
    ViewStringProperty,
    SearchParameters
>({
    service: stringPropertyService,
    initialPageSize: -1,
});

const isCaching = ref<boolean>(false);
const cacheProgress = ref<number>(0);

const headers = computed<DataTableHeader[]>(() => [
    { label: t('picture') },
    { label: t('product') },
    { label: t('price'), align: 'right' },
    { label: t('description') },
    ...searchableBooleanProperties.records.value.map(({ name }) => ({ label: name })),
    ...searchableNumericProperties.records.value.map(({ name }) => ({ label: name, align: 'right' })),
    ...searchableStringProperties.records.value.map(({ name }) => ({ label: name })),
]);

function buildCache() {
    try {
        isCaching.value = true;
        cacheProgress.value = 0;
        productCacheService.buildCache();
    } catch {
        // do something
    }
}

async function created() {
    searchableBooleanProperties.load();
    searchableNumericProperties.load();
    searchableStringProperties.load();
    productSearch.load();
    await productCacheHub.startConnection();
}

onUnmounted(async () => {
    await productCacheHub.stopConnection();
});

created();
</script>

<template lang="pug">
Page
    Panel
        div(
            class="flex flex--gap-f2 text--neutral"
        )
            InformationCircleIcon(class="icon")
            span {{ t('horizontalScrollHint') }}

        Pagination(
            v-model="productSearch.page.value"
            :pages="productSearch.pages.value"
            class="margin-top"
        )
        FacetControl(
            v-model:boolean-facets="productSearch.filters.booleanProperties.value"
            v-model:string-facets="productSearch.filters.stringProperties.value"
            :result="productSearch.result.value"
            :result-raw="productSearch.resultRaw.value"
            @search="productSearch.load()"
        )
            LoadingWrapper(:is-loading="productSearch.isLoading.value")
                DataTable(
                    class="margin-top"
                    :headers
                    :loading="productSearch.isLoading.value"
                )
                    DataTableRow(
                        v-for="cacheItem in productSearch.records.value"
                        :key="cacheItem.id"
                    )
                        DataTableColumn(
                            :value="`${CDN_BASE_URL}/${cacheItem.listPicture}`"
                            format="picture"
                        )
                        DataTableColumn(
                            :value="cacheItem.name"
                            format="ellipsis"
                        )
                        DataTableColumn(
                            :value="cacheItem.priceInCents"
                            format="price"
                            align="right"
                        )
                        DataTableColumn
                            div(class="flex flex--gap-f2")
                                Badge(
                                    v-for="language in getContentLanguages()"
                                    :key="language"
                                    :type="cacheItem.description[language] ? 'success' : 'error'"
                                    :title="cacheItem.description[language] || t('missing')"
                                ) {{ language }}

                        DataTableColumn(
                            v-for="property in searchableBooleanProperties.records.value"
                            :key="property.id"
                        )
                            CheckIcon(
                                v-if="cacheItem.booleanProperties[property.name] === true"
                                class="icon text--success"
                            )
                            XMarkIcon(
                                v-else-if="cacheItem.booleanProperties[property.name] === false"
                                class="icon text--error"
                            )

                        DataTableColumn(
                            v-for="property in searchableNumericProperties.records.value"
                            :key="property.id"
                            format="number"
                            :value="cacheItem.numericProperties[property.name]"
                            align="right"
                        )
                        DataTableColumn(
                            v-for="property in searchableStringProperties.records.value"
                            :key="property.id"
                            :value="cacheItem.stringProperties[property.name]"
                        )

        Notification(
            v-if="!productSearch.total.value"
            :on-surface="true"
            class="margin-top"
        ) {{ t('noProductsCached') }}

        ControlBar(
            v-model:search-query="productSearch.searchQuery.value"
            :title="t('productsCache')"
            :show-search="true"
            @update:search-query="productSearch.delayedLoad"
        )
            template(#actions)
                Button(
                    :progress="isCaching ? cacheProgress : undefined"
                    @click="buildCache"
                )
                    template(#iconLeft)
                        PlusIcon(class="icon")
                    template(#default) {{ t('updateCache') }}

</template>

import { ref, watch } from 'vue';
import { getPaginationHeaders } from '~/sharedLib/api/src/helpers/api';
import type {
    ProductSearchResult, NumericRange, ProductSearchItem,
} from '~/sharedLib/api/src/interfaces/productSearch/productSearch';
import ProductSearchService from '~/sharedLib/api/src/services/productSearch/productSearchService';

export default function useProductSearch() {
    const productSearchService = new ProductSearchService();

    let searchAbortController: AbortController | null;

    const searchTimeout = ref<NodeJS.Timeout | undefined>(undefined);
    const searchQuery = ref<string>('');
    const isLoading = ref<boolean>(false);
    const page = ref<number>(1);
    const pages = ref<number>(1);
    const pageSize = ref<number>(25);
    const total = ref<number>(0);
    const records = ref<ProductSearchItem[]>([]);
    const result = ref<ProductSearchResult | null>(null);
    const resultRaw = ref<ProductSearchResult | null>(null);

    const filters = {
        booleanProperties: ref<Record<string, boolean[]>>({}),
        numericProperties: ref<Record<string, NumericRange>>({}),
        stringProperties: ref<Record<string, string[]>>({}),
    };

    function initFilters(): void {
        Object.keys(resultRaw.value?.booleanFacets || []).forEach((key) => {
            if (!filters.booleanProperties.value[key]) {
                filters.booleanProperties.value[key] = [];
            }
        });
        Object.keys(resultRaw.value?.numericFacets || []).forEach((key) => {
            if (!filters.numericProperties.value[key]) {
                filters.numericProperties.value[key] = {};
            }
        });
        Object.keys(resultRaw.value?.stringFacets || []).forEach((key) => {
            if (!filters.stringProperties.value[key]) {
                filters.stringProperties.value[key] = [];
            }
        });
    }

    async function load(): Promise<void> {
        isLoading.value = true;
        try {
            if (searchAbortController) searchAbortController.abort();
            searchAbortController = new AbortController();

            const resRaw = await productSearchService.search({}, searchAbortController.signal);
            resultRaw.value = resRaw.data;

            const res = await productSearchService.search({
                page: page.value,
                distinct: false,
                searchQuery: searchQuery.value,
                booleanFilters: filters.booleanProperties.value,
                numericFilters: filters.numericProperties.value,
                stringFilters: filters.stringProperties.value,
            }, searchAbortController.signal);

            records.value = res.data.products;

            result.value = res.data;

            initFilters();

            const resHeaders = getPaginationHeaders(res);
            pages.value = resHeaders.pages;
            pageSize.value = resHeaders.pageSize;
            total.value = resHeaders.total;
        } catch {
            // do something
        }
        isLoading.value = false;
    }

    function delayedLoad() {
        searchTimeout.value = setTimeout(() => {
            load();
        }, 1000);
    }

    watch(page, () => load());

    // watch(() => filters.value, () => {
    //     console.log(filters.value);
    // }, { deep: true });

    return {
        searchQuery,
        isLoading,
        page,
        pages,
        pageSize,
        total,
        records,
        filters,
        result,
        resultRaw,

        load,
        delayedLoad,
    };
}

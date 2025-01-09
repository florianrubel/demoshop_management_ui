import axios from 'axios';
import { ref, watch, type ComputedRef } from 'vue';
import { useI18n } from 'vue-i18n';

import type { SortingDirection } from '~/interfaces/ui';

import type AbstractDefaultService from '~api/services/abstractDefaultService';

import { useNotificationStore } from '~/store/notifications';

export default function useSearchable<ViewType, CreateType, PatchType, SearchParametersType>({
    service,
    initialPageSize,
    ids,
    additionalSearchParameters,
    postLoadFunction,
}: {
    service: AbstractDefaultService<ViewType, CreateType, PatchType, SearchParametersType>;
    initialPageSize?: number;
    ids?: ComputedRef<string[]>;
    additionalSearchParameters?: ComputedRef<Record<string, unknown>>;
    postLoadFunction?: () => Promise<unknown>;
},
) {
    const { t } = useI18n();

    const notificationStore = useNotificationStore();

    const records = ref<ViewType[]>([]);
    const searchAbortController = ref<AbortController | null>(null);
    const isLoading = ref<boolean>(false);
    const searchQuery = ref<string>('');
    const searchTimeout = ref<NodeJS.Timeout | undefined>(undefined);
    const page = ref<number>(1);
    const pageSize = ref<number>(initialPageSize || 25);
    const pages = ref<number>(1);
    const total = ref<number>(0);
    const sortBy = ref<string>('createdAt');
    const sortDirection = ref<SortingDirection>('desc');

    async function load(): Promise<void> {
        isLoading.value = true;
        try {
            if (searchAbortController.value) searchAbortController.value.abort();
            searchAbortController.value = new AbortController();
            if (ids?.value) {
                const res = await service.getMultipleByIdsByPost(ids.value);
                records.value = res.data;
            } else {
                // @ts-expect-error This is ok here, because the searchQuery
                // will be ignored, if the endpoint can't use it.
                const res = await service.getMultiple({
                    searchQuery: searchQuery.value,
                    page: page.value,
                    pageSize: pageSize.value,
                    orderBy: `${sortBy.value} ${sortDirection.value}`,
                    ...(additionalSearchParameters?.value || {}),
                }, searchAbortController.value.signal);

                records.value = res.data;
                page.value = Number.parseInt(res.headers['pagination.page']);
                pages.value = Number.parseInt(res.headers['pagination.totalpages']);
                pageSize.value = Number.parseInt(res.headers['pagination.pagesize']);
                total.value = Number.parseInt(res.headers['pagination.totalcount']);
                if (postLoadFunction) await postLoadFunction();
            }
        } catch (error) {
            if (!axios.isCancel(error)) {
                notificationStore.addNotification({
                    text: t('dataNotLoaded'),
                    type: 'error',
                });
            }
        }
        searchAbortController.value = null;
        isLoading.value = false;
    }

    function delayedLoad(){
        searchTimeout.value = setTimeout(() => {
            void load();
        }, 1000);
    }

    watch(
        () => [
            page.value,
            sortBy.value,
            sortDirection.value,
            ids?.value,
            additionalSearchParameters?.value,
        ],
        () => load(),
    );

    return {
        records,
        isLoading,
        searchQuery,
        page,
        pageSize,
        pages,
        total,
        sortBy,
        sortDirection,

        load,
        delayedLoad,
    };
}


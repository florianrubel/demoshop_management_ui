<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { ViewNumericProperty } from '~/sharedLib/api/src/interfaces/pim/properties/numericProperty';
import type { DataTableAction, DataTableActionEvent } from '~/interfaces/dataTable';

import NumericPropertyService from '~/sharedLib/api/src/services/pim/properties/numericPropertyService';

import { PencilIcon, PlusIcon } from '~/helpers/icons';

import { useAuthenticationStore } from '~/store/authentication';
import { useNotificationStore } from '~/store/notifications';

import CreatePatchNumericProperty from '~/components/products/properties/numericProperty/CreatePatchNumericProperty.vue';
import ControlBar from '~/components/layout/ControlBar.vue';
import Button from '~/components/controls/Button.vue';
import DataTable from '~/components/layout/dataTable/DataTable.vue';
import DataTableRow from '~/components/layout/dataTable/DataTableRow.vue';
import DataTableColumn from '~/components/layout/dataTable/DataTableColumn.vue';

const { t } = useI18n();

const authenticationStore = useAuthenticationStore();
const notificationStore = useNotificationStore();

const numericPropertyService = new NumericPropertyService(
    () => authenticationStore.setUser(),
    () => authenticationStore.deleteUser(),
);

const numericProperties = ref<ViewNumericProperty[]>([]);
const isLoading = ref<boolean>(false);
const showCreate = ref<boolean>(false);
const showEditFor = ref<string | null | undefined>(null);
const searchTimeout = ref<NodeJS.Timeout | undefined>(undefined);
const searchQuery = ref<string>('');
const searchAbortController = ref<AbortController | null>(null);

const headers = computed<string[]>(() => [
    t('name'),
    t('minValue'),
    t('maxValue'),
    t('createdAt'),
    t('updatedAt'),
]);

const dataTableActions: DataTableAction[] = [
    { name: 'edit', icon: PencilIcon },
];

async function load(): Promise<void> {
    isLoading.value = true;
    try {
        if (searchAbortController.value) searchAbortController.value.abort();
        searchAbortController.value = new AbortController();
        const res = await numericPropertyService.getMultiple({
            searchQuery: searchQuery.value,
        }, searchAbortController.value.signal);
        numericProperties.value = res.data;
    } catch {
        notificationStore.addNotification({
            text: t('dataNotLoaded'),
            type: 'error',
        });
    }
    searchAbortController.value = null;
    isLoading.value = false;
}

function hideCreateEdit(loadData?: boolean) {
    showCreate.value = false;
    showEditFor.value = null;
    if (loadData) {
        void load();
    }
}

function handleDataTableAction(actionEvent: DataTableActionEvent) {
    if (actionEvent.name === 'edit') {
        showEditFor.value = actionEvent.value;
    }
}

function delayedSearch(){
    searchTimeout.value = setTimeout(() => {
        void load();
    }, 1000);
}

void load();
</script>

<template lang="pug">
ControlBar(
    v-model:search-query="searchQuery"
    :title="t('numericProperties')"
    :show-search="true"
    @update:search-query="delayedSearch"
)
    template(#actions)
        Button(@click="showCreate = true")
            template(#iconLeft)
                PlusIcon(class="icon")
            template(#default) {{ t('create') }}

DataTable(
    :headers
    class="margin-top"
    :loading="isLoading"
    :has-actions="true"
)
    DataTableRow(
        v-for="numericProperty in numericProperties"
        :key="numericProperty.id"
        :actions="dataTableActions"
        :value="numericProperty.id"
        @action="handleDataTableAction"
    )
        DataTableColumn(
            :value="numericProperty.name"
        )
        DataTableColumn(
            :value="numericProperty.minValue"
        )
        DataTableColumn(
            :value="numericProperty.maxValue"
        )
        DataTableColumn(
            :value="numericProperty.createdAt"
            format="datetime"
        )
        DataTableColumn(
            :value="numericProperty.updatedAt"
            format="datetime"
        )


CreatePatchNumericProperty(
    v-if="showCreate || showEditFor"
    :edit-id="showEditFor"
    @cancel="hideCreateEdit()"
    @saved="hideCreateEdit(true)"
)
</template>

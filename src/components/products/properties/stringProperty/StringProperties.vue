<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { ViewStringProperty } from '~/sharedLib/api/src/interfaces/pim/properties/stringProperty';
import type { DataTableAction, DataTableActionEvent } from '~/interfaces/dataTable';

import StringPropertyService from '~/sharedLib/api/src/services/pim/properties/stringPropertyService';

import { PencilIcon, PlusIcon } from '~/helpers/icons';

import { useAuthenticationStore } from '~/store/authentication';
import { useNotificationStore } from '~/store/notifications';

import CreatePatchStringProperty from '~/components/products/properties/stringProperty/CreatePatchStringProperty.vue';
import ControlBar from '~/components/layout/ControlBar.vue';
import Button from '~/components/controls/Button.vue';
import DataTable from '~/components/layout/dataTable/DataTable.vue';
import DataTableRow from '~/components/layout/dataTable/DataTableRow.vue';
import DataTableColumn from '~/components/layout/dataTable/DataTableColumn.vue';

const { t } = useI18n();

const authenticationStore = useAuthenticationStore();
const notificationStore = useNotificationStore();

const stringPropertyService = new StringPropertyService(
    () => authenticationStore.setUser(),
    () => authenticationStore.deleteUser(),
);

const stringProperties = ref<ViewStringProperty[]>([]);
const isLoading = ref<boolean>(false);
const showCreate = ref<boolean>(false);
const showEditFor = ref<string | null | undefined>(null);
const searchTimeout = ref<NodeJS.Timeout | undefined>(undefined);
const searchQuery = ref<string>('');
const searchAbortController = ref<AbortController | null>(null);

const headers = computed<string[]>(() => [
    t('name'),
    t('allowedValues'),
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
        const res = await stringPropertyService.getMultiple({
            searchQuery: searchQuery.value,
        }, searchAbortController.value.signal);
        stringProperties.value = res.data;
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
    :title="t('stringProperties')"
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
        v-for="stringProperty in stringProperties"
        :key="stringProperty.id"
        :actions="dataTableActions"
        :value="stringProperty.id"
        @action="handleDataTableAction"
    )
        DataTableColumn(
            :value="stringProperty.name"
        )
        DataTableColumn(
            :value="stringProperty.allowedValues"
            format="list"
        )
        DataTableColumn(
            :value="stringProperty.createdAt"
            format="datetime"
        )
        DataTableColumn(
            :value="stringProperty.updatedAt"
            format="datetime"
        )


CreatePatchStringProperty(
    v-if="showCreate || showEditFor"
    :edit-id="showEditFor"
    @cancel="hideCreateEdit()"
    @saved="hideCreateEdit(true)"
)
</template>

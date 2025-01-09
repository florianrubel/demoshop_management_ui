<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { CreateStringProperty, PatchStringProperty, ViewStringProperty } from '~api/interfaces/pim/properties/stringProperty';
import type { DataTableAction, DataTableActionEvent, DataTableHeader } from '~/interfaces/dataTable';
import type { SearchParameters } from '~api/interfaces/api';

import StringPropertyService from '~api/services/pim/properties/stringPropertyService';

import { PencilIcon, PlusIcon } from '~/helpers/icons';

import { useAuthenticationStore } from '~/store/authentication';

import useEditable from '~/composables/createEdit';
import useSearchable from '~/composables/searchable';

import CreatePatchStringProperty from '~/components/products/properties/stringProperty/CreatePatchStringProperty.vue';
import ControlBar from '~/components/layout/ControlBar.vue';
import Button from '~/components/controls/Button.vue';
import DataTable from '~/components/layout/dataTable/DataTable.vue';
import DataTableRow from '~/components/layout/dataTable/DataTableRow.vue';
import DataTableColumn from '~/components/layout/dataTable/DataTableColumn.vue';

const { t } = useI18n();

const authenticationStore = useAuthenticationStore();

const stringPropertyService = new StringPropertyService(
    () => authenticationStore.setUser(),
    () => authenticationStore.deleteUser(),
);
const searchable = useSearchable<
    ViewStringProperty,
    CreateStringProperty,
    PatchStringProperty,
    SearchParameters
>({ service: stringPropertyService });

const editable = useEditable(searchable.load);

const headers = computed<DataTableHeader[]>(() => [
    { label: t('name'), property: 'name', allowSorting: true },
    { label: t('allowedValues') },
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
ControlBar(
    v-model:search-query="searchable.searchQuery.value"
    :title="t('stringProperties')"
    :show-search="true"
    @update:search-query="searchable.delayedLoad"
)
    template(#actions)
        Button(@click="editable.showCreate.value = true")
            template(#iconLeft)
                PlusIcon(class="icon")
            template(#default) {{ t('create') }}

DataTable(
    :headers
    class="margin-top"
    :loading="searchable.isLoading.value"
    :has-actions="true"
)
    DataTableRow(
        v-for="stringProperty in searchable.records.value"
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
    v-if="editable.showCreate.value || editable.showEditFor.value"
    :edit-id="editable.showEditFor.value"
    @cancel="editable.hideCreateEdit()"
    @saved="editable.hideCreateEdit(true)"
)
</template>

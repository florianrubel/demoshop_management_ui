<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { CreateNumericProperty, PatchNumericProperty, ViewNumericProperty } from '~api/interfaces/pim/properties/numericProperty';
import type { DataTableAction, DataTableActionEvent, DataTableHeader } from '~/interfaces/dataTable';
import type { SearchParameters } from '~api/interfaces/api';

import NumericPropertyService from '~api/services/pim/properties/numericPropertyService';

import { PencilIcon, PlusIcon } from '~/helpers/icons';

import { useAuthenticationStore } from '~/store/authentication';

import useEditable from '~/composables/createEdit';
import useSearchable from '~/composables/searchable';

import CreatePatchNumericProperty from '~/components/products/properties/numericProperty/CreatePatchNumericProperty.vue';
import ControlBar from '~/components/layout/ControlBar.vue';
import Button from '~/components/controls/Button.vue';
import DataTable from '~/components/layout/dataTable/DataTable.vue';
import DataTableRow from '~/components/layout/dataTable/DataTableRow.vue';
import DataTableColumn from '~/components/layout/dataTable/DataTableColumn.vue';

const { t } = useI18n();

const authenticationStore = useAuthenticationStore();

const numericPropertyService = new NumericPropertyService(
    () => authenticationStore.setUser(),
    () => authenticationStore.deleteUser(),
);

const searchable = useSearchable<
    ViewNumericProperty,
    CreateNumericProperty,
    PatchNumericProperty,
    SearchParameters
>({ service: numericPropertyService });

const editable = useEditable(searchable.load);

const headers = computed<DataTableHeader[]>(() => [
    { label: t('name'), property: 'name', allowSorting: true },
    { label: t('minValue'), property: 'createdAt', allowSorting: true },
    { label: t('maxValue'), property: 'createdAt', allowSorting: true },
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
    :title="t('numericProperties')"
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
        v-for="numericProperty in searchable.records.value"
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
    v-if="editable.showCreate.value || editable.showEditFor.value"
    :edit-id="editable.showEditFor.value"
    @cancel="editable.hideCreateEdit()"
    @saved="editable.hideCreateEdit(true)"
)
</template>

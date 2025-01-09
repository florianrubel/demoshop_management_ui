<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { DataTableAction, DataTableActionEvent, DataTableHeader } from '~/interfaces/dataTable';
import type { CreateBooleanProperty, PatchBooleanProperty, ViewBooleanProperty } from '~api/interfaces/pim/properties/booleanProperty';
import type { SearchParameters } from '~api/interfaces/api';

import BooleanPropertyService from '~api/services/pim/properties/booleanPropertyService';

import { PencilIcon, PlusIcon } from '~/helpers/icons';

import { useAuthenticationStore } from '~/store/authentication';

import useEditable from '~/composables/createEdit';
import useSearchable from '~/composables/searchable';

import CreatePatchBooleanProperty from '~/components/products/properties/booleanProperty/CreatePatchBooleanProperty.vue';
import ControlBar from '~/components/layout/ControlBar.vue';
import Button from '~/components/controls/Button.vue';
import DataTable from '~/components/layout/dataTable/DataTable.vue';
import DataTableRow from '~/components/layout/dataTable/DataTableRow.vue';
import DataTableColumn from '~/components/layout/dataTable/DataTableColumn.vue';
import LoadingWrapper from '~/components/layout/LoadingWrapper.vue';

const { t } = useI18n();

const authenticationStore = useAuthenticationStore();

const booleanPropertyService = new BooleanPropertyService(
    () => authenticationStore.setUser(),
    () => authenticationStore.deleteUser(),
);
const searchable = useSearchable<
    ViewBooleanProperty,
    CreateBooleanProperty,
    PatchBooleanProperty,
    SearchParameters
>({ service: booleanPropertyService });

const editable = useEditable(searchable.load);

const headers = computed<DataTableHeader[]>(() => [
    { label: t('name'), property: 'name', allowSorting: true },
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
    :title="t('booleanProperties')"
    :show-search="true"
    @update:search-query="searchable.delayedLoad"
)
    template(#actions)
        Button(@click="editable.showCreate.value = true")
            template(#iconLeft)
                PlusIcon(class="icon")
            template(#default) {{ t('create') }}

LoadingWrapper(:is-loading="searchable.isLoading.value")
    DataTable(
        :headers
        class="margin-top"
        :has-actions="true"
    )
        DataTableRow(
            v-for="booleanProperty in searchable.records.value"
            :key="booleanProperty.id"
            :actions="dataTableActions"
            :value="booleanProperty.id"
            @action="handleDataTableAction"
        )
            DataTableColumn(
                :value="booleanProperty.name"
            )
            DataTableColumn(
                :value="booleanProperty.createdAt"
                format="datetime"
            )
            DataTableColumn(
                :value="booleanProperty.updatedAt"
                format="datetime"
            )


CreatePatchBooleanProperty(
    v-if="editable.showCreate.value || editable.showEditFor.value"
    :edit-id="editable.showEditFor.value"
    @cancel="editable.hideCreateEdit()"
    @saved="editable.hideCreateEdit(true)"
)
</template>

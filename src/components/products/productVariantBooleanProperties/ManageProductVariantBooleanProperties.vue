<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type {
    CreateProductVariantBooleanProperty,
    PatchProductVariantBooleanProperty,
    ProductVariantBooleanPropertyPaginationParameters,
    ViewProductVariantBooleanProperty,
} from '~/sharedLib/api/src/interfaces/pim/productVariantBooleanProperty';
import type { SearchParameters } from '~/sharedLib/api/src/interfaces/api';
import type { CreateBooleanProperty, PatchBooleanProperty, ViewBooleanProperty } from '~/sharedLib/api/src/interfaces/pim/properties/booleanProperty';
import type { SelectOption } from '~/interfaces/ui';
import type { DataTableAction, DataTableActionEvent, DataTableHeader } from '~/interfaces/dataTable';

import { ArrowUturnLeftIcon, PlusIcon, XMarkIcon } from '~/helpers/icons';

import { useAuthenticationStore } from '~/store/authentication';

import ProductVariantBooleanPropertyService from '~/sharedLib/api/src/services/pim/productVariantBooleanPropertyService';

import useSearchable from '~/composables/searchable';

import BooleanPropertyService from '~/sharedLib/api/src/services/pim/properties/booleanPropertyService';
import Checkbox from '~/components/controls/Checkbox.vue';
import Select from '~/components/controls/Select.vue';
import Button from '~/components/controls/Button.vue';
import DataTable from '~/components/layout/dataTable/DataTable.vue';
import DataTableRow from '~/components/layout/dataTable/DataTableRow.vue';
import DataTableColumn from '~/components/layout/dataTable/DataTableColumn.vue';

const { t } = useI18n();

const authentionStore = useAuthenticationStore();

const relationService = new ProductVariantBooleanPropertyService(
    () => authentionStore.setUser(),
    () => authentionStore.deleteUser(),
);

const propertyService = new BooleanPropertyService(
    () => authentionStore.setUser(),
    () => authentionStore.deleteUser(),
);

const props = defineProps<{
    productVariantId: string;
}>();

const toDelete = defineModel<string[]>('toDelete', { default: [] });
const toCreate = defineModel<CreateProductVariantBooleanProperty[]>('toCreate', { default: [] });

const newRelationHandle = ref<string | null>(null);

const additionalSearchParameters = computed<Record<string, string>>(() => ({
    productVariantIds: props.productVariantId,
}));

const propertiesMap = computed<Record<string, ViewBooleanProperty>>(() => {
    const map: Record<string, ViewBooleanProperty> = {};
    searchableProperties.records.value.forEach((record) => {
        map[record.id] = record;
    });
    return map;
});

const availableProperties = computed<ViewBooleanProperty[]>(() => searchableProperties.records.value
    .filter(({ id }) => !searchable.records.value.some(({ propertyId }) => propertyId === id)));

const propertiesSelectOptions = computed<SelectOption<string>[]>(() => [
    { value: null, label: t('pleaseChoose') },
    ...availableProperties.value.map(({ id, name }) => ({
        value: id,
        label: name,
    })),
]);

const headers = computed<DataTableHeader[]>(() => [
    { label: t('name') },
    { label: t('value') },
]);

const existingAndNew = computed<(ViewProductVariantBooleanProperty | CreateProductVariantBooleanProperty)[]>(() => [
    ...searchable.records.value,
    ...toCreate.value,
]);

const searchable = useSearchable<
    ViewProductVariantBooleanProperty,
    CreateProductVariantBooleanProperty,
    PatchProductVariantBooleanProperty,
    ProductVariantBooleanPropertyPaginationParameters
>({
    service: relationService,
    initialPageSize: -1,
    additionalSearchParameters,
});

const searchableProperties = useSearchable<
    ViewBooleanProperty,
    CreateBooleanProperty,
    PatchBooleanProperty,
    SearchParameters
>({
    service: propertyService,
    initialPageSize: -1,
});

const dataTableActions: DataTableAction[] = [
    {
        name: 'restore',
        icon: ArrowUturnLeftIcon,
        label: t('restore'),
        conditionalFunction: (value?: string | null) => !!value && toDelete.value.includes(value),
    },
    {
        name: 'delete',
        icon: XMarkIcon,
        label: t('delete'),
        conditionalFunction: (value?: string | null) => !!value && !toDelete.value.includes(value),
    },
];

function handleDataTableAction(actionEvent: DataTableActionEvent) {
    if (!actionEvent.value) return;
    switch(actionEvent.name) {
    case 'delete':
        toDelete.value = [
            ...toDelete.value,
            actionEvent.value,
        ];
        break;
    case 'restore':
        toDelete.value = toDelete.value.filter((fValue) => fValue !== actionEvent.value);
        break;
    }
}

function addNewRelation(): void {
    if (!newRelationHandle.value) return;
    toCreate.value = [
        ...toCreate.value,
        {
            productVariantId: props.productVariantId,
            propertyId: newRelationHandle.value,
            value: false,
        },
    ];
    newRelationHandle.value = null;
}

void searchable.load();
void searchableProperties.load();
</script>

<template lang="pug">
div(class="flex flex--column flex--gap-f2")
    h2 {{ t('booleanProperties') }}

    DataTable(
        :headers
        :has-actions="true"
    )
        DataTableRow(
            v-for="relation in existingAndNew"
            :key="relation.propertyId"
            :value="relation.propertyId"
            :actions="dataTableActions"
            @action="handleDataTableAction"
        )
            DataTableColumn(:value="propertiesMap[relation.propertyId]?.name")
            DataTableColumn
                Checkbox(
                    v-model="relation.value"
                    :disabled="toDelete.includes(relation.propertyId)"
                )

    div(class="flex flex--column flex--gap-f2")
        Select(
            v-model="newRelationHandle"
            :label="t('addProperty')"
            :options="propertiesSelectOptions"
            :disabled="!availableProperties.length"
        )
        Button(
            :blank="true"
            :disabled="!availableProperties.length || !newRelationHandle"
            @click="addNewRelation()"
        )
            template(#iconLeft)
                PlusIcon
            template(#default) {{ t('add') }}
</template>

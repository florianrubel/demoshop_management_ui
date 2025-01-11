<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type {
    CreateProductVariantNumericProperty,
    PatchProductVariantNumericProperty,
    ProductVariantNumericPropertyPaginationParameters,
    ViewProductVariantNumericProperty,
} from '~/sharedLib/api/src/interfaces/pim/productVariantNumericProperty';
import type { SearchParameters } from '~/sharedLib/api/src/interfaces/api';
import type { CreateNumericProperty, PatchNumericProperty, ViewNumericProperty } from '~/sharedLib/api/src/interfaces/pim/properties/numericProperty';
import type { SelectOption } from '~/interfaces/ui';
import type { DataTableAction, DataTableActionEvent, DataTableHeader } from '~/interfaces/dataTable';

import { ArrowUturnLeftIcon, PlusIcon, XMarkIcon } from '~/helpers/icons';

import { useAuthenticationStore } from '~/store/authentication';

import ProductVariantNumericPropertyService from '~/sharedLib/api/src/services/pim/productVariantNumericPropertyService';

import useSearchable from '~/composables/searchable';

import NumericPropertyService from '~/sharedLib/api/src/services/pim/properties/numericPropertyService';
import Select from '~/components/controls/Select.vue';
import Button from '~/components/controls/Button.vue';
import DataTable from '~/components/layout/dataTable/DataTable.vue';
import DataTableRow from '~/components/layout/dataTable/DataTableRow.vue';
import DataTableColumn from '~/components/layout/dataTable/DataTableColumn.vue';
import TextField from '~/components/controls/TextField.vue';

const { t } = useI18n();

const authentionStore = useAuthenticationStore();

const relationService = new ProductVariantNumericPropertyService(
    () => authentionStore.setUser(),
    () => authentionStore.deleteUser(),
);

const propertyService = new NumericPropertyService(
    () => authentionStore.setUser(),
    () => authentionStore.deleteUser(),
);

const props = defineProps<{
    productVariantId: string;
}>();

const toDelete = defineModel<string[]>('toDelete', { default: [] });
const toCreate = defineModel<CreateProductVariantNumericProperty[]>('toCreate', { default: [] });

const newRelationHandle = ref<string | null>(null);

const additionalSearchParameters = computed<Record<string, string>>(() => ({
    productVariantIds: props.productVariantId,
}));

const propertiesMap = computed<Record<string, ViewNumericProperty>>(() => {
    const map: Record<string, ViewNumericProperty> = {};
    searchableProperties.records.value.forEach((record) => {
        map[record.id] = record;
    });
    return map;
});

const availableProperties = computed<ViewNumericProperty[]>(() => searchableProperties.records.value
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

const existingAndNew = computed<(ViewProductVariantNumericProperty | CreateProductVariantNumericProperty)[]>(() => [
    ...searchable.records.value,
    ...toCreate.value,
]);

const searchable = useSearchable<
    ViewProductVariantNumericProperty,
    CreateProductVariantNumericProperty,
    PatchProductVariantNumericProperty,
    ProductVariantNumericPropertyPaginationParameters
>({
    service: relationService,
    initialPageSize: -1,
    additionalSearchParameters,
});

const searchableProperties = useSearchable<
    ViewNumericProperty,
    CreateNumericProperty,
    PatchNumericProperty,
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
            value: 0,
        },
    ];
    newRelationHandle.value = null;
}

void searchable.load();
void searchableProperties.load();
</script>

<template lang="pug">
div(class="flex flex--column flex--gap-f2")
    h2 {{ t('numericProperties') }}

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
                TextField(
                    v-model="relation.value"
                    :disabled="toDelete.includes(relation.propertyId)"
                    type="number"
                    :min="propertiesMap[relation.propertyId]?.minValue || undefined"
                    :max="propertiesMap[relation.propertyId]?.maxValue || undefined"
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

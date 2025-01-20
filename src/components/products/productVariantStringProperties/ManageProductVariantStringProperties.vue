<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type {
    CreateProductVariantStringProperty,
    PatchProductVariantStringProperty,
    ProductVariantStringPropertySearchParameters,
    ViewProductVariantStringProperty,
} from '~/sharedLib/api/src/interfaces/pim/productVariantStringProperty';
import type { SearchParameters } from '~/sharedLib/api/src/interfaces/api';
import type { CreateStringProperty, PatchStringProperty, ViewStringProperty } from '~/sharedLib/api/src/interfaces/pim/properties/stringProperty';
import type { SelectOption } from '~/interfaces/ui';
import type { HydratedProductVariant } from '~/composables/products/productVariantFactory';

import { PlusIcon } from '~/helpers/icons';

import { useAuthenticationStore } from '~/store/authentication';
import useManageProductVariantRelations from '~/composables/products/manageProductVariantRelations';

import ProductVariantStringPropertyService from '~/sharedLib/api/src/services/pim/productVariantStringPropertyService';

import StringPropertyService from '~/sharedLib/api/src/services/pim/properties/stringPropertyService';
import Select from '~/components/controls/Select.vue';
import Button from '~/components/controls/Button.vue';
import DataTable from '~/components/layout/dataTable/DataTable.vue';
import DataTableRow from '~/components/layout/dataTable/DataTableRow.vue';
import DataTableColumn from '~/components/layout/dataTable/DataTableColumn.vue';
import TextField from '~/components/controls/TextField.vue';

const { t } = useI18n();

const authentionStore = useAuthenticationStore();

const relationService = new ProductVariantStringPropertyService(
    () => authentionStore.setUser(),
    () => authentionStore.deleteUser(),
);

const propertyService = new StringPropertyService(
    () => authentionStore.setUser(),
    () => authentionStore.deleteUser(),
);

const props = defineProps<{
    productVariantId: string;
    hydratedProductVariant?: HydratedProductVariant;
}>();

const toDelete = defineModel<string[]>('toDelete', { default: [] });
const toCreate = defineModel<CreateProductVariantStringProperty[]>('toCreate', { default: [] });
const toPatch = defineModel<ViewProductVariantStringProperty[]>('toPatch', { default: [] });

const additionalSearchParameters = computed<Record<string, string>>(() => ({
    productVariantIds: props.productVariantId,
}));

const {
    newRelationHandle,

    propertiesMap,
    availableProperties,
    propertiesSelectOptions,
    headers,
    existingAndNew,
    dataTableActions,

    searchableProperties,

    handleDataTableAction,
    addNewRelation,
    save,
// This is ok at this location, because the value won't change.
// eslint-disable-next-line vue/no-setup-props-destructure
} = useManageProductVariantRelations<
    string,
    ViewProductVariantStringProperty,
    CreateProductVariantStringProperty,
    PatchProductVariantStringProperty,
    ProductVariantStringPropertySearchParameters,
    ViewStringProperty,
    CreateStringProperty,
    PatchStringProperty,
    SearchParameters
>({
    relationService,
    propertyService,
    additionalSearchParameters,
    props,
    newRelationValueFunction: (property: ViewStringProperty) => property.allowedValues ? property.allowedValues[0] || '' : '',
    toDelete,
    toCreate,
    toPatch,
    hydratedProductVariantRelations: props.hydratedProductVariant?.stringProperties,
});

const allowedValuesSelectOptionsMap = computed<Record<string, SelectOption<string>[]>>(() => {
    const map: Record<string, SelectOption<string>[]> = {};
    searchableProperties.records.value.forEach((record) => {
        map[record.id] = record.allowedValues ? record.allowedValues.map((allowed) => ({ value: allowed, label: allowed })) : [];
    });
    return map;
});

defineExpose({
    save,
});
</script>

<template lang="pug">
div(class="flex flex--column flex--gap-f2")
    h2 {{ t('stringProperties') }}

    DataTable(
        :headers
        :has-actions="true"
        :allow-overflow="true"
    )
        DataTableRow(
            v-for="relation in existingAndNew"
            :key="relation.propertyId"
            :value="relation.propertyId"
            :actions="dataTableActions"
            @action="handleDataTableAction"
        )
            DataTableColumn(:value="propertiesMap[relation.propertyId] ? propertiesMap[relation.propertyId].name : ''")
            DataTableColumn
                Select(
                    v-if="allowedValuesSelectOptionsMap[relation.propertyId] && allowedValuesSelectOptionsMap[relation.propertyId].length"
                    v-model="relation.value"
                    :options="allowedValuesSelectOptionsMap[relation.propertyId]"
                )
                TextField(
                    v-else
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

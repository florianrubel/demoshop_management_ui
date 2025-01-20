<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type {
    CreateProductVariantNumericProperty,
    PatchProductVariantNumericProperty,
    ProductVariantNumericPropertyPaginationParameters,
    ViewProductVariantNumericProperty,
} from '~/sharedLib/api/src/interfaces/pim/productVariantNumericProperty';
import type { SearchParameters } from '~/sharedLib/api/src/interfaces/api';
import type { CreateNumericProperty, PatchNumericProperty, ViewNumericProperty } from '~/sharedLib/api/src/interfaces/pim/properties/numericProperty';
import type { HydratedProductVariant } from '~/composables/products/productVariantFactory';

import { PlusIcon } from '~/helpers/icons';

import { useAuthenticationStore } from '~/store/authentication';

import ProductVariantNumericPropertyService from '~/sharedLib/api/src/services/pim/productVariantNumericPropertyService';
import NumericPropertyService from '~/sharedLib/api/src/services/pim/properties/numericPropertyService';

import useManageProductVariantRelations from '~/composables/products/manageProductVariantRelations';

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
    hydratedProductVariant?: HydratedProductVariant;
}>();

const toDelete = defineModel<string[]>('toDelete', { default: [] });
const toCreate = defineModel<CreateProductVariantNumericProperty[]>('toCreate', { default: [] });
const toPatch = defineModel<ViewProductVariantNumericProperty[]>('toPatch', { default: [] });

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

    handleDataTableAction,
    addNewRelation,
    save,
// This is ok at this location, because the value won't change.
// eslint-disable-next-line vue/no-setup-props-destructure
} = useManageProductVariantRelations<
    number,
    ViewProductVariantNumericProperty,
    CreateProductVariantNumericProperty,
    PatchProductVariantNumericProperty,
    ProductVariantNumericPropertyPaginationParameters,
    ViewNumericProperty,
    CreateNumericProperty,
    PatchNumericProperty,
    SearchParameters
>({
    relationService,
    propertyService,
    additionalSearchParameters,
    props,
    newRelationValueFunction: () => 0,
    toDelete,
    toCreate,
    toPatch,
    hydratedProductVariantRelations: props.hydratedProductVariant?.numericProperties,
});
defineExpose({
    save,
});
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

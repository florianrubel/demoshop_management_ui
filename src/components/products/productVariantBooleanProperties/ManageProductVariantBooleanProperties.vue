<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type {
    CreateProductVariantBooleanProperty,
    PatchProductVariantBooleanProperty,
    ProductVariantBooleanPropertyPaginationParameters,
    ViewProductVariantBooleanProperty,
} from '~/sharedLib/api/src/interfaces/pim/productVariantBooleanProperty';
import type { SearchParameters } from '~/sharedLib/api/src/interfaces/api';
import type { CreateBooleanProperty, PatchBooleanProperty, ViewBooleanProperty } from '~/sharedLib/api/src/interfaces/pim/properties/booleanProperty';
import type { HydratedProductVariant } from '~/composables/products/productVariantFactory';

import { PlusIcon } from '~/helpers/icons';

import { useAuthenticationStore } from '~/store/authentication';

import ProductVariantBooleanPropertyService from '~/sharedLib/api/src/services/pim/productVariantBooleanPropertyService';
import BooleanPropertyService from '~/sharedLib/api/src/services/pim/properties/booleanPropertyService';

import useManageProductVariantRelations from '~/composables/products/manageProductVariantRelations';

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
    hydratedProductVariant?: HydratedProductVariant;
}>();

const toDelete = defineModel<string[]>('toDelete', { default: [] });
const toCreate = defineModel<CreateProductVariantBooleanProperty[]>('toCreate', { default: [] });
const toPatch = defineModel<ViewProductVariantBooleanProperty[]>('toPatch', { default: [] });

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
    boolean,
    ViewProductVariantBooleanProperty,
    CreateProductVariantBooleanProperty,
    PatchProductVariantBooleanProperty,
    ProductVariantBooleanPropertyPaginationParameters,
    ViewBooleanProperty,
    CreateBooleanProperty,
    PatchBooleanProperty,
    SearchParameters
>({
    relationService,
    propertyService,
    additionalSearchParameters,
    props,
    newRelationValueFunction: () => false,
    toDelete,
    toCreate,
    toPatch,
    hydratedProductVariantRelations: props.hydratedProductVariant?.booleanProperties,
});
defineExpose({
    save,
});
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

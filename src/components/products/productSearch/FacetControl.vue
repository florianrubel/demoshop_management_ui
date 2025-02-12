<script setup lang="ts">
import type { NumericRange, ProductSearchResult } from '~/sharedLib/api/src/interfaces/productSearch/productSearch';

import BooleanFacetControl from '~/components/products/productSearch/BooleanFacetControl.vue';
import NumericFacetControl from '~/components/products/productSearch/NumericFacetControl.vue';
import StringFacetControl from '~/components/products/productSearch/StringFacetControl.vue';

const emit = defineEmits(['search']);

const props = defineProps<{
    result?: ProductSearchResult | null;
    resultRaw?: ProductSearchResult | null;
}>();

const booleanFacets = defineModel<Record<string, boolean[]>>('booleanFacets', { default: {} });
const numericFacets = defineModel<Record<string, NumericRange>>('numericFacets', { default: {} });
const stringFacets = defineModel<Record<string, string[]>>('stringFacets', { default: {} });
</script>

<template lang="pug">
div(class="facet-control")
    div(class="facet-control__bar")
        template(v-if="props.result && props.resultRaw")
            BooleanFacetControl(
                v-for="key in Object.keys(props.resultRaw.booleanFacets || {})"
                :key="key"
                v-model="booleanFacets[key]"
                :name="key"
                :stats="props.result.booleanFacets[key] || {}"
                @search="emit('search')"
            )
            NumericFacetControl(
                v-for="key in Object.keys(props.resultRaw.numericFacetsRanges)"
                :key="key"
                v-model="numericFacets[key]"
                :name="key"
                :range="props.result.numericFacetsRanges[key]"
            )
            StringFacetControl(
                v-for="key in Object.keys(props.resultRaw.stringFacets || {})"
                :key="key"
                v-model="stringFacets[key]"
                :name="key"
                :stats="props.result.stringFacets[key] || {}"
                @search="emit('search')"
            )
    div(class="facet-control__content")
        slot(name="default")
</template>

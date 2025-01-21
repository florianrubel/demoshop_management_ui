<script setup lang="ts" generic="T extends string | number | string[] | null | undefined">
import { computed } from 'vue';

import type { Alignment } from '~/interfaces/dataTable';

import { numberToLocaleString } from '~/helpers/misc';

import DateTimeFormatter from '~/components/formatters/DateTimeFormatter.vue';
import PriceFormatter from '~/components/formatters/PriceFormatter.vue';

const props = defineProps<{
    value?: T;
    format?: 'datetime' | 'price' | 'number' | 'list' | 'ellipsis' | 'picture',
    align?: Alignment
}>();

const stringValue = computed<string>(() => props.value as string);
const numberValue = computed<number>(() => props.value as number);
const arrayValue = computed<string[]>(() => props.value as string[]);

const classes = computed<string[]>(() => {
    const tmp: string[] = [];

    if (props.align === 'center') tmp.push('text--center');
    if (props.align === 'right') tmp.push('text--right');
    if (props.format === 'picture') tmp.push('data-table__column--picture');
    return tmp;
});

const columnStyle = computed<string>(() => {
    if (props.format === 'picture') return `background-image: url(${stringValue.value})`;
    return '';
});
</script>

<template lang="pug">
div(
    v-if="props.value"
    class="data-table__column"
    :class="classes"
    :style="columnStyle"
)
    template(v-if="props.format === 'datetime'")
        DateTimeFormatter(
            v-if="stringValue"
            :iso-string="stringValue"
        )

    template(v-else-if="props.format === 'price'")
        PriceFormatter(
            v-if="numberValue"
            :price="numberValue"
        )

    template(v-else-if="props.format === 'number'") {{ numberValue !== undefined && numberValue !== null ? numberToLocaleString(undefined, numberValue) : '' }}

    template(v-else-if="props.format === 'list'") {{ arrayValue !== undefined && arrayValue !== null ? arrayValue.join(', ') : '' }}

    template(v-else-if="props.format === 'picture'")

    template(v-else)
        span(:class="{ 'text--ellipsis': props.format === 'ellipsis' }") {{ props.value }}

div(
    v-else
    class="data-table__column"
    :class="classes"
)
    slot
</template>

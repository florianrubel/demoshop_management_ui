<script setup lang="ts" generic="T extends string | number | string[] | null | undefined">
import { computed } from 'vue';
import DateTimeFormatter from '~/components/formatters/DateTimeFormatter.vue';
import PriceFormatter from '~/components/formatters/PriceFormatter.vue';
import { numberToLocaleString } from '~/helpers/misc';

const props = defineProps<{
    value?: T;
    format?: 'datetime' | 'price' | 'number' | 'list' | 'ellipsis',
    align?: 'center' | 'right'
}>();

const stringValue = computed<string>(() => props.value as string);
const numberValue = computed<number>(() => props.value as number);
const arrayValue = computed<string[]>(() => props.value as string[]);

const classes = computed<string[]>(() => {
    const tmp: string[] = [];

    if (props.align === 'center') tmp.push('text--center');
    if (props.align === 'right') tmp.push('text--right');

    return tmp;
});
</script>

<template lang="pug">
td(
    v-if="props.value"
    :class="classes"
)
    template(v-if="props.format === 'datetime'")
        DateTimeFormatter(:iso-string="stringValue")

    template(v-else-if="props.format === 'price'")
        PriceFormatter(:price="numberValue")

    template(v-else-if="props.format === 'number'") {{ numberToLocaleString(undefined, numberValue) }}

    template(v-else-if="props.format === 'list'") {{ arrayValue.join(', ') }}

    template(v-else)
        span(:class="{'text--ellipsis': props.format === 'ellipsis'}") {{ props.value }}

td(v-else)
    slot
</template>

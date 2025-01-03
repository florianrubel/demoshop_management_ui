<script setup lang="ts" generic="T">
import { computed } from 'vue';
import DateTimeFormatter from '~/components/formatters/DateTimeFormatter.vue';

const props = defineProps<{
    value: T;
    format?: 'datetime' | 'list',
}>();

const stringValue = computed<string>(() => props.value as string);
const arrayValue = computed<string[]>(() => props.value as string[]);
</script>

<template lang="pug">
td
    template(v-if="props.format === 'datetime'")
        DateTimeFormatter(:iso-string="stringValue")
    template(v-else-if="props.format === 'list'") {{ arrayValue.join(', ') }}
    template(v-else) {{ props.value }}
</template>

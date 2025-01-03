<script setup lang="ts" generic="T">
import type { TabItem } from '~/interfaces/navigation';

const emit = defineEmits<{
    'update:model-value': [modelValue: T],
}>();

const props = defineProps<{
    modelValue: T;
    tabs?: TabItem<T>[];
}>();
</script>

<template lang="pug">
div(class="tabs")
    button(
        v-for="tab in props.tabs"
        :key="`ti_${tab.value}`"
        class="tabs__tab"
        :class="{ 'tabs__tab--active': props.modelValue === tab.value }"
        @click="emit('update:model-value', tab.value)"
    ) {{ tab.label || tab.value }}
</template>

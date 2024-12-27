<script setup lang="ts" generic="T">
import type { TabItem } from '~/interfaces/navigation';

import Button from '~/components/controls/Button.vue';

const emit = defineEmits<{
    'update:modelValue': [modelValue: T],
}>();

const props = defineProps<{
    modelValue: T;
    tabs?: TabItem<T>[];
}>();
</script>

<template lang="pug">
div(class="tabs")
    div(
        v-for="tab in props.tabs"
        :key="`ti_${tab.value}`"
        class="tabs__tab"
        :class="{ 'tabs__tab--active': props.modelValue === tab.value }"
    )
        Button(
            :full-width="true"
            :disabled="tab.disabled"
            @click="emit('update:modelValue', tab.value)"
        ) {{ tab.label || tab.value }}
</template>

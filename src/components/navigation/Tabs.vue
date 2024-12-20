<script setup lang="ts">
import type { TabItem } from '~/interfaces/navigation';

import Button from '~/components/controls/Button.vue';

const emit = defineEmits<{
    'update:modelValue': [modelValue: string],
}>();

const props = defineProps<{
    modelValue: string;
    tabs?: TabItem[];
}>();
</script>

<template lang="pug">
div(class="tabs")
    div(
        v-for="tab in props.tabs"
        :key="tab.value"
        class="tabs__tab"
        :class="{ 'tabs__tab--active': props.modelValue === tab.value }"
    )
        Button(
            :full-width="true"
            :disabled="tab.disabled"
            @click="emit('update:modelValue', tab.value)"
        ) {{ tab.label || tab.value }}
</template>

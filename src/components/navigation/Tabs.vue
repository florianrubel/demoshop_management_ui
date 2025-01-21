<script setup lang="ts" generic="T">
import type { TabItem } from '~/interfaces/navigation';

const props = defineProps<{
    tabs?: TabItem<T>[];
}>();

const model = defineModel<T>();
</script>

<template lang="pug">
div(class="tabs")
    button(
        v-for="tab in props.tabs"
        :key="`ti_${tab.value}`"
        type="button"
        class="tabs__tab"
        :class="{ 'tabs__tab--active': model === tab.value }"
        @click="model = tab.value"
    ) {{ tab.label || tab.value }}
</template>

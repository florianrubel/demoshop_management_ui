<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Checkbox from '~/components/controls/Checkbox.vue';
import type { StringFacet } from '~/sharedLib/api/src/interfaces/productSearch/productSearch';

const { t } = useI18n();

const emit = defineEmits(['search']);

const props = defineProps<{
    name: string;
    stats: StringFacet;
}>();

const model = defineModel<string[]>({ default: [] });

function handleModelUpdate(value: string): void {
    if (model.value.includes(value)) {
        model.value = model.value.filter((fValue) => fValue !== value);
    } else {
        model.value.push(value);
    }
    emit('search');
}
</script>

<template lang="pug">
div(class="facet")
    div(class="facet__name") {{ t(props.name) }}
    Checkbox(
        v-for="key in Object.keys(props.stats)"
        :key="key"
        :model-value="model.includes(key)"
        :label="`${key} (${props.stats[key]})`"
        @update:model-value="handleModelUpdate(key)"
    )
</template>

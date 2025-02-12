<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Checkbox from '~/components/controls/Checkbox.vue';
import type { BooleanFacet } from '~/sharedLib/api/src/interfaces/productSearch/productSearch';

const { t } = useI18n();

const emit = defineEmits(['search']);

const props = defineProps<{
    name: string;
    stats: BooleanFacet;
}>();

const model = defineModel<boolean[]>({ default: [] });

function handleModelUpdate(value: boolean): void {
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
        v-if="props.stats.true"
        :model-value="model.includes(true)"
        :label="`${t('yes')} (${props.stats.true})`"
        @update:model-value="handleModelUpdate(true)"
    )
    Checkbox(
        v-if="props.stats.false"
        :model-value="model.includes(false)"
        :label="`${t('no')} (${props.stats.false})`"
        @update:model-value="handleModelUpdate(false)"
    )
</template>

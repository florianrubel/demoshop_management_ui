<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import type { NumericRange } from '~/sharedLib/api/src/interfaces/productSearch/productSearch';

import TextField from '~/components/controls/TextField.vue';

const { t } = useI18n();

const props = defineProps<{
    name: string;
    range: NumericRange;
}>();

const model = defineModel<NumericRange>({ default: {} });
</script>

<template lang="pug">
div(class="facet")
    div(class="facet__name") {{ t(props.name) }}
    TextField(
        v-model="model.min"
        :label="t('from')"
        type="number"
        :placeholder="`${props.range.min}`"
        :min="props.range.min"
        :max="props.range.max"
    )
    TextField(
        v-model="model.max"
        :label="t('to')"
        type="number"
        :placeholder="`${props.range.max}`"
        :min="props.range.min"
        :max="props.range.max"
    )
</template>

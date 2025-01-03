<script lang="ts" setup>
import {
    computed, withDefaults,
} from 'vue';

import { CheckIcon } from '~/helpers/icons';

const emits = defineEmits(['update:model-value', 'focus', 'blur', 'enter']);

interface Props {
    modelValue: boolean;
    label?: string;
}
const props = withDefaults(defineProps<Props>(), {
    label: undefined,
});

const classes = computed<string[]>(() => {
    const tmp: string[] = [];
    if (props.modelValue) tmp.push('checkbox--checked');
    return tmp;
});

function emitInput(): void {
    emits('update:model-value', !props.modelValue);
}
</script>

<template lang="pug">
button(
    class="checkbox"
    :class="classes"
    type="button"
    @click="emitInput"
)
    div(class="checkbox__box")
        CheckIcon(v-if="props.modelValue")

    div(
        v-if="props.label"
        class="checkbox__label"
    ) {{ props.label }}
</template>

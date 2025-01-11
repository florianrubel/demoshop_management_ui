<script lang="ts" setup>
import {
    computed,
} from 'vue';

import { CheckIcon } from '~/helpers/icons';

interface Props {
    label?: string;
    disabled?: boolean;
}
const props = defineProps<Props>();

const model = defineModel<boolean>({ default: false });

const classes = computed<string[]>(() => {
    const tmp: string[] = [];
    if (model.value) tmp.push('checkbox--checked');
    if (props.disabled) tmp.push('checkbox--disabled');
    return tmp;
});

function emitInput(): void {
    model.value = !model.value;
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
        CheckIcon(v-if="model")

    div(
        v-if="props.label"
        class="checkbox__label"
    ) {{ props.label }}
</template>

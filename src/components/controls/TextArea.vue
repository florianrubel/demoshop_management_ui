<script lang="ts" setup>
import {
    computed, withDefaults, ref,
} from 'vue';

import { DEFAULT_INPUT_MAX_LENGTH } from '~/constants/app';
import { getUniqueId } from '~/helpers/misc';

const emits = defineEmits(['focus', 'blur', 'enter']);

interface Props {
    maxLength?: number;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    success?: boolean;
    errors?: string[];
}
const props = withDefaults(defineProps<Props>(), {
    maxLength: DEFAULT_INPUT_MAX_LENGTH,
    label: undefined,
    placeholder: undefined,
    disabled: false,
    readonly: false,
    required: false,
    success: false,
    errors: () => [],
});

const model = defineModel<string | null | undefined>();

const id = ref<string>(getUniqueId());
const isFocused = ref<boolean>(false);
const canShowOptions = ref<boolean>(false);

const classes = computed<string[]>(() => {
    const tmp = [];
    if (props.disabled) tmp.push('text-area--disabled');
    if (props.readonly) tmp.push('text-area--readonly');
    if (props.errors.length > 0) tmp.push('text-area--error');
    if (isFocused.value) tmp.push('text-area--focused');
    return tmp;
});

function emitInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    model.value = target.value;
}
function emitFocus(event: Event) {
    isFocused.value = true;
    canShowOptions.value = true;
    (event.target as HTMLInputElement).select();
    emits('focus', event);
}
function emitBlur(event: Event) {
    isFocused.value = false;
    canShowOptions.value = false;
    emits('blur', event);
}
</script>

<template lang="pug">
div(
    class="text-area"
    :class="classes"
)
    label(
        v-if="label"
        :for="id"
    ) {{ props.label }}
        span(
            v-if="props.required"
            class="text--primary"
        ) *

    div(class="text-area__input")
        div(
            v-if="$slots.iconLeft"
            class="text-area__icon text-area__icon--left"
        )
            slot(name="iconLeft")

        textarea(
            :id
            :maxlength="props.maxLength"
            :placeholder="props.placeholder"
            :value="model"
            :disabled="props.disabled"
            :readonly="props.readonly"
            @input="emitInput"
            @focus="emitFocus"
            @blur="emitBlur"
        )
        button(
            v-if="$slots.iconRight"
            class="text-area__icon text-area__icon--right"
            type="button"
        )
            slot(name="iconRight")

    div(
        v-for="error in errors"
        :key="error"
        class="text-area__error"
    ) {{ error }}
</template>

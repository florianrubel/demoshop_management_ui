<script lang="ts" setup>
import {
    computed, withDefaults, ref,
} from 'vue';
import { useCurrencyInput, ValueScaling } from 'vue-currency-input';

import { getUniqueId } from '~/helpers/misc';

const emit = defineEmits(['update:model-value', 'focus', 'blur', 'enter', 'keyup.enter']);

interface Props {
    modelValue?: string | number | null;
    min?: number;
    max?: number;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    success?: boolean;
    errors?: string[];
}
const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    min: undefined,
    max: undefined,
    label: undefined,
    placeholder: undefined,
    disabled: false,
    readonly: false,
    required: false,
    success: false,
    errors: () => [],
});

const id = ref<string>(getUniqueId());
const isFocused = ref<boolean>(false);
const { inputRef } = useCurrencyInput({
    currency: 'EUR',
    autoDecimalDigits: true,
    hideCurrencySymbolOnFocus: false,
    hideGroupingSeparatorOnFocus: false,
    hideNegligibleDecimalDigitsOnFocus: false,
    valueScaling: ValueScaling.precision,
});

const classes = computed<string[]>(() => {
    const tmp = [];
    if (props.disabled) tmp.push('text-field--disabled');
    if (props.readonly) tmp.push('text-field--readonly');
    if (props.errors.length > 0) tmp.push('text-field--error');
    if (isFocused.value) tmp.push('text-field--focused');
    return tmp;
});

function emitInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    emit('update:model-value', target.value);
}
function emitFocus(event: Event) {
    isFocused.value = true;
    (event.target as HTMLInputElement).select();
    emit('focus', event);
}
function emitBlur(event: Event) {
    isFocused.value = false;
    emit('blur', event);
}
function emitEnter() {
    emit('keyup.enter');
}
</script>

<template lang="pug">
div(
    class="text-field"
    :class="classes"
)
    label(
        v-if="label"
        :for="id"
    )
        span {{ props.label }}
        span(
            v-if="props.required"
            class="text--primary"
        ) *

    div(class="text-field__input")
        div(
            v-if="$slots.iconLeft"
            class="text-field__icon text-field__icon--left"
        )
            slot(name="iconLeft")

        input(
            :id
            ref="inputRef"
            :type="'text'"
            :min="props.min"
            :max="props.max"
            :placeholder="props.placeholder"
            :value="props.modelValue"
            :disabled="props.disabled"
            :readonly="props.readonly"
            @input="emitInput"
            @focus="emitFocus"
            @blur="emitBlur"
            @keyup.enter="emitEnter"
        )
        button(
            v-if="$slots.iconRight"
            class="text-field__icon text-field__icon--right"
            type="button"
        )
            slot(name="iconRight")

    div(
        v-for="error in errors"
        :key="error"
        class="text-field__error"
    ) {{ error }}
</template>

<script lang="ts" setup>
import {
    computed, withDefaults, ref,
} from 'vue';
import { getUniqueId } from '~/helpers/misc';
import { DEFAULT_INPUT_MAX_LENGTH } from '~/constants/app';
import type { SelectOption } from '~/interfaces/ui';

const emit = defineEmits(['update:model-value', 'focus', 'blur', 'enter', 'keyup.enter']);

interface Props {
    modelValue?: string | number | null;
    type?: string;
    maxLength?: number;
    min?: number;
    max?: number;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    success?: boolean;
    options?: SelectOption<string>[];
    errors?: string[];
}
const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    type: 'text',
    maxLength: DEFAULT_INPUT_MAX_LENGTH,
    min: undefined,
    max: undefined,
    label: undefined,
    placeholder: undefined,
    disabled: false,
    readonly: false,
    required: false,
    success: false,
    options: () => [],
    errors: () => [],
});

const id = ref<string>(getUniqueId());
const isFocused = ref<boolean>(false);
const canShowOptions = ref<boolean>(false);

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
function emitInputWithValue(value: string | null): void {
    emit('update:model-value', value);
}
function emitFocus(event: Event) {
    isFocused.value = true;
    canShowOptions.value = true;
    (event.target as HTMLInputElement).select();
    emit('focus', event);
}
function emitBlur(event: Event) {
    isFocused.value = false;
    canShowOptions.value = false;
    emit('blur', event);
}
function emitEnter() {
    // eslint-disable-next-line no-console
    console.log('enter');
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

    div(
        v-if="props.options.length > 0 && canShowOptions"
        class="text-field__options"
    )
        button(
            v-for="option in props.options"
            :key="option.value || ''"
            data-name="optionButton"
            class="text-field__option"
            type="button"
            @mousedown="emitInputWithValue(option.value)"
        ) {{ option.label }}

    div(class="text-field__input")
        div(
            v-if="$slots.iconLeft"
            class="text-field__icon text-field__icon--left"
        )
            slot(name="iconLeft")

        input(
            :id
            :type="props.type"
            :maxlength="props.maxLength"
            :min="props.min"
            :max="props.max"
            :placeholder="props.placeholder"
            :value="props.modelValue"
            :disabled="props.disabled"
            :readonly="props.readonly"
            :autocomplete="props.options.length > 0 ? 'off' : 'on'"
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

<script lang="ts" setup>
import {
    computed, withDefaults, ref,
} from 'vue';

import type { SelectOption } from '~/interfaces/ui';

import { DEFAULT_INPUT_MAX_LENGTH } from '~/constants/app';

import TextField from '~/components/controls/TextField.vue';
import { ChevronDownIcon, MagnifyingGlassIcon } from '~/helpers/icons';

interface Props {
    options: SelectOption<string | null | undefined>[],
    searchable?: boolean;
    stretch?: boolean;
    searchPlaceholder?: string;
    label?: string | null;
    disabled?: boolean;
    required?: boolean;
    placeholderOption?: SelectOption<string | null | undefined>;
    errors?: string[];
}
const props = withDefaults(defineProps<Props>(), {
    options: () => [],
    searchable: false,
    stretch: false,
    searchPlaceholder: '',
    label: null,
    disabled: false,
    required: false,
    placeholderOption: undefined,
    errors: () => [],
});

const model = defineModel<string | null | undefined>();

const expanded = ref<boolean>(false);
const searchString = ref<string>('');

const filteredOptions = computed<SelectOption<string | null | undefined>[]>(() => {
    if (searchString.value.length === 0) return props.options;
    return props.options.filter(({ value, label }) => value === null || label.toLowerCase().includes(searchString.value.toLowerCase()));
});
const filteredOptionsWithPlaceholderOption = computed<SelectOption<string | null | undefined>[]>(() => {
    if (props.placeholderOption) return [props.placeholderOption, ...filteredOptions.value];
    return filteredOptions.value;
});
const optionsWithPlaceholderOption = computed<SelectOption<string | null | undefined>[]>(() => {
    if (props.placeholderOption) return [props.placeholderOption, ...props.options];
    return props.options;
});
const selected = computed<SelectOption<string | null | undefined> | null>(() => optionsWithPlaceholderOption.value.find(({ value }) => value === model.value) || null);
const valueLabel = computed<string>(() => {
    if (selected.value) {
        return selected.value.label;
    }
    return '';
});
const classes = computed<string[]>(() => {
    const tmp: string[] = [];
    if (props.searchable) tmp.push('select--searchable');
    if (props.stretch) tmp.push('select--stretch');
    if (expanded.value) tmp.push('select--expanded');
    if (props.disabled) tmp.push('select--disabled');
    if (props.errors.length > 0) tmp.push('select--error');
    return tmp;
});

function emitInput(value: string | null | undefined): void {
    model.value = value;
    expanded.value = false;
}
function toggleExpanded(): void {
    if (props.disabled) return;
    expanded.value = !expanded.value;
}
function collapse(): void {
    expanded.value = false;
}

</script>

<template lang="pug">
div(
    v-click-away="collapse"
    class="select"
    :class="classes"
)
    label(v-if="props.label")
        span {{ props.label }}
        span(
            v-if="props.required"
            class="text--primary") *
    div(class="select__wrapper")
        div(class="select__options")
            div(class="select__search")
                TextField(
                    v-if="props.searchable"
                    v-model="searchString"
                    :maxlength="DEFAULT_INPUT_MAX_LENGTH"
                    :placeholder="props.searchPlaceholder"
                )
                    template(#iconLeft)
                        MagnifyingGlassIcon(class="icon")

            template(
                v-for="option in filteredOptionsWithPlaceholderOption"
            )
                button(
                    v-if="modelValue !== option.value"
                    :key="`${option.value}`"
                    class="select__option"
                    type="button"
                    @click="emitInput(option.value)"
                )
                    component(
                        :is="option.icon"
                        v-if="option.icon"
                        class="icon"
                    )
                    span {{ option.label }}

                div(
                    v-else
                    :key="`_${option.value}`"
                    class="select__option select__option--selected"
                )
                    component(
                        :is="option.icon"
                        v-if="option.icon"
                        class="icon"
                    )
                    span {{ option.label }}

        button(
            data-name="toggleButton"
            class="select__value"
            type="button"
            @click="toggleExpanded"
        )
            div(class="select__value-label") {{ valueLabel }}
            div(class="select__chevron")
                ChevronDownIcon(class="icon")

    div(
        v-for="error in props.errors"
        :key="error"
        class="select__error"
    ) {{ error }}
</template>

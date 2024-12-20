<script lang="ts" setup>
import {
    computed, withDefaults,
} from 'vue';
import {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from '~/helpers/icons';

import type { PaginationItemDefinition } from '~/interfaces/pagination';

const emits = defineEmits(['update:modelValue']);

interface Props {
    modelValue: number;
    pages: number;
}
const props = withDefaults(defineProps<Props>(), {});

const visiblePages = computed<PaginationItemDefinition[]>(() => {
    const items: PaginationItemDefinition[] = [];

    if (props.pages > 2 && props.modelValue === props.pages) {
        items.push({
            value: props.modelValue - 2,
            label: `${props.modelValue - 2}`,
        });
    }

    if (props.pages > 1 && props.modelValue > 1) {
        items.push({
            value: props.modelValue - 1,
            label: `${props.modelValue - 1}`,
        });
    }

    items.push({
        value: props.modelValue,
        label: `${props.modelValue}`,
    });

    if (props.pages > 1 && props.modelValue < props.pages) {
        items.push({
            value: props.modelValue + 1,
            label: `${props.modelValue + 1}`,
        });
    }

    if (props.pages > 2 && props.modelValue === 1) {
        items.push({
            value: props.modelValue + 2,
            label: `${props.modelValue + 2}`,
        });
    }

    if (props.pages > 3 && props.modelValue < props.pages - 1) {
        items.push({
            value: 0,
            label: '...',
            noAction: true,
        });
        items.push({
            value: props.pages,
            label: `${props.pages}`,
        });
    }

    return items;
});

const visiblePagesClasses = computed<string[][]>(() => visiblePages.value.map(({ value, noAction }) => {
    const classes = [];
    if (props.modelValue === value) classes.push('pagination__page--current');
    if (noAction) classes.push('pagination__page--no-action');
    return classes;
}));
const isFirstPage = computed<boolean>(() => props.modelValue === 1);
const isLastPage = computed<boolean>(() => props.modelValue === props.pages);

function emitInput(value: number): void {
    emits('update:modelValue', value);
}
</script>

<template lang="pug">
div(class="pagination")
    button(
        class="pagination__first"
        :disabled="isFirstPage"
        type="button"
        @click="emitInput(1)"
    )
        ChevronDoubleLeftIcon(class="icon")

    button(
        class="pagination__prev"
        :disabled="isFirstPage"
        type="button"
        @click="emitInput(modelValue - 1)"
    )
        ChevronLeftIcon(class="icon")

    button(
        v-for="(page, index) in visiblePages"
        :key="page.value"
        class="pagination__page"
        :class="visiblePagesClasses[index]"
        type="button"
        @click="emitInput(page.value)"
    ) {{ page.label }}

    button(
        class="pagination__next"
        :disabled="isLastPage"
        type="button"
        @click="emitInput(modelValue + 1)"
    )
        ChevronRightIcon(class="icon")

    button(
        class="pagination__last"
        :disabled="isLastPage"
        type="button"
        @click="emitInput(pages)"
    )
        ChevronDoubleRightIcon(class="icon")
</template>

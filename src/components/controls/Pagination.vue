<script lang="ts" setup>
import {
    computed,
} from 'vue';
import {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from '~/helpers/icons';

import type { PaginationItemDefinition } from '~/interfaces/pagination';

const props = defineProps<{
    pages: number;
}>();

const model = defineModel<number>();

const safeModel = computed<number>(() => model.value || 0);

const visiblePages = computed<PaginationItemDefinition[]>(() => {
    const items: PaginationItemDefinition[] = [];

    if (props.pages > 2 && safeModel.value === props.pages) {
        items.push({
            value: safeModel.value - 2,
            label: `${safeModel.value - 2}`,
        });
    }

    if (props.pages > 1 && safeModel.value > 1) {
        items.push({
            value: safeModel.value - 1,
            label: `${safeModel.value - 1}`,
        });
    }

    items.push({
        value: safeModel.value,
        label: `${safeModel.value}`,
    });

    if (props.pages > 1 && safeModel.value < props.pages) {
        items.push({
            value: safeModel.value + 1,
            label: `${safeModel.value + 1}`,
        });
    }

    if (props.pages > 2 && safeModel.value === 1) {
        items.push({
            value: safeModel.value + 2,
            label: `${safeModel.value + 2}`,
        });
    }

    if (props.pages > 3 && safeModel.value < props.pages - 1) {
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
    if (safeModel.value === value) classes.push('pagination__page--current');
    if (noAction) classes.push('pagination__page--no-action');
    return classes;
}));
const isFirstPage = computed<boolean>(() => model.value === 1);
const isLastPage = computed<boolean>(() => model.value === props.pages);
</script>

<template lang="pug">
div(class="pagination")
    button(
        class="pagination__first"
        :disabled="isFirstPage"
        type="button"
        @click="model = 1"
    )
        ChevronDoubleLeftIcon(class="icon")

    button(
        class="pagination__prev"
        :disabled="isFirstPage"
        type="button"
        @click="model = safeModel - 1"
    )
        ChevronLeftIcon(class="icon")

    button(
        v-for="(page, index) in visiblePages"
        :key="page.value"
        class="pagination__page"
        :class="visiblePagesClasses[index]"
        type="button"
        @click="model = page.value"
    ) {{ page.label }}

    button(
        class="pagination__next"
        :disabled="isLastPage"
        type="button"
        @click="model = safeModel + 1"
    )
        ChevronRightIcon(class="icon")

    button(
        class="pagination__last"
        :disabled="isLastPage"
        type="button"
        @click="model = pages"
    )
        ChevronDoubleRightIcon(class="icon")
</template>

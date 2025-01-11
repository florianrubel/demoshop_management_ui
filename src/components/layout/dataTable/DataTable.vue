<script setup lang="ts">
import { computed } from 'vue';

import type { DataTableHeader } from '~/interfaces/dataTable';
import type { SortingDirection } from '~/interfaces/ui';

import { ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon } from '~/helpers/icons';

const sortBy = defineModel<string>('sortBy');
const sortDirection = defineModel<SortingDirection>('sortDirection');

const props = defineProps<{
    headers?: DataTableHeader[];
    hasActions?: boolean;
    allowOverflow?: boolean;
}>();

const dataTableStyle = computed<string>(() => {
    const cols = props.headers?.map((_h) => '1fr');
    if (props.hasActions) cols?.push('auto');
    return `grid-template-columns: ${cols?.join(' ')}`;
});

const classes = computed<string[]>(() => {
    const tmp: string[] = [];
    if (props.allowOverflow) tmp.push('data-table--allow-overflow');
    return tmp;
});

const headerClasses = computed<string[][]>(() => props.headers?.map((header) => {
    const tmp: string[] = [];
    if (header.allowSorting) tmp.push('data-table__header--with-sorting');
    if (header.align === 'center') tmp.push('data-table__header--align-center');
    if (header.align === 'right') tmp.push('data-table__header--align-right');
    return tmp;
}) || []);

function handleSorting(property?: string): void {
    if (!property) return;
    if (property === sortBy.value) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortBy.value = property;
    }
}
</script>

<template lang="pug">
div(
    class="data-table"
    :class="classes"
    :style="dataTableStyle"
)
    template(v-if="props.headers && props.headers.length")
        div(
            v-for="(header, i) in props.headers"
            :key="header.label"
            class="data-table__header"
            :class="headerClasses[i]"
            @click="handleSorting(header.property)"
        )
            span(class="data-table__header-label") {{ header.label }}
            span(
                v-if="header.allowSorting && header.property"
                class="data-table__header-sorting"
            )
                ChevronUpIcon(
                    v-if="sortBy === header.property && sortDirection === 'asc'"
                    class="data-table__header-sorting-icon data-table__header-sorting-icon--small"
                )
                ChevronDownIcon(
                    v-else-if="sortBy === header.property && sortDirection === 'desc'"
                    class="data-table__header-sorting-icon data-table__header-sorting-icon--small"
                )
                ChevronUpDownIcon(
                    v-else
                    class="data-table__header-sorting-icon"
                )

        div(
            v-if="props.hasActions"
            class="data-table__header"
        )
    slot
</template>

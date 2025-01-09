<script setup lang="ts">
import type { DataTableHeader } from '~/interfaces/dataTable';
import type { SortingDirection } from '~/interfaces/ui';

import { ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon } from '~/helpers/icons';

const sortBy = defineModel<string>('sortBy');
const sortDirection = defineModel<SortingDirection>('sortDirection');

const props = defineProps<{
    headers?: DataTableHeader[];
    hasActions?: boolean;
}>();

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
table(
    class="data-table"
)
    tr(v-if="props.headers && props.headers.length")
        th(
            v-for="header in props.headers"
            :key="header.label"
            class="data-table__header"
            :class="{ 'data-table__header--with-sorting': header.allowSorting }"
            @click="handleSorting(header.property)"
        )
            div
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

        th(v-if="props.hasActions")
    slot
</template>

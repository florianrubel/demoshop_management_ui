<script setup lang="ts">
import type { DataTableAction, DataTableActionEvent } from '~/interfaces/dataTable';

import Button from '~/components/controls/Button.vue';
import DataTableActions from '~/components/layout/dataTable/DataTableActions.vue';

const props = defineProps<{
    value?: string;
    actions?: DataTableAction[];
}>();

const emit = defineEmits<{
    'action': [action: DataTableActionEvent],
}>();
</script>

<template lang="pug">
tr(class="data-table__row")
    slot
    DataTableActions(v-if="props.actions")
        Button(
            v-for="action in props.actions"
            :key="action.name"
            :blank="true"
            @click="emit('action', { name: action.name, value: props.value })"
        )
            component(
                :is="action.icon"
                v-if="action.icon"
            )
</template>

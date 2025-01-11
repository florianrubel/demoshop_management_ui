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
    slot
    DataTableActions(v-if="props.actions")
        template(
            v-for="action in props.actions"
        )
            Button(
                v-if="value && (!action.conditionalFunction || action.conditionalFunction(props.value))"
                :key="action.name"
                :blank="true"
                :title="action.label"
                @click="emit('action', { name: action.name, value: props.value })"
            )
                component(
                    :is="action.icon"
                    v-if="action.icon"
                )
</template>

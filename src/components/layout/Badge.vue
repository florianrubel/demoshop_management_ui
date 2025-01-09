<script setup lang="ts">
import { computed } from 'vue';

import type { StatusType } from '~/interfaces/ui';

const props = defineProps<{
    type?: StatusType;
}>();

const classes = computed<string[]>(() => {
    const tmp: string[] = [];

    if (props.type === 'primary') tmp.push('badge--primary');
    else if (props.type === 'info') tmp.push('badge--info');
    else if (props.type === 'success') tmp.push('badge--success');
    else if (props.type === 'warning') tmp.push('badge--warning');
    else if (props.type === 'error') tmp.push('badge--error');

    return tmp;
});
</script>

<template lang="pug">
div(
    class="badge"
    :class="classes"
)
    slot
</template>

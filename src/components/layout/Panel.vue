<script lang="ts" setup>
import { withDefaults, computed } from 'vue';

interface Props {
    embedded?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    embedded: false,
});

const classes = computed<string[]>(() => {
    if (props.embedded) return ['panel--embedded'];
    return [];
});
</script>

<template lang="pug">
div(
    class="panel"
    :class="classes"
)
    slot
</template>

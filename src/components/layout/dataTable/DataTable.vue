<script setup lang="ts">
import LoadingIndicatorCircle from '~/components/loading/LoadingIndicatorCircle.vue';

const props = defineProps<{
    headers?: string[];
    hasActions?: boolean;
    loading?: boolean;
}>();
</script>

<template lang="pug">
table(
    class="data-table"
    :class="{ 'data-table--is-loading': props.loading }"
)
    tr(v-if="props.headers && props.headers.length")
        th(
            v-for="header in props.headers"
            :key="header"
        ) {{ header }}
        th(v-if="props.hasActions")
    slot
    tr(
        v-if="props.loading"
        class="data-table__loading-indicator"
    )
        td
            LoadingIndicatorCircle
</template>

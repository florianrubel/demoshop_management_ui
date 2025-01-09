<script setup lang="ts">
import LoadingIndicatorCircle from '~/components/loading/LoadingIndicatorCircle.vue';

const props = defineProps<{
    isLoading: boolean;
}>();
</script>

<template lang="pug">
div(class="loading-wrapper" :class="{'loading-wrapper--is-loading': props.isLoading}")
    slot
    div(class="loading-wrapper__loader")
        LoadingIndicatorCircle
</template>

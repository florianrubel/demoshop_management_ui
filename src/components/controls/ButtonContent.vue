<script lang="ts" setup>
import { useSlots } from 'vue';
import LoadingIndicatorCircle from '~/components/loading/LoadingIndicatorCircle.vue';

const slots = useSlots();

const props = defineProps<{
    loading?: boolean;
}>();

</script>
<template lang="pug">
div(
    v-if="slots.iconLeft"
    class="button__icon button__icon--left"
)
    slot(name="iconLeft")

div(class="button__content")
    slot

div(
    v-if="slots.iconRight"
    class="button__icon button__icon--right"
)
    slot(name="iconRight")

div(
    v-if="props.loading"
    class="button__loading-indicator"
)
    LoadingIndicatorCircle
</template>

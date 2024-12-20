<script lang="ts" setup>
import { withDefaults, useSlots } from 'vue';
import LoadingIndicatorCircle from '~/components/loading/LoadingIndicatorCircle.vue';

const slots = useSlots();

interface Props {
    loading?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    loading: false,
});

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

<script lang="ts" setup>
import { useSlots } from 'vue';
import LoadingIndicatorCircle from '~/components/loading/LoadingIndicatorCircle.vue';
import { numberToLocaleString } from '~/helpers/misc';

const slots = useSlots();

const props = defineProps<{
    loading?: boolean;
    progress?: number;
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

div(
    v-if="props.progress !== undefined"
    class="button__progress"
)
    span(
        class="button__progress-bar"
        :style="`width: ${props.progress * 100}%;`"
    )
    span(class="button__progress-label") {{ numberToLocaleString(undefined, (props.progress) * 100, 0, 0) }}%
</template>

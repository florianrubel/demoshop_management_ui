<script lang="ts" setup>
import {
    computed,
} from 'vue';

const props = defineProps<{
    inverted?: boolean;
    size?: string;
    strokeWidth?: string;
}>();

const styles = computed<Record<string, string>>(() => {
    const stylesObj: Record<string, string> = {};
    if (props.size) {
        stylesObj.height = props.size;
        stylesObj.width = props.size;
    }
    return stylesObj;
});
const pathStyles = computed<Record<string, string>>(() => {
    const stylesObj: Record<string, string> = {};
    if (props.strokeWidth) {
        stylesObj.strokeWidth = props.strokeWidth;
    }
    return stylesObj;
});
const pathClasses = computed<Record<string, boolean>>(() => ({
    'loading-indicator-circle__path--inverted': props.inverted,
}));
</script>

<template lang="pug">
svg(
    class="loading-indicator-circle"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 50 50"
    width="50"
    height="50"
    :style="styles"
)
    circle(
        class="loading-indicator-circle__path"
        :class="pathClasses"
        :style="pathStyles"
        cx="25"
        cy="25"
        r="22"
    )
</template>

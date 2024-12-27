<script lang="ts" setup>
import {
    computed, withDefaults,
} from 'vue';

import Overlay from '~/components/dialogs/Overlay.vue';
import Panel from '~/components/layout/Panel.vue';

const emits = defineEmits(['close']);

interface Props {
    position?: string;
    large?: boolean;
    fullWidth?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    position: undefined,
    large: false,
    fullWidth: false,
});

const classes = computed<string[]>(() => {
    const tmp: string[] = [];
    if (props.position === 'left') tmp.push('dialog--pull-left');
    if (props.large) tmp.push('dialog--large');
    if (props.fullWidth) tmp.push('dialog--full-width');
    return tmp;
});

function handleClose(event: Event): void {
    event.stopPropagation();
    emits('close');
}
</script>
<template lang="pug">
teleport(to="#dialogs")
    div(
        class="dialog"
        :class="classes"
    )
        Overlay(@click="handleClose")
        div(class="dialog__content")
            Panel
                slot
</template>

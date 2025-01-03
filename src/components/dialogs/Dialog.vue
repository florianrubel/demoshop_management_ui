<script lang="ts" setup>
import {
    computed,
} from 'vue';

import Overlay from '~/components/dialogs/Overlay.vue';
import Panel from '~/components/layout/Panel.vue';

const emit = defineEmits(['close', 'save']);

interface Props {
    position?: string;
    large?: boolean;
    fullWidth?: boolean;
    title?: string;
    saveAndCancel?: boolean;
    disableSaving?: boolean;
    isLoading?: boolean;
}
const props = defineProps<Props>();

const classes = computed<string[]>(() => {
    const tmp: string[] = [];
    if (props.position === 'left') tmp.push('dialog--pull-left');
    if (props.large) tmp.push('dialog--large');
    if (props.fullWidth) tmp.push('dialog--full-width');
    return tmp;
});

function handleClose(event: Event): void {
    event.stopPropagation();
    emit('close');
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
            Panel(
                :title="props.title"
                :closable="true"
                :save-and-cancel="props.saveAndCancel"
                :disable-saving="props.disableSaving"
                :is-loading="props.isLoading"
                @close="emit('close')"
                @save="emit('save')"
            )
                slot
</template>

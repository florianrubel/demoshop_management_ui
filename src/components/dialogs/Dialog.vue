<script lang="ts" setup>
import {
    computed,
} from 'vue';

import Overlay from '~/components/dialogs/Overlay.vue';
import Panel from '~/components/layout/Panel.vue';

const emit = defineEmits(['close', 'save']);

const props = defineProps<{
    position?: string;
    large?: boolean;
    fullSize?: boolean;
    title?: string;
    saveAndCancel?: boolean;
    disableSaving?: boolean;
    disableCancel?: boolean;
    isLoading?: boolean;
    hasChanges?: boolean;
}>();

const classes = computed<string[]>(() => {
    const tmp: string[] = [];
    if (props.position === 'left') tmp.push('dialog--pull-left');
    if (props.large) tmp.push('dialog--large');
    if (props.fullSize) tmp.push('dialog--full-size');
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
                :disable-cancel="props.disableCancel"
                :has-changes="props.hasChanges"
                :is-loading="props.isLoading"
                :fix-full-height="props.fullSize"
                @close="emit('close')"
                @save="emit('save')"
            )
                slot
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import type { Notification } from '~/interfaces/ui';

import { useNotificationStore } from '~/store/notifications';

import {
    CheckIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XMarkIcon,
} from '~/helpers/icons';

const notificationStore = useNotificationStore();

const props = withDefaults(defineProps<{
    type?: string;
    duration?: number;
    notification?: Notification;
    onSurface?: boolean;
}>(), {
    type: 'info',
    duration: undefined,
    notification: undefined,
    onSurface: false,
});

const classes = computed<string[]>(() => {
    const tmp = [];
    if (props.onSurface) tmp.push('notification--on-surface');
    if (props.type === 'info') tmp.push('notification--info');
    if (props.type === 'success') tmp.push('notification--success');
    if (props.type === 'warning') tmp.push('notification--warning');
    if (props.type === 'error') tmp.push('notification--error');
    if (props.type === 'love') tmp.push('notification--love');
    return tmp;
});
</script>

<template lang="pug">
div(
    class="notification"
    :class="classes"
)
    div(class="notification__icon")
        CheckIcon(
            v-if="props.type === 'success'"
            class="icon"
        )
        ExclamationTriangleIcon(
            v-if="props.type === 'warning'"
            class="icon"
        )
        ExclamationTriangleIcon(
            v-if="props.type === 'error'"
            class="icon"
        )
        InformationCircleIcon(
            v-if="props.type === 'info'"
            class="icon"
        )

    div(class="notification__text")
        slot

    button(
        v-if="props.notification"
        class="notification__dismiss"
        type="button"
        @click="notificationStore.removeNotification(props.notification)"
    )
        XMarkIcon(class="icon")

    div(
        v-if="props.duration"
        class="notification__time-indicator"
        :style="props.duration ? `animation-duration: ${props.duration / 1000}s;` : ''"
    )
</template>

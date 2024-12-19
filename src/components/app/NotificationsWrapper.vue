<script setup lang="ts">
import { useNotificationStore } from '~/store/notifications';

import SingleNotification from '~/components/app/SingleNotification.vue';

const notificationStore = useNotificationStore();
</script>

<template lang="pug">
transition-group(name="slideleft" tag="div" class="notifications-wrapper")
    SingleNotification(
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        :type="notification.type"
        :duration="notification.delay"
        :notification
    ) {{ notification.text }}
</template>

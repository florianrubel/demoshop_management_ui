import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

import type { Notification, NotificationType } from '~/interfaces/ui';

export interface NotificationStoreState {
    notifications: Notification[];
}

export const useNotificationStore = defineStore('notification', {
    state: (): NotificationStoreState => ({
        notifications: [],
    }),
    actions: {
        addNotification({ text, type }: { text: string; type: NotificationType; }) {
            let delay = 10000;
            switch (type) {
            case 'success':
                delay = 5000;
                break;

            case 'error':
                delay = 15000;
                break;

            case 'info':
                delay = 3000;
                break;

            default:
                delay = 10000;
                break;
            }
            const notification = {
                id: uuidv4(),
                type,
                text,
                delay,
            };
            this.notifications.push(notification);
            setTimeout(() => {
                this.removeNotification(notification);
            }, delay);
        },
        removeNotification(notification: Notification) {
            this.notifications = this.notifications.filter((fNotification) => fNotification.id !== notification.id);
        },
    },
});

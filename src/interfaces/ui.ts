export interface SelectOption<T> {
    value: T | null;
    label: string;
    icon?: string;
}

export interface SelectOptionWithIcon<T> extends SelectOption<T> {
    icon: string;
}

export type NotificationType = 'success' | 'warning' | 'error' | 'info';

export interface Notification {
    id: string;
    delay: number;
    type: NotificationType;
    text: string;
}

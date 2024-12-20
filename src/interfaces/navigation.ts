import { type RouteLocationRaw } from 'vue-router';

export interface NavItemDefinition {
    label: string;
    to: RouteLocationRaw;
    icon?: string;
    children?: NavItemDefinition[];
}

export interface TabItem {
    value: string;
    label?: string;
    disabled?: boolean;
}

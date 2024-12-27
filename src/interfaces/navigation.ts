import type { FunctionalComponent, HTMLAttributes, VNodeProps } from 'vue';
import { type RouteLocationRaw } from 'vue-router';

export interface NavItemDefinition {
    label: string;
    to: RouteLocationRaw;
    icon?: FunctionalComponent<HTMLAttributes & VNodeProps, {}, any, {}>;
    children?: NavItemDefinition[];
}

export interface TabItem<T> {
    value: T;
    label?: string;
    disabled?: boolean;
}

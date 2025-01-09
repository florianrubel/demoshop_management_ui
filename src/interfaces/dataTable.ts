import type { FunctionalComponent, HTMLAttributes, VNodeProps } from 'vue';

export interface DataTableHeader {
    label: string;
    property?: string;
    allowSorting?: boolean;
}

export interface DataTableAction {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
    icon?: FunctionalComponent<HTMLAttributes & VNodeProps, {}, any, {}>;
}

export interface DataTableActionEvent {
    name: string;
    value?: string | null;
}

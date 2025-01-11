import type { FunctionalComponent, HTMLAttributes, VNodeProps } from 'vue';

export type Alignment = 'left' | 'center' | 'right';

export interface DataTableHeader {
    label: string;
    property?: string;
    allowSorting?: boolean;
    align?: Alignment;
}

export interface DataTableAction {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
    icon?: FunctionalComponent<HTMLAttributes & VNodeProps, {}, any, {}>;
    label?: string;
    conditionalFunction?: (value?: string | null) => boolean,
}

export interface DataTableActionEvent {
    name: string;
    value?: string | null;
}

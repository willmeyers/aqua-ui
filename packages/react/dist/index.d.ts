import "@aqua-ui/web-components";
import type { AquaButton as AquaButtonEl, AquaWindow as AquaWindowEl, AquaButtonGroup as AquaButtonGroupEl, AquaField as AquaFieldEl, AquaSelect as AquaSelectEl, AquaSlider as AquaSliderEl, AquaStepper as AquaStepperEl, AquaProgress as AquaProgressEl, AquaTabs as AquaTabsEl, AquaGroupBox as AquaGroupBoxEl, AquaTree as AquaTreeEl, AquaTable as AquaTableEl, AquaScroll as AquaScrollEl, AquaSeparator as AquaSeparatorEl, AquaDock as AquaDockEl, AquaToolbar as AquaToolbarEl } from "@aqua-ui/web-components";
import { type AquaEventHandler, type BaseProps } from "./wrap.js";
export { Aqua, AquaComponents, alert, sheet, contextMenu, closeMenus } from "@aqua-ui/web-components";
export type { AlertSpec, AlertButtonSpec, MenuSpec, MenuItemSpec, MenuChoice } from "@aqua-ui/web-components";
export type { AquaEvent, AquaEventHandler, BaseProps } from "./wrap.js";
export interface AquaWindowProps extends BaseProps {
    label?: string;
    status?: string;
    inactive?: boolean;
    metal?: boolean;
    sheet?: boolean;
    "no-controls"?: boolean;
    toolbar?: boolean | "hidden";
    onToolbartoggle?: AquaEventHandler<{
        shown: boolean;
    }>;
}
export declare const AquaWindow: import("react").ForwardRefExoticComponent<AquaWindowProps & BaseProps & import("react").RefAttributes<AquaWindowEl>>;
export interface AquaButtonProps extends BaseProps {
    default?: boolean;
    pulsing?: boolean;
    bevel?: boolean;
    square?: boolean;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    label?: string;
    onClick?: (e: MouseEvent) => void;
}
export declare const AquaButton: import("react").ForwardRefExoticComponent<AquaButtonProps & BaseProps & import("react").RefAttributes<AquaButtonEl>>;
export interface AquaButtonGroupProps extends BaseProps {
    value?: string;
    label?: string;
    disabled?: boolean;
    inactive?: boolean;
    multiple?: boolean;
    momentary?: boolean;
    icons?: boolean;
    onChange?: AquaEventHandler<{
        value: string | string[];
    }>;
    onCommand?: AquaEventHandler<{
        value: string;
    }>;
}
export declare const AquaButtonGroup: import("react").ForwardRefExoticComponent<AquaButtonGroupProps & BaseProps & import("react").RefAttributes<AquaButtonGroupEl>>;
export interface AquaCheckboxProps extends BaseProps {
    checked?: boolean;
    disabled?: boolean;
    indeterminate?: boolean;
    value?: string;
    name?: string;
    onChange?: AquaEventHandler<{
        value: string | null;
    }>;
    onInput?: AquaEventHandler<{
        value: string | null;
    }>;
}
export declare const AquaCheckbox: import("react").ForwardRefExoticComponent<AquaCheckboxProps & BaseProps & import("react").RefAttributes<HTMLElement>>;
export declare const AquaRadio: import("react").ForwardRefExoticComponent<AquaCheckboxProps & BaseProps & import("react").RefAttributes<HTMLElement>>;
export interface AquaFieldProps extends BaseProps {
    label?: string;
    value?: string;
    placeholder?: string;
    type?: string;
    rows?: string | number;
    disabled?: boolean;
    readonly?: boolean;
    name?: string;
    onChange?: AquaEventHandler<{
        value: string;
    }>;
    onInput?: AquaEventHandler<{
        value: string;
    }>;
}
export declare const AquaField: import("react").ForwardRefExoticComponent<AquaFieldProps & BaseProps & import("react").RefAttributes<AquaFieldEl>>;
export interface AquaSelectProps extends BaseProps {
    label?: string;
    value?: string;
    disabled?: boolean;
    name?: string;
    onChange?: AquaEventHandler<{
        value: string | null;
    }>;
}
export declare const AquaSelect: import("react").ForwardRefExoticComponent<AquaSelectProps & BaseProps & import("react").RefAttributes<AquaSelectEl>>;
export interface AquaSliderProps extends BaseProps {
    min?: string | number;
    max?: string | number;
    step?: string | number;
    value?: string | number;
    ticks?: string | number;
    round?: boolean;
    disabled?: boolean;
    name?: string;
    onChange?: AquaEventHandler<{
        value: number;
    }>;
    onInput?: AquaEventHandler<{
        value: number;
    }>;
}
export declare const AquaSlider: import("react").ForwardRefExoticComponent<AquaSliderProps & BaseProps & import("react").RefAttributes<AquaSliderEl>>;
export interface AquaStepperProps extends BaseProps {
    value?: string | number;
    min?: string | number;
    max?: string | number;
    step?: string | number;
    field?: boolean;
    disabled?: boolean;
    wrap?: boolean;
    name?: string;
    onChange?: AquaEventHandler<{
        value: number;
    }>;
}
export declare const AquaStepper: import("react").ForwardRefExoticComponent<AquaStepperProps & BaseProps & import("react").RefAttributes<AquaStepperEl>>;
export interface AquaProgressProps extends BaseProps {
    value?: string | number;
    max?: string | number;
    done?: boolean;
}
export declare const AquaProgress: import("react").ForwardRefExoticComponent<AquaProgressProps & BaseProps & import("react").RefAttributes<AquaProgressEl>>;
export interface AquaTabsProps extends BaseProps {
    selected?: string;
    onChange?: AquaEventHandler<{
        value: string;
    }>;
}
export declare const AquaTabs: import("react").ForwardRefExoticComponent<AquaTabsProps & BaseProps & import("react").RefAttributes<AquaTabsEl>>;
export interface AquaTabProps extends BaseProps {
    label?: string;
    value?: string;
    selected?: boolean;
    disabled?: boolean;
}
export declare const AquaTab: import("react").ForwardRefExoticComponent<AquaTabProps & BaseProps & import("react").RefAttributes<HTMLElement>>;
export interface AquaGroupBoxProps extends BaseProps {
    label?: string;
    metal?: boolean;
}
export declare const AquaGroupBox: import("react").ForwardRefExoticComponent<AquaGroupBoxProps & BaseProps & import("react").RefAttributes<AquaGroupBoxEl>>;
export interface AquaTreeProps extends BaseProps {
    onSelect?: AquaEventHandler<{
        value: string;
    }>;
}
export declare const AquaTree: import("react").ForwardRefExoticComponent<AquaTreeProps & BaseProps & import("react").RefAttributes<AquaTreeEl>>;
export interface AquaTreeItemProps extends BaseProps {
    label?: string;
    value?: string;
    open?: boolean;
}
export declare const AquaTreeItem: import("react").ForwardRefExoticComponent<AquaTreeItemProps & BaseProps & import("react").RefAttributes<HTMLElement>>;
export interface AquaTableProps extends BaseProps {
    sortable?: boolean;
    selectable?: boolean;
    multiple?: boolean;
    onSelect?: AquaEventHandler<{
        rows: HTMLTableRowElement[];
    }>;
    onSort?: AquaEventHandler<{
        column: number;
        direction: "ascending" | "descending";
    }>;
}
export declare const AquaTable: import("react").ForwardRefExoticComponent<AquaTableProps & BaseProps & import("react").RefAttributes<AquaTableEl>>;
export interface AquaScrollProps extends BaseProps {
    arrows?: "ends" | "together" | "none";
}
export declare const AquaScroll: import("react").ForwardRefExoticComponent<AquaScrollProps & BaseProps & import("react").RefAttributes<AquaScrollEl>>;
export interface AquaSeparatorProps extends BaseProps {
    vertical?: boolean;
}
export declare const AquaSeparator: import("react").ForwardRefExoticComponent<AquaSeparatorProps & BaseProps & import("react").RefAttributes<AquaSeparatorEl>>;
export interface AquaDockProps extends BaseProps {
    onLaunch?: AquaEventHandler<{
        value: string | null;
    }>;
}
export declare const AquaDock: import("react").ForwardRefExoticComponent<AquaDockProps & BaseProps & import("react").RefAttributes<AquaDockEl>>;
export interface AquaDockItemProps extends BaseProps {
    label?: string;
    src?: string;
    running?: boolean;
    divider?: boolean;
    trash?: boolean;
    value?: string;
}
export declare const AquaDockItem: import("react").ForwardRefExoticComponent<AquaDockItemProps & BaseProps & import("react").RefAttributes<HTMLElement>>;
export interface AquaToolbarProps extends BaseProps {
    small?: boolean;
    onCommand?: AquaEventHandler<{
        value: string | null;
    }>;
}
export declare const AquaToolbar: import("react").ForwardRefExoticComponent<AquaToolbarProps & BaseProps & import("react").RefAttributes<AquaToolbarEl>>;
export interface AquaToolbarItemProps extends BaseProps {
    label?: string;
    src?: string;
    value?: string;
    divider?: boolean;
    spacer?: boolean;
    disabled?: boolean;
}
export declare const AquaToolbarItem: import("react").ForwardRefExoticComponent<AquaToolbarItemProps & BaseProps & import("react").RefAttributes<HTMLElement>>;

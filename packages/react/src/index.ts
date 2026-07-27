import "@aqua-ui/web-components";
import type {
  AquaButton as AquaButtonEl,
  AquaWindow as AquaWindowEl,
  AquaButtonGroup as AquaButtonGroupEl,
  AquaField as AquaFieldEl,
  AquaSelect as AquaSelectEl,
  AquaSlider as AquaSliderEl,
  AquaStepper as AquaStepperEl,
  AquaProgress as AquaProgressEl,
  AquaTabs as AquaTabsEl,
  AquaGroupBox as AquaGroupBoxEl,
  AquaTree as AquaTreeEl,
  AquaTable as AquaTableEl,
  AquaScroll as AquaScrollEl,
  AquaSeparator as AquaSeparatorEl,
  AquaDock as AquaDockEl,
  AquaToolbar as AquaToolbarEl,
} from "@aqua-ui/web-components";
import { wrap, type AquaEventHandler, type BaseProps } from "./wrap.js";

export { Aqua, AquaComponents, alert, sheet, contextMenu, closeMenus }
  from "@aqua-ui/web-components";
export type { AlertSpec, AlertButtonSpec, MenuSpec, MenuItemSpec, MenuChoice }
  from "@aqua-ui/web-components";
export type { AquaEvent, AquaEventHandler, BaseProps } from "./wrap.js";

export interface AquaWindowProps extends BaseProps {
  label?: string;
  status?: string;
  inactive?: boolean;
  metal?: boolean;
  sheet?: boolean;
  "no-controls"?: boolean;
  toolbar?: boolean | "hidden";
  onToolbartoggle?: AquaEventHandler<{ shown: boolean }>;
}
export const AquaWindow = wrap<AquaWindowEl, AquaWindowProps>("aqua-window");

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
export const AquaButton = wrap<AquaButtonEl, AquaButtonProps>("aqua-button");

export interface AquaButtonGroupProps extends BaseProps {
  value?: string;
  label?: string;
  disabled?: boolean;
  inactive?: boolean;
  multiple?: boolean;
  momentary?: boolean;
  icons?: boolean;
  onChange?: AquaEventHandler<{ value: string | string[] }>;
  onCommand?: AquaEventHandler<{ value: string }>;
}
export const AquaButtonGroup =
  wrap<AquaButtonGroupEl, AquaButtonGroupProps>("aqua-button-group");

export interface AquaCheckboxProps extends BaseProps {
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  value?: string;
  name?: string;
  onChange?: AquaEventHandler<{ value: string | null }>;
  onInput?: AquaEventHandler<{ value: string | null }>;
}
export const AquaCheckbox = wrap<HTMLElement, AquaCheckboxProps>("aqua-checkbox");
export const AquaRadio = wrap<HTMLElement, AquaCheckboxProps>("aqua-radio");

export interface AquaFieldProps extends BaseProps {
  label?: string;
  value?: string;
  placeholder?: string;
  type?: string;
  rows?: string | number;
  disabled?: boolean;
  readonly?: boolean;
  name?: string;
  onChange?: AquaEventHandler<{ value: string }>;
  onInput?: AquaEventHandler<{ value: string }>;
}
export const AquaField = wrap<AquaFieldEl, AquaFieldProps>("aqua-field");

export interface AquaSelectProps extends BaseProps {
  label?: string;
  value?: string;
  disabled?: boolean;
  name?: string;
  onChange?: AquaEventHandler<{ value: string | null }>;
}
export const AquaSelect = wrap<AquaSelectEl, AquaSelectProps>("aqua-select");

export interface AquaSliderProps extends BaseProps {
  min?: string | number;
  max?: string | number;
  step?: string | number;
  value?: string | number;
  ticks?: string | number;
  round?: boolean;
  disabled?: boolean;
  name?: string;
  onChange?: AquaEventHandler<{ value: number }>;
  onInput?: AquaEventHandler<{ value: number }>;
}
export const AquaSlider = wrap<AquaSliderEl, AquaSliderProps>("aqua-slider");

export interface AquaStepperProps extends BaseProps {
  value?: string | number;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  field?: boolean;
  disabled?: boolean;
  wrap?: boolean;
  name?: string;
  onChange?: AquaEventHandler<{ value: number }>;
}
export const AquaStepper = wrap<AquaStepperEl, AquaStepperProps>("aqua-stepper");

export interface AquaProgressProps extends BaseProps {
  value?: string | number;
  max?: string | number;
  done?: boolean;
}
export const AquaProgress = wrap<AquaProgressEl, AquaProgressProps>("aqua-progress");

export interface AquaTabsProps extends BaseProps {
  selected?: string;
  onChange?: AquaEventHandler<{ value: string }>;
}
export const AquaTabs = wrap<AquaTabsEl, AquaTabsProps>("aqua-tabs");

export interface AquaTabProps extends BaseProps {
  label?: string;
  value?: string;
  selected?: boolean;
  disabled?: boolean;
}
export const AquaTab = wrap<HTMLElement, AquaTabProps>("aqua-tab");

export interface AquaGroupBoxProps extends BaseProps {
  label?: string;
  metal?: boolean;
}
export const AquaGroupBox = wrap<AquaGroupBoxEl, AquaGroupBoxProps>("aqua-group-box");

export interface AquaTreeProps extends BaseProps {
  onSelect?: AquaEventHandler<{ value: string }>;
}
export const AquaTree = wrap<AquaTreeEl, AquaTreeProps>("aqua-tree");

export interface AquaTreeItemProps extends BaseProps {
  label?: string;
  value?: string;
  open?: boolean;
}
export const AquaTreeItem = wrap<HTMLElement, AquaTreeItemProps>("aqua-tree-item");

export interface AquaTableProps extends BaseProps {
  sortable?: boolean;
  selectable?: boolean;
  multiple?: boolean;
  onSelect?: AquaEventHandler<{ rows: HTMLTableRowElement[] }>;
  onSort?: AquaEventHandler<{ column: number; direction: "ascending" | "descending" }>;
}
export const AquaTable = wrap<AquaTableEl, AquaTableProps>("aqua-table");

export interface AquaScrollProps extends BaseProps {
  arrows?: "ends" | "together" | "none";
}
export const AquaScroll = wrap<AquaScrollEl, AquaScrollProps>("aqua-scroll");


export interface AquaSeparatorProps extends BaseProps {
  vertical?: boolean;
}
export const AquaSeparator = wrap<AquaSeparatorEl, AquaSeparatorProps>("aqua-separator");





export interface AquaDockProps extends BaseProps {
  onLaunch?: AquaEventHandler<{ value: string | null }>;
}
export const AquaDock = wrap<AquaDockEl, AquaDockProps>("aqua-dock");

export interface AquaDockItemProps extends BaseProps {
  label?: string;
  src?: string;
  running?: boolean;
  divider?: boolean;
  trash?: boolean;
  value?: string;
}
export const AquaDockItem = wrap<HTMLElement, AquaDockItemProps>("aqua-dock-item");

export interface AquaToolbarProps extends BaseProps {
  small?: boolean;
  onCommand?: AquaEventHandler<{ value: string | null }>;
}
export const AquaToolbar = wrap<AquaToolbarEl, AquaToolbarProps>("aqua-toolbar");

export interface AquaToolbarItemProps extends BaseProps {
  label?: string;
  src?: string;
  value?: string;
  divider?: boolean;
  spacer?: boolean;
  disabled?: boolean;
}
export const AquaToolbarItem = wrap<HTMLElement, AquaToolbarItemProps>("aqua-toolbar-item");

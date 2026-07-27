export interface MenuItemSpec {
    label?: string;
    id?: string;
    shortcut?: string;
    disabled?: boolean;
    checked?: boolean;
    separator?: boolean;
    items?: MenuItemSpec[] | HTMLUListElement;
}
export type MenuSpec = (MenuItemSpec | "-")[];
export interface MenuChoice {
    id: string | null;
    label: string;
    item: HTMLLIElement;
}
export interface AlertButtonSpec {
    id?: string;
    label: string;
    def?: boolean;
    default?: boolean;
    cancel?: boolean;
}
export interface AlertSpec {
    title?: string;
    icon?: string | false;
    message?: string;
    informative?: string;
    buttons?: (AlertButtonSpec | "-")[];
}
export declare function closeMenus(): void;
export declare function alert(o?: AlertSpec): Promise<string | null>;
export declare function sheet(win: HTMLElement, o?: AlertSpec): Promise<string | null>;
export declare function contextMenu(list: MenuSpec, x: number, y: number): Promise<MenuChoice | null>;
export declare function init(root?: Element | Document): void;
export interface AquaAPI {
    init: typeof init;
    alert: typeof alert;
    sheet: typeof sheet;
    menu: typeof contextMenu;
    closeMenus: typeof closeMenus;
}
export declare const Aqua: AquaAPI;

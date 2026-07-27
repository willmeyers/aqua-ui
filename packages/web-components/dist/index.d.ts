export { Base, define } from "./base.js";
export { el, fill, nextId, num, wire } from "./util.js";
export { AquaWindow } from "./window.js";
export { AquaButtonGroup } from "./button-group.js";
export { InputBase, AquaField, AquaSelect } from "./inputs.js";
export { AquaButton, AquaSlider, AquaStepper, AquaProgress } from "./controls.js";
export { AquaTabs, AquaGroupBox, AquaTree, AquaTable, AquaScroll } from "./containers.js";
export { AquaSeparator, AquaDock, AquaToolbar } from "./bars.js";
export { Aqua, init, alert, sheet, contextMenu, closeMenus } from "./ui.js";
export type { AquaAPI, AlertSpec, AlertButtonSpec, MenuSpec, MenuItemSpec, MenuChoice } from "./ui.js";
export { setupDock, initDocks } from "./dock-magnify.js";
export { initClocks } from "./clock-live.js";
import { Aqua } from "./ui.js";
export declare const AquaComponents: {
    alert: typeof import("./ui.js").alert;
    sheet: typeof import("./ui.js").sheet;
    menu: typeof import("./ui.js").contextMenu;
};
declare global {
    interface Window {
        Aqua: typeof Aqua & Record<string, unknown>;
        AquaComponents: typeof AquaComponents;
    }
}

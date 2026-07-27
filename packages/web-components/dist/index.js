export { Base, define } from "./base.js";
export { el, fill, nextId, num, wire } from "./util.js";
export { AquaWindow } from "./window.js";
export { AquaButtonGroup } from "./button-group.js";
export { InputBase, AquaField, AquaSelect } from "./inputs.js";
export { AquaButton, AquaSlider, AquaStepper, AquaProgress } from "./controls.js";
export { AquaTabs, AquaGroupBox, AquaTree, AquaTable, AquaScroll } from "./containers.js";
export { AquaSeparator, AquaDock, AquaToolbar } from "./bars.js";
export { Aqua, init, alert, sheet, contextMenu, closeMenus } from "./ui.js";
export { setupDock, initDocks } from "./dock-magnify.js";
export { initClocks } from "./clock-live.js";
import { Aqua } from "./ui.js";
import { initDocks } from "./dock-magnify.js";
import { initClocks } from "./clock-live.js";
export const AquaComponents = {
    alert: Aqua.alert,
    sheet: Aqua.sheet,
    menu: Aqua.menu,
};
window.Aqua = Object.assign(window.Aqua || {}, Aqua);
window.AquaComponents = AquaComponents;
const sweep = () => { initDocks(); initClocks(); };
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", sweep, { once: true });
}
else {
    sweep();
}

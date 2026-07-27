/* Selective-import smoke test: a single element module registers only
 * itself, injects nothing, and the styles module is an explicit opt-in.
 *
 *   node packages/web-components/test/selective.mjs
 */
import { Window } from "happy-dom";
const win = new Window({ url: "http://localhost/" });
for (const k of ["window","document","customElements","HTMLElement","Node","Event","CustomEvent","CSS","matchMedia"]) {
  try { globalThis[k] = win[k] ?? win.window[k]; } catch { /* read-only */ }
}
await import("@aqua-ui/web-components/window");
const only = !!customElements.get("aqua-window") && !customElements.get("aqua-checkbox");
const noAutoStyles = !document.querySelector("style[data-aqua-css]");
const { injectStyles } = await import("@aqua-ui/web-components/styles");
injectStyles();
const injected = !!document.querySelector("style[data-aqua-css]");
injectStyles();
const once = document.querySelectorAll("style[data-aqua-css]").length === 1;
console.log(JSON.stringify({ only, noAutoStyles, injected, once }));
if (!(only && noAutoStyles && injected && once)) { console.error("FAIL"); process.exit(1); }
console.log("selective import: all assertions passed");

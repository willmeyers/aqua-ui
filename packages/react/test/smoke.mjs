/* React-binding smoke test: render Aqua components into a happy-dom document,
 * check the custom elements upgrade and events reach React handlers.
 *
 *   node packages/react/test/smoke.mjs
 */
import { Window } from "happy-dom";

const win = new Window({ url: "http://localhost/" });
for (const k of ["window", "document", "customElements", "HTMLElement",
                 "Node", "Event", "CustomEvent", "MouseEvent", "KeyboardEvent",
                 "CSS", "matchMedia", "requestAnimationFrame",
                 "cancelAnimationFrame"]) {
  try { globalThis[k] = win[k] ?? win.window[k]; } catch { /* read-only global */ }
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const { createRoot } = await import("react-dom/client");
const React = (await import("react")).default;
const { AquaButtonGroup, AquaField, AquaProgress, AquaWindow } = await import("@aqua-ui/react");

const host = document.createElement("div");
document.body.appendChild(host);

let changed = null;
const inputFires = [];
const app = React.createElement(
  "div", null,
  React.createElement(AquaButtonGroup, {
    id: "grp", value: "a",
    onChange: (e) => { changed = e.detail.value; },
  },
    React.createElement("button", { value: "a" }, "A"),
    React.createElement("button", { value: "b" }, "B"),
  ),
  React.createElement(AquaProgress, { id: "prog", value: 40, max: 100 }),
  React.createElement(AquaField, {
    id: "fld", label: "Name",
    onInput: (e) => { inputFires.push(e.detail); },
  }),
  React.createElement(AquaWindow, { id: "win", label: "Test", metal: true }, "hello"),
);

const root = createRoot(host);
const { act } = React;
await act(async () => { root.render(app); });
await new Promise((r) => setTimeout(r, 50));

const fail = (m) => { console.error("FAIL:", m); process.exit(1); };

const grp = document.getElementById("grp");
if (!grp || !grp.classList.contains("segmented")) fail("button group did not upgrade/render");
const segs = grp.querySelectorAll("button.segment");
if (segs.length !== 2) fail(`expected 2 segments, got ${segs.length}`);

await act(async () => { segs[1].click(); });
if (changed !== "b") fail(`change event did not reach React handler (got ${changed})`);

const prog = document.getElementById("prog");
const bar = prog && prog.querySelector("progress");
if (!bar || bar.getAttribute("max") !== "100") fail("progress did not render");
if (prog.value !== 40) fail(`progress property not set (got ${prog.value})`);

const w = document.getElementById("win");
if (!w || !w.classList.contains("window")) fail("window did not render");
if (!w.classList.contains("metal")) fail("boolean prop `metal` not applied as property");
if (!w.querySelector(".title-bar-text") ||
    w.querySelector(".title-bar-text").textContent !== "Test") fail("window label wrong");
if (!w.querySelector(".window-body")) fail("window body missing");

if (!document.querySelector("style[data-aqua-css]")) fail("bundled stylesheet was not injected on import");
if (!document.documentElement.classList.contains("aqua")) fail("root .aqua scope class was not applied");

const fld = document.getElementById("fld");
const inner = fld && fld.querySelector("input");
if (!inner) fail("field did not render an input");
await act(async () => {
  inner.value = "cheetah";
  inner.dispatchEvent(new Event("input", { bubbles: true }));
});
if (inputFires.length !== 1) fail(`input handler fired ${inputFires.length} times, expected exactly once`);
if (!inputFires[0] || inputFires[0].value !== "cheetah") fail("input event lacked detail.value");

const { readFileSync } = await import("node:fs");
const own = JSON.parse(readFileSync(new URL("../package.json", import.meta.url)));
const wc = JSON.parse(readFileSync(new URL("../../web-components/package.json", import.meta.url)));
if (own.dependencies["@aqua-ui/web-components"] !== wc.version) {
  fail(`version drift: react depends on web-components@${own.dependencies["@aqua-ui/web-components"]} but workspace is ${wc.version}`);
}

console.log("react smoke: all assertions passed");
process.exit(0);

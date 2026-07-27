import { Base, define } from "./base.js";
import { el, fill, wire } from "./util.js";

export class AquaWindow extends Base {
  static observedAttributes = ["label", "status", "inactive", "metal", "sheet",
                               "no-controls", "toolbar"];

  declare label: string | null;
  declare status: string | null;
  declare inactive: boolean;
  declare metal: boolean;
  declare sheet: boolean;
  declare noControls: boolean;


  render(): void {
    this.className = ["window", this.inactive && "inactive",
                      this.metal && "metal", this.sheet && "sheet"]
      .filter(Boolean).join(" ");
    const gems = this.noControls ? null : el("div", { class: "title-bar-controls" },
      (["Close", "Minimize", "Zoom"] as const).map((k) =>
        el("button", { "aria-label": k },
           el("span", { text: { Close: "×", Minimize: "−", Zoom: "+" }[k] }))));
    const toggle = this.hasAttribute("toolbar")
      ? el("button", {
          class: "toolbar-toggle", type: "button",
          "aria-label": "Hide Toolbar", "aria-pressed": "true",
        }, el("span", { text: "Toolbar" }))
      : null;
    const body = el("div", { class: "window-body" });
    body.append(this._frag);
    const bar = body.querySelector(":scope > aqua-toolbar, :scope > .toolbar");
    fill(this,
      el("div", { class: "title-bar" }, [
        gems,
        el("div", { class: "title-bar-text", text: this.label || "" }),
        toggle || el("div", { style: `width:${this.noControls ? 0 : 49}px;flex:0 0 auto` }),
      ]),
      bar,
      body,
      this.status != null ? el("div", { class: "status-bar" },
        el("span", { text: this.status })) : null,
    );
    if (toggle) {
      toggle.addEventListener("click", () => this.toggleToolbar());
      this.dataset.toolbar = this.getAttribute("toolbar") === "hidden"
        ? "hidden" : "shown";
    }
    wire(this);
  }

  update(): void {
    this.classList.toggle("inactive", this.inactive);
    this.classList.toggle("metal", this.metal);
    const t = this.querySelector(".title-bar-text");
    if (t) t.textContent = this.label || "";
    const s = this.querySelector(".status-bar span");
    if (s) s.textContent = this.status || "";
  }

  get body(): HTMLElement | null { return this.querySelector(".window-body"); }




  toggleToolbar(show?: boolean): void {
    const next = show == null ? this.dataset.toolbar === "hidden" : !!show;
    this.dataset.toolbar = next ? "shown" : "hidden";
    const t = this.querySelector(".toolbar-toggle");
    if (t) {
      t.setAttribute("aria-pressed", String(next));
      t.setAttribute("aria-label", next ? "Hide Toolbar" : "Show Toolbar");
    }
    this.emit("toolbartoggle", { shown: next });
  }
}
AquaWindow.attr("label", "status").bool("inactive", "metal", "sheet", "no-controls");
define("aqua-window", AquaWindow);

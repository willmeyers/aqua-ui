import { Base, define } from "./base.js";
import { el, fill, nextId, wire } from "./util.js";

export class AquaSeparator extends Base {
  static observedAttributes = ["vertical"];

  declare vertical: boolean;

  render(): void {
    this.style.display = "contents";
    fill(this, el("hr", {
      class: `separator${this.vertical ? " vertical" : ""}`,
    }));
  }

  update(): void {
    const hr = this.querySelector("hr");
    if (hr) hr.className = `separator${this.vertical ? " vertical" : ""}`;
  }
}
AquaSeparator.bool("vertical");
define("aqua-separator", AquaSeparator);

define("aqua-dock-item", class extends HTMLElement {});

interface DockItemModel {
  label: string;
  src: string | null;
  running: boolean;
  divider: boolean;
  trash: boolean;
  value: string | null;
}

export class AquaDock extends Base {
  private _model: DockItemModel[] = [];

  protected _read(src: DocumentFragment): void {
    this._model = ([...src.children] as HTMLElement[])
      .filter((c) => c.tagName === "AQUA-DOCK-ITEM")
      .map((c) => ({
        label: c.getAttribute("label") || "",
        src: c.getAttribute("src"),
        running: c.hasAttribute("running"),
        divider: c.hasAttribute("divider"),
        trash: c.hasAttribute("trash"),
        value: c.getAttribute("value") || c.id || c.getAttribute("label"),
      }));
  }

  render(): void {
    this.className = "dock";
    fill(this, this._model.map((it) => {
      if (it.divider) return el("div", { class: "dock-divider" });
      const d = el("div", {
        class: `dock-item${it.running ? " running" : ""}`,
        "data-trash": it.trash || /^trash$/i.test(it.label || "") || null,
      }, [
        el("span", { class: "dock-label", text: it.label }),
        it.src ? el("img", { src: it.src, alt: it.label }) : null,
      ]);
      d.addEventListener("click", () => this.emit("launch", { value: it.value }));
      return d;
    }));
  }
}
define("aqua-dock", AquaDock);

define("aqua-toolbar-item", class extends HTMLElement {});

interface ToolbarItemModel {
  label: string;
  src: string | null;
  value: string | null;
  divider: boolean;
  spacer: boolean;
  disabled: boolean;
  html: string;
}

export class AquaToolbar extends Base {
  static observedAttributes = ["small"];

  declare small: boolean;

  private _items: ToolbarItemModel[] = [];

  protected _read(src: DocumentFragment): void {
    this._items = ([...src.children] as HTMLElement[])
      .filter((c) => c.tagName === "AQUA-TOOLBAR-ITEM")
      .map((c) => ({
        label: c.getAttribute("label") ?? c.textContent!.trim(),
        src: c.getAttribute("src"),
        value: c.getAttribute("value") || c.id || c.getAttribute("label"),
        divider: c.hasAttribute("divider"),
        spacer: c.hasAttribute("spacer"),
        disabled: c.hasAttribute("disabled"),
        html: c.innerHTML.trim(),
      }));
  }

  render(): void {
    this.className = `toolbar${this.small ? " small" : ""}`;
    fill(this, this._items.map((it) => {
      if (it.divider) return el("i", { class: "toolbar-divider" });
      if (it.spacer) return el("i", { class: "spacer" });
      const b = el("button", {
        class: "toolbar-item", type: "button", value: it.value,
        disabled: it.disabled,
      });
      if (it.src) b.append(el("img", { src: it.src, alt: "" }));
      else if (it.html) b.append(el("span", { class: "toolbar-icon", html: it.html }));
      if (it.label) b.append(el("span", { text: it.label }));
      b.addEventListener("click", () => this.emit("command", { value: it.value }));
      return b;
    }));
  }

  update(): void { this.classList.toggle("small", this.small); }
}
AquaToolbar.bool("small");
define("aqua-toolbar", AquaToolbar);

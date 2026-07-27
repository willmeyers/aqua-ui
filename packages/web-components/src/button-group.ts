import { Base, define } from "./base.js";
import { el, fill } from "./util.js";

interface Segment {
  value: string;
  icon: string | null;
  src: string | null;
  label: string;
  html: string;
  disabled: boolean;
}

export class AquaButtonGroup extends Base {
  static formAssociated = true;
  static observedAttributes = ["value", "disabled", "inactive", "multiple",
                               "momentary", "icons"];

  declare disabled: boolean;
  declare inactive: boolean;
  declare multiple: boolean;
  declare momentary: boolean;
  declare icons: boolean;

  private _internals: ElementInternals | null;
  private _items: Segment[] = [];
  private _keyed = false;

  constructor() {
    super();
    this._internals = this.attachInternals ? this.attachInternals() : null;
  }

  protected _read(src: DocumentFragment): void {
    this._items = ([...src.children] as HTMLElement[])
      .filter((c) => c.tagName === "BUTTON" || c.hasAttribute("value"))
      .map((c) => ({
        value: c.getAttribute("value") ?? c.textContent!.trim(),
        icon: c.getAttribute("icon"),
        src: c.getAttribute("src"),
        label: c.getAttribute("label") || c.textContent!.trim(),
        html: c.innerHTML.trim(),
        disabled: c.hasAttribute("disabled"),
      }));
  }

  render(): void {
    this.classList.add("segmented");
    this.classList.toggle("icons", this.icons ||
      this._items.every((i) => (i.icon || i.src) && !i.html));
    this.classList.toggle("inactive", this.inactive);
    const single = !this.multiple && !this.momentary;
    this.setAttribute("role", this.momentary ? "group"
      : single ? "radiogroup" : "group");
    if (!this.hasAttribute("aria-label") && this.getAttribute("label")) {
      this.setAttribute("aria-label", this.getAttribute("label")!);
    }
    fill(this, this._items.map((it) => {
      const b = el("button", {
        class: "segment",
        type: "button",
        value: it.value,
        disabled: it.disabled || this.disabled,
        "aria-label": (it.icon || it.src) && !it.html ? it.label : null,
        role: this.momentary ? null : single ? "radio" : "checkbox",
      });
      if (it.icon) b.append(el("i", { class: "seg-glyph", "data-icon": it.icon }));
      if (it.src) b.append(el("img", { src: it.src, alt: "" }));
      if (it.html && !it.icon && !it.src) b.innerHTML = it.html;
      else if (it.html && (it.icon || it.src)) b.append(el("span", { html: it.html }));
      b.addEventListener("click", () => this._pick(it.value));
      return b;
    }));
    if (single && !this.disabled) this.tabIndex = 0;
    else this.removeAttribute("tabindex");
    this._sync();
    this._snap();
  }

  private _snap(): void {
    const segs = [...this.children] as HTMLElement[];
    for (const s of segs) s.style.width = "";
    const widths = segs.map((s) => s.getBoundingClientRect().width);
    segs.forEach((s, i) => {
      if (widths[i]) s.style.width = `${Math.round(widths[i])}px`;
    });
  }

  protected _connected(): void {
    document.fonts?.ready.then(() => this._snap());
    if (!this._keyed) {
      this._keyed = true;
      this.addEventListener("keydown", (e: KeyboardEvent) => {
        if (this.multiple || this.momentary || this.disabled) return;
        const vals = this._items.filter((i) => !i.disabled).map((i) => i.value);
        const i = vals.indexOf(this.value);
        let n = i;
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = i - 1;
        else if (e.key === "ArrowRight" || e.key === "ArrowDown") n = i + 1;
        else if (e.key === "Home") n = 0;
        else if (e.key === "End") n = vals.length - 1;
        else return;
        e.preventDefault();
        this._pick(vals[(n + vals.length) % vals.length]);
      });
    }
  }

  private _pick(v: string): void {
    if (this.disabled) return;
    if (this.momentary) { this.emit("command", { value: v }); return; }
    if (this.multiple) {
      const set = new Set(this.values);
      set.has(v) ? set.delete(v) : set.add(v);
      this.value = [...set].join(" ");
    } else {
      if (this.value === v) return;
      this.value = v;
    }
    this.emit("change", { value: this.multiple ? this.values : this.value });
  }

  private _sync(): void {
    const on = new Set(this.multiple ? this.values : [this.value]);
    for (const b of this.children as HTMLCollectionOf<HTMLButtonElement>) {
      if (this.momentary) continue;
      b.setAttribute("aria-checked", String(on.has(b.value)));
    }
    this.classList.toggle("inactive", this.inactive);
    this._internals?.setFormValue(this.value ?? "");
  }

  update(): void {
    for (const b of this.children as HTMLCollectionOf<HTMLButtonElement>) {
      b.disabled = this.disabled ||
        !!this._items.find((i) => i.value === b.value)?.disabled;
    }
    this._sync();
  }

  get value(): string { return this.getAttribute("value") ?? ""; }
  set value(v: string) { this.setAttribute("value", v); }
  get values(): string[] { return this.value.split(/\s+/).filter(Boolean); }
  set values(a: string | string[]) { this.value = ([] as string[]).concat(a).join(" "); }
}
AquaButtonGroup.bool("disabled", "inactive", "multiple", "momentary", "icons");
define("aqua-button-group", AquaButtonGroup);

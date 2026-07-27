import { Base, define } from "./base.js";
import { el, fill, num } from "./util.js";
import { InputBase } from "./inputs.js";

export class AquaButton extends Base {
  static observedAttributes = ["default", "pulsing", "disabled", "type", "label",
                               "bevel", "square"];

  declare pulsing: boolean;
  declare disabled: boolean;
  declare bevel: boolean;
  declare square: boolean;

  private _btn: HTMLButtonElement | null = null;

  render(): void {
    this.style.display = this.style.display || "contents";
    const b = el("button", {
      type: this.getAttribute("type") || "button",
      disabled: this.disabled,
    });
    if (this.getAttribute("label")) b.textContent = this.getAttribute("label");
    else b.append(this._frag);
    this._btn = b;
    this._sync();
    fill(this, b);
  }

  private _sync(): void {
    if (!this._btn) return;
    this._btn.classList.toggle("default", this.hasAttribute("default"));
    this._btn.classList.toggle("pulsing", this.pulsing);
    this._btn.classList.toggle("bevel", this.bevel);
    this._btn.classList.toggle("square", this.square);
    this._btn.disabled = this.disabled;
  }

  update(): void { this._sync(); }
  get button(): HTMLButtonElement | null { return this._btn; }
  focus(o?: FocusOptions): void { this._btn ? this._btn.focus(o) : super.focus(o); }
}
AquaButton.bool("pulsing", "disabled", "bevel", "square");
define("aqua-button", AquaButton);

export class AquaSlider extends InputBase {
  static observedAttributes = ["min", "max", "step", "value", "ticks",
                               "round", "disabled", "name"];

  declare min: string | null;
  declare max: string | null;
  declare step: string | null;
  declare ticks: string | null;
  declare round: boolean;
  declare disabled: boolean;

  render(): void {
    const input = el("input", {
      type: "range",
      class: this.round ? "round" : null,
      min: this.getAttribute("min") ?? 0,
      max: this.getAttribute("max") ?? 100,
      step: this.getAttribute("step") ?? 1,
      disabled: this.disabled,
    });
    input.value = this.getAttribute("value") ?? "50";
    input.addEventListener("input", () => this.setAttribute("value", input.value));
    this.style.display = this.style.display || "inline-block";
    const n = num(this.getAttribute("ticks"), 0);
    const ticks = n > 0
      ? el("div", { class: "slider-ticks" },
           Array.from({ length: n }, () => el("i")))
      : null;
    fill(this, input, ticks);
    this._bind(input);
  }

  update(): void {
    const input = this.input as HTMLInputElement | null;
    if (!input) return;
    for (const a of ["min", "max", "step"] as const) {
      if (this.hasAttribute(a)) input[a] = this.getAttribute(a)!;
    }
    const v = this.getAttribute("value");
    if (v != null && input.value !== v) input.value = v;
    input.disabled = this.disabled;
    this._value();
  }

  get value(): number { return this.input ? +this.input.value : num(this.getAttribute("value"), 0); }
  set value(v: number | string) { this.setAttribute("value", String(v)); }
}
AquaSlider.attr("min", "max", "step", "ticks").bool("round", "disabled");
define("aqua-slider", AquaSlider);

export class AquaStepper extends InputBase {
  static observedAttributes = ["value", "min", "max", "step", "field",
                               "disabled", "wrap", "name"];

  declare min: string | null;
  declare max: string | null;
  declare step: string | null;
  declare field: boolean;
  declare disabled: boolean;
  declare wrap: boolean;

  private _box: HTMLInputElement | null = null;

  render(): void {
    const box = this.field
      ? el("input", { type: "text", style: "width:52px",
                      disabled: this.disabled })
      : null;
    if (box) {
      box.value = String(this.value);
      box.addEventListener("change", () => (this.value = num(box.value, this.value)));
    }
    const mk = (label: string, dir: 1 | -1): HTMLButtonElement => {
      const b = el("button", { "aria-label": label, disabled: this.disabled });
      let t1 = 0, t2 = 0;
      const stop = (): void => { clearTimeout(t1); clearInterval(t2); };
      b.addEventListener("pointerdown", () => {
        this._nudge(dir);
        t1 = window.setTimeout(() => {
          t2 = window.setInterval(() => this._nudge(dir), 60);
        }, 400);
      });
      for (const e of ["pointerup", "pointerleave", "pointercancel"]) {
        b.addEventListener(e, stop);
      }
      return b;
    };
    this.className = "field-row";
    this._box = box;
    fill(this, box, el("span", { class: "stepper" },
      [mk("Increment", 1), mk("Decrement", -1)]));
    this._value();
  }

  private _nudge(dir: 1 | -1): void {
    if (this.disabled) return;
    const step = num(this.getAttribute("step"), 1);
    const min = num(this.getAttribute("min"), -Infinity);
    const max = num(this.getAttribute("max"), Infinity);
    let v = this.value + dir * step;
    if (v > max) v = this.wrap ? min : max;
    if (v < min) v = this.wrap ? max : min;
    if (v === this.value) return;
    this.value = v;
    this.emit("change", { value: v });
  }

  update(): void {
    if (this._box) {
      this._box.value = String(this.value);
      this._box.disabled = this.disabled;
    }
    for (const b of this.querySelectorAll<HTMLButtonElement>(".stepper button")) {
      b.disabled = this.disabled;
    }
    this._value();
  }

  formValue(): string { return String(this.value); }
  get value(): number { return num(this.getAttribute("value"), 0); }
  set value(v: number | string) { this.setAttribute("value", String(v)); }
}
AquaStepper.attr("min", "max", "step").bool("field", "disabled", "wrap");
define("aqua-stepper", AquaStepper);

export class AquaProgress extends Base {
  static observedAttributes = ["value", "max", "done"];

  private _p: HTMLProgressElement | null = null;

  render(): void {
    const p = el("progress", { max: this.getAttribute("max") ?? 100 });
    if (this.hasAttribute("value")) p.value = +this.getAttribute("value")!;
    p.classList.toggle("done", this.hasAttribute("done"));
    p.style.width = "100%";
    this.style.display = this.style.display || "block";
    if (!this.style.width && !this.getAttribute("width")) this.style.minWidth = "220px";
    fill(this, p);
    this._p = p;
  }

  update(): void {
    if (!this._p) return;
    if (this.hasAttribute("value")) this._p.value = +this.getAttribute("value")!;
    else this._p.removeAttribute("value");
    this._p.classList.toggle("done", this.hasAttribute("done"));
    this._p.max = +(this.getAttribute("max") ?? 100);
  }

  get value(): number | null { return this.hasAttribute("value") ? +this.getAttribute("value")! : null; }
  set value(v: number | string | null) {
    v == null ? this.removeAttribute("value") : this.setAttribute("value", String(v));
  }
}
define("aqua-progress", AquaProgress);

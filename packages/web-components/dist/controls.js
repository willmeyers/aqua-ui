import { Base, define } from "./base.js";
import { el, fill, num } from "./util.js";
import { InputBase } from "./inputs.js";
export class AquaButton extends Base {
    constructor() {
        super(...arguments);
        this._btn = null;
    }
    render() {
        this.style.display = this.style.display || "contents";
        const b = el("button", {
            type: this.getAttribute("type") || "button",
            disabled: this.disabled,
        });
        if (this.getAttribute("label"))
            b.textContent = this.getAttribute("label");
        else
            b.append(this._frag);
        this._btn = b;
        this._sync();
        fill(this, b);
    }
    _sync() {
        if (!this._btn)
            return;
        this._btn.classList.toggle("default", this.hasAttribute("default"));
        this._btn.classList.toggle("pulsing", this.pulsing);
        this._btn.classList.toggle("bevel", this.bevel);
        this._btn.classList.toggle("square", this.square);
        this._btn.disabled = this.disabled;
    }
    update() { this._sync(); }
    get button() { return this._btn; }
    focus(o) { this._btn ? this._btn.focus(o) : super.focus(o); }
}
AquaButton.observedAttributes = ["default", "pulsing", "disabled", "type", "label",
    "bevel", "square"];
AquaButton.bool("pulsing", "disabled", "bevel", "square");
define("aqua-button", AquaButton);
export class AquaSlider extends InputBase {
    render() {
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
            ? el("div", { class: "slider-ticks" }, Array.from({ length: n }, () => el("i")))
            : null;
        fill(this, input, ticks);
        this._bind(input);
    }
    update() {
        const input = this.input;
        if (!input)
            return;
        for (const a of ["min", "max", "step"]) {
            if (this.hasAttribute(a))
                input[a] = this.getAttribute(a);
        }
        const v = this.getAttribute("value");
        if (v != null && input.value !== v)
            input.value = v;
        input.disabled = this.disabled;
        this._value();
    }
    get value() { return this.input ? +this.input.value : num(this.getAttribute("value"), 0); }
    set value(v) { this.setAttribute("value", String(v)); }
}
AquaSlider.observedAttributes = ["min", "max", "step", "value", "ticks",
    "round", "disabled", "name"];
AquaSlider.attr("min", "max", "step", "ticks").bool("round", "disabled");
define("aqua-slider", AquaSlider);
export class AquaStepper extends InputBase {
    constructor() {
        super(...arguments);
        this._box = null;
    }
    render() {
        const box = this.field
            ? el("input", { type: "text", style: "width:52px",
                disabled: this.disabled })
            : null;
        if (box) {
            box.value = String(this.value);
            box.addEventListener("change", (e) => {
                e.stopPropagation();
                this.value = num(box.value, this.value);
                this.emit("change", { value: this.value });
            });
        }
        const mk = (label, dir) => {
            const b = el("button", { "aria-label": label, disabled: this.disabled });
            let t1 = 0, t2 = 0;
            const stop = () => { clearTimeout(t1); clearInterval(t2); };
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
        fill(this, box, el("span", { class: "stepper" }, [mk("Increment", 1), mk("Decrement", -1)]));
        this._value();
    }
    _nudge(dir) {
        if (this.disabled)
            return;
        const step = num(this.getAttribute("step"), 1);
        const min = num(this.getAttribute("min"), -Infinity);
        const max = num(this.getAttribute("max"), Infinity);
        let v = this.value + dir * step;
        if (v > max)
            v = this.wrap ? min : max;
        if (v < min)
            v = this.wrap ? max : min;
        if (v === this.value)
            return;
        this.value = v;
        this.emit("change", { value: v });
    }
    update() {
        if (this._box) {
            this._box.value = String(this.value);
            this._box.disabled = this.disabled;
        }
        for (const b of this.querySelectorAll(".stepper button")) {
            b.disabled = this.disabled;
        }
        this._value();
    }
    formValue() { return String(this.value); }
    get value() { return num(this.getAttribute("value"), 0); }
    set value(v) { this.setAttribute("value", String(v)); }
}
AquaStepper.observedAttributes = ["value", "min", "max", "step", "field",
    "disabled", "wrap", "name"];
AquaStepper.attr("min", "max", "step").bool("field", "disabled", "wrap");
define("aqua-stepper", AquaStepper);
export class AquaProgress extends Base {
    constructor() {
        super(...arguments);
        this._p = null;
    }
    render() {
        const p = el("progress", { max: this.getAttribute("max") ?? 100 });
        if (this.hasAttribute("value"))
            p.value = +this.getAttribute("value");
        p.classList.toggle("done", this.hasAttribute("done"));
        p.style.width = "100%";
        this.style.display = this.style.display || "block";
        if (!this.style.width && !this.getAttribute("width"))
            this.style.minWidth = "220px";
        fill(this, p);
        this._p = p;
    }
    update() {
        if (!this._p)
            return;
        if (this.hasAttribute("value"))
            this._p.value = +this.getAttribute("value");
        else
            this._p.removeAttribute("value");
        this._p.classList.toggle("done", this.hasAttribute("done"));
        this._p.max = +(this.getAttribute("max") ?? 100);
    }
    get value() { return this.hasAttribute("value") ? +this.getAttribute("value") : null; }
    set value(v) {
        v == null ? this.removeAttribute("value") : this.setAttribute("value", String(v));
    }
}
AquaProgress.observedAttributes = ["value", "max", "done"];
define("aqua-progress", AquaProgress);

import { Base, define } from "./base.js";
import { el, fill, nextId, wire } from "./util.js";
export class InputBase extends Base {
    constructor() {
        super();
        this.input = null;
        this._internals = this.attachInternals ? this.attachInternals() : null;
    }
    _bind(input) {
        this.input = input;
        input.addEventListener("input", () => { this._value(); this.emit("input", { value: this.value }); });
        input.addEventListener("change", () => { this._value(); this.emit("change", { value: this.value }); });
        this._value();
    }
    _value() {
        this._internals?.setFormValue(this.formValue());
    }
    formValue() { return this.input ? this.input.value : null; }
    formResetCallback() { this.render(); }
    get form() { return this._internals ? this._internals.form : null; }
    focus(o) { this.input ? this.input.focus(o) : super.focus(o); }
}
InputBase.formAssociated = true;
function toggle(tag, type, cls) {
    class Toggle extends InputBase {
        render() {
            const id = this.id ? `${this.id}-i` : nextId(type);
            const input = el("input", {
                type, id,
                value: this.getAttribute("value") ?? "on",
                checked: this.checked,
                disabled: this.disabled,
            });
            input.indeterminate = this.indeterminate;
            input.addEventListener("change", () => {
                this.toggleAttribute("checked", input.checked);
                if (type === "radio" && input.checked) {
                    for (const o of this._siblings())
                        if (o !== this)
                            o.checked = false;
                }
            });
            this.className = cls;
            fill(this, input, el("label", { for: id, html: this._source }));
            this._bind(input);
        }
        _siblings() {
            const name = this.getAttribute("name");
            if (!name)
                return [];
            const scope = this.closest("form") || document;
            return [...scope.querySelectorAll(`${tag}[name="${CSS.escape(name)}"]`)];
        }
        update() {
            const input = this.input;
            if (!input)
                return;
            input.checked = this.checked;
            input.disabled = this.disabled;
            input.indeterminate = this.indeterminate;
            this._value();
        }
        formValue() {
            const input = this.input;
            return input && input.checked ? input.value : null;
        }
        get value() { return this.formValue(); }
    }
    Toggle.observedAttributes = ["checked", "disabled", "indeterminate", "value", "name"];
    Toggle.bool("checked", "disabled", "indeterminate");
    define(tag, Toggle);
}
toggle("aqua-checkbox", "checkbox", "field-row");
toggle("aqua-radio", "radio", "field-row");
export class AquaField extends InputBase {
    render() {
        const type = this.getAttribute("type") || "text";
        const id = this.id ? `${this.id}-i` : nextId("field");
        const input = type === "textarea"
            ? el("textarea", { id, rows: this.getAttribute("rows") || 3 })
            : el("input", { id, type });
        if (this.hasAttribute("placeholder")) {
            input.setAttribute("placeholder", this.getAttribute("placeholder"));
        }
        input.value = this.getAttribute("value") ?? "";
        input.disabled = this.disabled;
        input.readOnly = this.readonly;
        input.addEventListener("input", () => this.setAttribute("value", input.value));
        this.className = this.label ? "field-row-stacked" : "field-row";
        fill(this, this.label ? el("label", { for: id, text: this.label }) : null, input);
        this._bind(input);
    }
    update() {
        const input = this.input;
        if (!input)
            return;
        if (input.value !== (this.getAttribute("value") ?? "")) {
            input.value = this.getAttribute("value") ?? "";
        }
        input.disabled = this.disabled;
        input.readOnly = this.readonly;
        this._value();
    }
    get value() { return this.input ? this.input.value : this.getAttribute("value") ?? ""; }
    set value(v) { this.setAttribute("value", v); }
}
AquaField.observedAttributes = ["label", "value", "placeholder", "type",
    "disabled", "readonly", "rows", "name"];
AquaField.attr("label", "placeholder", "type", "rows").bool("disabled", "readonly");
define("aqua-field", AquaField);
export class AquaSelect extends InputBase {
    constructor() {
        super(...arguments);
        this._options = [];
    }
    _read(src) { this._options = this._sourceOptions(src); }
    _sourceOptions(src) {
        return [...src.querySelectorAll("option")].map((o) => ({
            value: o.value, label: o.textContent ?? "", disabled: o.disabled,
            selected: o.selected || o.hasAttribute("selected"),
        }));
    }
    render() {
        const id = this.id ? `${this.id}-i` : nextId("select");
        const sel = el("select", { id, disabled: this.disabled });
        for (const o of this._options) {
            sel.append(el("option", { value: o.value, text: o.label,
                disabled: o.disabled }));
        }
        const want = this.getAttribute("value");
        sel.value = want != null ? want
            : (this._options.find((o) => o.selected) || this._options[0])?.value ?? "";
        sel.addEventListener("change", () => this.setAttribute("value", sel.value));
        this.className = this.label ? "field-row" : "";
        fill(this, this.label ? el("label", { for: id, text: this.label }) : null, el("span", { class: "select-wrapper" }, sel));
        this._bind(sel);
        wire(this); // aqua-ui turns this into a real popup menu
    }
    update() {
        if (!this.input)
            return;
        const v = this.getAttribute("value");
        if (v != null && this.input.value !== v)
            this.input.value = v;
        this.input.disabled = this.disabled;
        this._value();
    }
    get value() { return this.input ? this.input.value : this.getAttribute("value"); }
    set value(v) { this.setAttribute("value", v); }
    get options() { return this._options; }
    set options(list) {
        this._options = list.map((o) => typeof o === "string"
            ? { value: o, label: o } : o);
        this.render();
    }
}
AquaSelect.observedAttributes = ["label", "value", "disabled", "name"];
AquaSelect.attr("label").bool("disabled");
define("aqua-select", AquaSelect);

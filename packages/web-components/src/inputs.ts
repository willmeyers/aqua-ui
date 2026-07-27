import { Base, define } from "./base.js";
import { el, fill, nextId, wire } from "./util.js";

type NativeInput = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export abstract class InputBase extends Base {
  static formAssociated = true;

  input: NativeInput | null = null;
  protected _internals: ElementInternals | null;

  constructor() {
    super();
    this._internals = this.attachInternals ? this.attachInternals() : null;
  }

  protected _bind(input: NativeInput): void {
    this.input = input;
    input.addEventListener("input", () => { this._value(); this.emit("input", { value: this.value }); });
    input.addEventListener("change", () => { this._value(); this.emit("change", { value: this.value }); });
    this._value();
  }

  protected _value(): void {
    this._internals?.setFormValue(this.formValue());
  }

  formValue(): string | null { return this.input ? this.input.value : null; }
  formResetCallback(): void { this.render(); }
  get form(): HTMLFormElement | null { return this._internals ? this._internals.form : null; }
  focus(o?: FocusOptions): void { this.input ? this.input.focus(o) : super.focus(o); }

  abstract get value(): unknown;
}

function toggle(tag: string, type: "checkbox" | "radio", cls: string): void {
  class Toggle extends InputBase {
    static observedAttributes = ["checked", "disabled", "indeterminate", "value", "name"];

    declare checked: boolean;
    declare disabled: boolean;
    declare indeterminate: boolean;

    render(): void {
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
          for (const o of this._siblings()) if (o !== this) o.checked = false;
        }
      });
      this.className = cls;
      fill(this, input, el("label", { for: id, html: this._source }));
      this._bind(input);
    }

    private _siblings(): Toggle[] {
      const name = this.getAttribute("name");
      if (!name) return [];
      const scope = this.closest("form") || document;
      return [...scope.querySelectorAll(`${tag}[name="${CSS.escape(name)}"]`)] as Toggle[];
    }

    update(): void {
      const input = this.input as HTMLInputElement | null;
      if (!input) return;
      input.checked = this.checked;
      input.disabled = this.disabled;
      input.indeterminate = this.indeterminate;
      this._value();
    }

    formValue(): string | null {
      const input = this.input as HTMLInputElement | null;
      return input && input.checked ? input.value : null;
    }

    get value(): string | null { return this.formValue(); }
  }
  Toggle.bool("checked", "disabled", "indeterminate");
  define(tag, Toggle);
}
toggle("aqua-checkbox", "checkbox", "field-row");
toggle("aqua-radio", "radio", "field-row");

export class AquaField extends InputBase {
  static observedAttributes = ["label", "value", "placeholder", "type",
                               "disabled", "readonly", "rows", "name"];

  declare label: string | null;
  declare placeholder: string | null;
  declare type: string | null;
  declare rows: string | null;
  declare disabled: boolean;
  declare readonly: boolean;

  render(): void {
    const type = this.getAttribute("type") || "text";
    const id = this.id ? `${this.id}-i` : nextId("field");
    const input = type === "textarea"
      ? el("textarea", { id, rows: this.getAttribute("rows") || 3 })
      : el("input", { id, type });
    if (this.hasAttribute("placeholder")) {
      input.setAttribute("placeholder", this.getAttribute("placeholder")!);
    }
    input.value = this.getAttribute("value") ?? "";
    input.disabled = this.disabled;
    input.readOnly = this.readonly;
    input.addEventListener("input", () => this.setAttribute("value", input.value));
    this.className = this.label ? "field-row-stacked" : "field-row";
    fill(this, this.label ? el("label", { for: id, text: this.label }) : null, input);
    this._bind(input);
  }

  update(): void {
    const input = this.input as HTMLInputElement | HTMLTextAreaElement | null;
    if (!input) return;
    if (input.value !== (this.getAttribute("value") ?? "")) {
      input.value = this.getAttribute("value") ?? "";
    }
    input.disabled = this.disabled;
    input.readOnly = this.readonly;
    this._value();
  }

  get value(): string { return this.input ? this.input.value : this.getAttribute("value") ?? ""; }
  set value(v: string) { this.setAttribute("value", v); }
}
AquaField.attr("label", "placeholder", "type", "rows").bool("disabled", "readonly");
define("aqua-field", AquaField);

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  selected?: boolean;
}

export class AquaSelect extends InputBase {
  static observedAttributes = ["label", "value", "disabled", "name"];

  declare label: string | null;
  declare disabled: boolean;

  private _options: SelectOption[] = [];

  protected _read(src: DocumentFragment): void { this._options = this._sourceOptions(src); }

  private _sourceOptions(src: DocumentFragment): SelectOption[] {
    return [...src.querySelectorAll("option")].map((o) => ({
      value: o.value, label: o.textContent ?? "", disabled: o.disabled,
      selected: o.selected || o.hasAttribute("selected"),
    }));
  }

  render(): void {
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
    fill(this, this.label ? el("label", { for: id, text: this.label }) : null,
         el("span", { class: "select-wrapper" }, sel));
    this._bind(sel);
    wire(this);           // aqua-ui turns this into a real popup menu
  }

  update(): void {
    if (!this.input) return;
    const v = this.getAttribute("value");
    if (v != null && this.input.value !== v) this.input.value = v;
    this.input.disabled = this.disabled;
    this._value();
  }

  get value(): string | null { return this.input ? this.input.value : this.getAttribute("value"); }
  set value(v: string) { this.setAttribute("value", v); }

  get options(): SelectOption[] { return this._options; }
  set options(list: (SelectOption | string)[]) {
    this._options = list.map((o) => typeof o === "string"
      ? { value: o, label: o } : o);
    this.render();
  }
}
AquaSelect.attr("label").bool("disabled");
define("aqua-select", AquaSelect);

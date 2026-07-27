import { Base } from "./base.js";
type NativeInput = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
export declare abstract class InputBase extends Base {
    static formAssociated: boolean;
    input: NativeInput | null;
    protected _internals: ElementInternals | null;
    constructor();
    protected _bind(input: NativeInput): void;
    protected _value(): void;
    formValue(): string | null;
    formResetCallback(): void;
    get form(): HTMLFormElement | null;
    focus(o?: FocusOptions): void;
    abstract get value(): unknown;
}
export declare class AquaField extends InputBase {
    static observedAttributes: string[];
    label: string | null;
    placeholder: string | null;
    type: string | null;
    rows: string | null;
    disabled: boolean;
    readonly: boolean;
    render(): void;
    update(): void;
    get value(): string;
    set value(v: string);
}
interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
    selected?: boolean;
}
export declare class AquaSelect extends InputBase {
    static observedAttributes: string[];
    label: string | null;
    disabled: boolean;
    private _options;
    protected _read(src: DocumentFragment): void;
    private _sourceOptions;
    render(): void;
    update(): void;
    get value(): string | null;
    set value(v: string);
    get options(): SelectOption[];
    set options(list: (SelectOption | string)[]);
}
export {};

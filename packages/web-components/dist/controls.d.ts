import { Base } from "./base.js";
import { InputBase } from "./inputs.js";
export declare class AquaButton extends Base {
    static observedAttributes: string[];
    pulsing: boolean;
    disabled: boolean;
    bevel: boolean;
    square: boolean;
    private _btn;
    render(): void;
    private _sync;
    update(): void;
    get button(): HTMLButtonElement | null;
    focus(o?: FocusOptions): void;
}
export declare class AquaSlider extends InputBase {
    static observedAttributes: string[];
    min: string | null;
    max: string | null;
    step: string | null;
    ticks: string | null;
    round: boolean;
    disabled: boolean;
    render(): void;
    update(): void;
    get value(): number;
    set value(v: number | string);
}
export declare class AquaStepper extends InputBase {
    static observedAttributes: string[];
    min: string | null;
    max: string | null;
    step: string | null;
    field: boolean;
    disabled: boolean;
    wrap: boolean;
    private _box;
    render(): void;
    private _nudge;
    update(): void;
    formValue(): string;
    get value(): number;
    set value(v: number | string);
}
export declare class AquaProgress extends Base {
    static observedAttributes: string[];
    private _p;
    render(): void;
    update(): void;
    get value(): number | null;
    set value(v: number | string | null);
}

import { Base } from "./base.js";
export declare class AquaButtonGroup extends Base {
    static formAssociated: boolean;
    static observedAttributes: string[];
    disabled: boolean;
    inactive: boolean;
    multiple: boolean;
    momentary: boolean;
    icons: boolean;
    private _internals;
    private _items;
    private _keyed;
    constructor();
    protected _read(src: DocumentFragment): void;
    render(): void;
    private _snap;
    protected _connected(): void;
    private _pick;
    private _sync;
    update(): void;
    get value(): string;
    set value(v: string);
    get values(): string[];
    set values(a: string | string[]);
}

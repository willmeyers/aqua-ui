import { Base } from "./base.js";
export declare class AquaSeparator extends Base {
    static observedAttributes: string[];
    vertical: boolean;
    render(): void;
    update(): void;
}
export declare class AquaDock extends Base {
    private _model;
    protected _read(src: DocumentFragment): void;
    render(): void;
}
export declare class AquaToolbar extends Base {
    static observedAttributes: string[];
    small: boolean;
    private _items;
    protected _read(src: DocumentFragment): void;
    render(): void;
    update(): void;
}

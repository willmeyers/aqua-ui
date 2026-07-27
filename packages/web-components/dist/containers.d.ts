import { Base } from "./base.js";
export declare class AquaTabs extends Base {
    static observedAttributes: string[];
    selected: string | null;
    private _tabs;
    private _strip;
    private _panel;
    protected _read(src: DocumentFragment): void;
    render(): void;
    private _pick;
    update(): void;
}
export declare class AquaGroupBox extends Base {
    static observedAttributes: string[];
    label: string | null;
    metal: boolean;
    render(): void;
    update(): void;
}
export declare class AquaTree extends Base {
    private _model;
    render(): void;
    protected _read(src: DocumentFragment): void;
    private _items;
    private _branch;
}
export declare class AquaTable extends Base {
    static observedAttributes: string[];
    sortable: boolean;
    selectable: boolean;
    multiple: boolean;
    private _table;
    render(): void;
    sort(col: number, dir: "ascending" | "descending"): void;
    get selection(): HTMLTableRowElement[];
}
export declare class AquaScroll extends Base {
    static observedAttributes: string[];
    arrows: string | null;
    render(): void;
    update(): void;
}

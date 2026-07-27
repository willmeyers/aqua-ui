export declare abstract class Base extends HTMLElement {
    protected _built: boolean;
    protected _source: string;
    protected _frag: DocumentFragment;
    protected _read?(src: DocumentFragment): void;
    protected _connected?(): void;
    update?(): void;
    abstract render(): void;
    connectedCallback(): void;
    attributeChangedCallback(): void;
    static bool<T extends typeof Base>(this: T, ...names: string[]): T;
    static attr<T extends typeof Base>(this: T, ...names: string[]): T;
    emit<T>(type: string, detail?: T, opts?: EventInit): boolean;
}
export declare const define: (name: string, cls: CustomElementConstructor) => void;

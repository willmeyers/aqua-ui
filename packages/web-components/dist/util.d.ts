export type Attrs = Record<string, string | number | boolean | null | undefined>;
export type Kid = Node | string | null | undefined;
export declare function el<K extends keyof HTMLElementTagNameMap>(tag: K, attrs?: Attrs | null, kids?: Kid | Kid[]): HTMLElementTagNameMap[K];
export declare function el(tag: string, attrs?: Attrs | null, kids?: Kid | Kid[]): HTMLElement;
export declare const nextId: (p: string) => string;
export declare const fill: (node: Element, ...kids: (Kid | Kid[])[]) => void;
export declare const wire: (root: Element | Document) => void;
export declare const num: (v: string | number | null | undefined, d: number) => number;

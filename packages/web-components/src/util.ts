
export type Attrs = Record<string, string | number | boolean | null | undefined>;
export type Kid = Node | string | null | undefined;

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K, attrs?: Attrs | null, kids?: Kid | Kid[],
): HTMLElementTagNameMap[K];
export function el(tag: string, attrs?: Attrs | null, kids?: Kid | Kid[]): HTMLElement;
export function el(tag: string, attrs?: Attrs | null, kids?: Kid | Kid[]): HTMLElement {
  const n = document.createElement(tag);
  for (const k in attrs || {}) {
    const v = (attrs as Attrs)[k];
    if (v === false || v == null) continue;
    if (k === "class") n.className = String(v);
    else if (k === "html") n.innerHTML = String(v);
    else if (k === "text") n.textContent = String(v);
    else n.setAttribute(k, v === true ? "" : String(v));
  }
  for (const c of ([] as Kid[]).concat(kids ?? [])) {
    if (c != null) n.append(c);
  }
  return n;
}

let uid = 0;
export const nextId = (p: string): string => `${p}-${++uid}`;

export const fill = (node: Element, ...kids: (Kid | Kid[])[]): void =>
  node.replaceChildren(...kids.flat().filter((k): k is Node | string => k != null));

export const wire = (root: Element | Document): void => {
  const aqua = (window as unknown as { Aqua?: { init?: (r: Element | Document) => void } }).Aqua;
  aqua?.init?.(root);
};

export const num = (v: string | number | null | undefined, d: number): number =>
  v === null || v === undefined || v === "" || isNaN(+v) ? d : +v;

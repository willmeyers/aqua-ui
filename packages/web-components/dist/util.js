export function el(tag, attrs, kids) {
    const n = document.createElement(tag);
    for (const k in attrs || {}) {
        const v = attrs[k];
        if (v === false || v == null)
            continue;
        if (k === "class")
            n.className = String(v);
        else if (k === "html")
            n.innerHTML = String(v);
        else if (k === "text")
            n.textContent = String(v);
        else
            n.setAttribute(k, v === true ? "" : String(v));
    }
    for (const c of [].concat(kids ?? [])) {
        if (c != null)
            n.append(c);
    }
    return n;
}
let uid = 0;
export const nextId = (p) => `${p}-${++uid}`;
export const fill = (node, ...kids) => node.replaceChildren(...kids.flat().filter((k) => k != null));
export const wire = (root) => {
    const aqua = window.Aqua;
    aqua?.init?.(root);
};
export const num = (v, d) => v === null || v === undefined || v === "" || isNaN(+v) ? d : +v;

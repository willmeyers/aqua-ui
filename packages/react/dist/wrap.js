import * as React from "react";
const PASS = new Set(["children", "className", "style", "id", "key", "ref"]);
const eventName = (prop) => prop.slice(2).toLowerCase();
export function wrap(tag) {
    const Component = React.forwardRef((props, outer) => {
        const inner = React.useRef(null);
        const ref = (node) => {
            inner.current = node;
            if (typeof outer === "function")
                outer(node);
            else if (outer)
                outer.current = node;
        };
        const dom = {};
        const fields = [];
        const handlers = [];
        for (const [k, v] of Object.entries(props)) {
            if (PASS.has(k) || k.startsWith("data-") || k.startsWith("aria-"))
                dom[k] = v;
            else if (/^on[A-Z]/.test(k))
                handlers.push([eventName(k), v]);
            else if (typeof v === "string")
                dom[k] = v; // strings go as attributes
            else
                fields.push([k, v]); // the rest as properties
        }
        React.useEffect(() => {
            const node = inner.current;
            if (!node)
                return;
            for (const [k, v] of fields) {
                node[k] = v;
            }
        });
        React.useEffect(() => {
            const node = inner.current;
            if (!node)
                return;
            const subs = handlers.map(([type, fn]) => {
                const h = fn;
                node.addEventListener(type, h);
                return () => node.removeEventListener(type, h);
            });
            return () => subs.forEach((off) => off());
        }, handlers.flat());
        return React.createElement(tag, { ...dom, ref });
    });
    Component.displayName = tag;
    return Component;
}

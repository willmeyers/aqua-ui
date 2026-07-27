export class Base extends HTMLElement {
    constructor() {
        super(...arguments);
        this._built = false;
        this._source = "";
        this._frag = document.createDocumentFragment();
    }
    connectedCallback() {
        if (this._built) {
            this._connected?.();
            return;
        }
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => {
                if (this.isConnected)
                    this.connectedCallback();
            }, { once: true });
            return;
        }
        this._source = this.innerHTML; // for text-only content
        this._frag = document.createDocumentFragment();
        this._frag.append(...this.childNodes); // moves, does not copy
        this._read?.(this._frag);
        this._built = true;
        this.render();
        this._connected?.();
    }
    attributeChangedCallback() {
        if (this._built)
            this.update ? this.update() : this.render();
    }
    static bool(...names) {
        for (const n of names) {
            Object.defineProperty(this.prototype, camel(n), {
                get() { return this.hasAttribute(n); },
                set(v) { this.toggleAttribute(n, !!v); },
            });
        }
        return this;
    }
    static attr(...names) {
        for (const n of names) {
            Object.defineProperty(this.prototype, camel(n), {
                get() { return this.getAttribute(n); },
                set(v) {
                    v == null ? this.removeAttribute(n) : this.setAttribute(n, String(v));
                },
            });
        }
        return this;
    }
    emit(type, detail, opts) {
        return this.dispatchEvent(new CustomEvent(type, {
            bubbles: true, composed: true, detail, ...opts,
        }));
    }
}
const camel = (n) => n.replace(/-(\w)/g, (_, c) => c.toUpperCase());
export const define = (name, cls) => {
    if (!customElements.get(name))
        customElements.define(name, cls);
};

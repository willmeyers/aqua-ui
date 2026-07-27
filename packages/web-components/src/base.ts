export abstract class Base extends HTMLElement {
  protected _built = false;
  protected _source = "";
  protected _frag: DocumentFragment = document.createDocumentFragment();

  protected _read?(src: DocumentFragment): void;
  protected _connected?(): void;
  update?(): void;
  abstract render(): void;

  connectedCallback(): void {
    if (this._built) { this._connected?.(); return; }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        if (this.isConnected) this.connectedCallback();
      }, { once: true });
      return;
    }
    this._source = this.innerHTML;                  // for text-only content
    this._frag = document.createDocumentFragment();
    this._frag.append(...this.childNodes);          // moves, does not copy
    this._read?.(this._frag);
    this._built = true;
    this.render();
    this._connected?.();
  }

  attributeChangedCallback(): void {
    if (this._built) this.update ? this.update() : this.render();
  }

  static bool<T extends typeof Base>(this: T, ...names: string[]): T {
    for (const n of names) {
      Object.defineProperty(this.prototype, camel(n), {
        get(this: HTMLElement) { return this.hasAttribute(n); },
        set(this: HTMLElement, v: unknown) { this.toggleAttribute(n, !!v); },
      });
    }
    return this;
  }

  static attr<T extends typeof Base>(this: T, ...names: string[]): T {
    for (const n of names) {
      Object.defineProperty(this.prototype, camel(n), {
        get(this: HTMLElement) { return this.getAttribute(n); },
        set(this: HTMLElement, v: unknown) {
          v == null ? this.removeAttribute(n) : this.setAttribute(n, String(v));
        },
      });
    }
    return this;
  }

  emit<T>(type: string, detail?: T, opts?: EventInit): boolean {
    return this.dispatchEvent(new CustomEvent(type, {
      bubbles: true, composed: true, detail, ...opts,
    }));
  }
}

const camel = (n: string): string => n.replace(/-(\w)/g, (_, c: string) => c.toUpperCase());

export const define = (name: string, cls: CustomElementConstructor): void => {
  if (!customElements.get(name)) customElements.define(name, cls);
};

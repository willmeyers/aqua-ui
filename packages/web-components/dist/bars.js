import { Base, define } from "./base.js";
import { el, fill } from "./util.js";
export class AquaSeparator extends Base {
    render() {
        this.style.display = "contents";
        fill(this, el("hr", {
            class: `separator${this.vertical ? " vertical" : ""}`,
        }));
    }
    update() {
        const hr = this.querySelector("hr");
        if (hr)
            hr.className = `separator${this.vertical ? " vertical" : ""}`;
    }
}
AquaSeparator.observedAttributes = ["vertical"];
AquaSeparator.bool("vertical");
define("aqua-separator", AquaSeparator);
define("aqua-dock-item", class extends HTMLElement {
});
export class AquaDock extends Base {
    constructor() {
        super(...arguments);
        this._model = [];
    }
    _read(src) {
        this._model = [...src.children]
            .filter((c) => c.tagName === "AQUA-DOCK-ITEM")
            .map((c) => ({
            label: c.getAttribute("label") || "",
            src: c.getAttribute("src"),
            running: c.hasAttribute("running"),
            divider: c.hasAttribute("divider"),
            trash: c.hasAttribute("trash"),
            value: c.getAttribute("value") || c.id || c.getAttribute("label"),
        }));
    }
    render() {
        this.className = "dock";
        fill(this, this._model.map((it) => {
            if (it.divider)
                return el("div", { class: "dock-divider" });
            const d = el("div", {
                class: `dock-item${it.running ? " running" : ""}`,
                "data-trash": it.trash || /^trash$/i.test(it.label || "") || null,
            }, [
                el("span", { class: "dock-label", text: it.label }),
                it.src ? el("img", { src: it.src, alt: it.label }) : null,
            ]);
            d.addEventListener("click", () => this.emit("launch", { value: it.value }));
            return d;
        }));
    }
}
define("aqua-dock", AquaDock);
define("aqua-toolbar-item", class extends HTMLElement {
});
export class AquaToolbar extends Base {
    constructor() {
        super(...arguments);
        this._items = [];
    }
    _read(src) {
        this._items = [...src.children]
            .filter((c) => c.tagName === "AQUA-TOOLBAR-ITEM")
            .map((c) => ({
            label: c.getAttribute("label") ?? c.textContent.trim(),
            src: c.getAttribute("src"),
            value: c.getAttribute("value") || c.id || c.getAttribute("label"),
            divider: c.hasAttribute("divider"),
            spacer: c.hasAttribute("spacer"),
            disabled: c.hasAttribute("disabled"),
            html: c.innerHTML.trim(),
        }));
    }
    render() {
        this.className = `toolbar${this.small ? " small" : ""}`;
        fill(this, this._items.map((it) => {
            if (it.divider)
                return el("i", { class: "toolbar-divider" });
            if (it.spacer)
                return el("i", { class: "spacer" });
            const b = el("button", {
                class: "toolbar-item", type: "button", value: it.value,
                disabled: it.disabled,
            });
            if (it.src)
                b.append(el("img", { src: it.src, alt: "" }));
            else if (it.html)
                b.append(el("span", { class: "toolbar-icon", html: it.html }));
            if (it.label)
                b.append(el("span", { text: it.label }));
            b.addEventListener("click", () => this.emit("command", { value: it.value }));
            return b;
        }));
    }
    update() { this.classList.toggle("small", this.small); }
}
AquaToolbar.observedAttributes = ["small"];
AquaToolbar.bool("small");
define("aqua-toolbar", AquaToolbar);

const LAYER_CLASS = "aqua-menu-layer";
const SUBMENU_DELAY = 220; // Aqua opened submenus on a dwell, not instantly
function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls)
        n.className = cls;
    if (text != null)
        n.textContent = text;
    return n;
}
function layer() {
    let l = document.querySelector("." + LAYER_CLASS);
    if (!l) {
        l = el("div", LAYER_CLASS);
        document.body.appendChild(l);
    }
    return l;
}
function isItem(li) {
    return !!li && li.tagName === "LI" &&
        !li.classList.contains("separator") &&
        li.getAttribute("aria-disabled") !== "true";
}
function items(menu) {
    return [...menu.children].filter(isItem);
}
function place(menu, x, y, opts = {}) {
    menu.style.left = "0px";
    menu.style.top = "0px";
    const w = menu.offsetWidth, h = menu.offsetHeight;
    const vw = window.innerWidth, vh = window.innerHeight;
    if (opts.flipX != null && x + w > vw - 4)
        x = Math.max(4, opts.flipX - w);
    else if (x + w > vw - 4)
        x = Math.max(4, vw - w - 4);
    if (y + h > vh - 4)
        y = Math.max(4, vh - h - 4);
    menu.style.left = Math.round(x) + "px";
    menu.style.top = Math.round(y) + "px";
}
const openStack = []; // innermost last
let barOpen = null; // the menu-bar title currently pulled down
const typeahead = { buf: "", at: 0 };
function closeFrom(depth) {
    while (openStack.length > depth) {
        const f = openStack.pop();
        if (f.parentItem)
            f.parentItem.removeAttribute("aria-expanded");
        f.menu.remove();
        f.onClose?.();
    }
}
export function closeMenus() {
    closeFrom(0);
    if (barOpen) {
        barOpen.removeAttribute("aria-expanded");
        barOpen = null;
    }
    document.removeEventListener("keydown", onKey, true);
}
function buildMenu(src) {
    let ul;
    if (Array.isArray(src)) {
        ul = el("ul", "menu");
        src.forEach((it) => {
            const li = el("li");
            if (it === "-" || it.separator) {
                li.className = "separator";
                ul.appendChild(li);
                return;
            }
            li.appendChild(el("span", "label", it.label));
            if (it.shortcut)
                li.appendChild(el("span", "shortcut", it.shortcut));
            if (it.disabled)
                li.setAttribute("aria-disabled", "true");
            if (it.checked)
                li.setAttribute("aria-checked", "true");
            if (it.id)
                li.dataset.id = it.id;
            if (it.items) {
                li.setAttribute("aria-haspopup", "true");
                li._items = it.items;
            }
            ul.appendChild(li);
        });
    }
    else {
        ul = src.cloneNode(true);
        for (const li of [...ul.children]) {
            const sub = li.querySelector(":scope > ul.menu");
            if (sub) {
                li.setAttribute("aria-haspopup", "true");
                li._items = sub;
                sub.remove();
            }
            if (!li.querySelector(":scope > .label") && !li.classList.contains("separator")) {
                const t = li.textContent.trim();
                li.textContent = "";
                li.appendChild(el("span", "label", t));
            }
        }
    }
    ul.removeAttribute("hidden");
    ul.style.display = "";
    ul.setAttribute("role", "menu");
    ul.dataset.floating = "";
    for (const li of [...ul.children]) {
        li.setAttribute("role", li.classList.contains("separator") ? "separator" : "menuitem");
    }
    return ul;
}
function openMenu(src, x, y, opts = {}) {
    const ul = buildMenu(src);
    if (opts.detached)
        ul.dataset.detached = "";
    layer().appendChild(ul);
    place(ul, x, y, opts);
    const frame = { menu: ul, parentItem: opts.parentItem || null,
        resolve: opts.resolve || null, onClose: opts.onClose || null };
    openStack.push(frame);
    wireMenu(ul, openStack.length - 1);
    document.addEventListener("keydown", onKey, true);
    return ul;
}
let submenuTimer = 0;
function wireMenu(ul, depth) {
    ul.addEventListener("mousemove", (e) => {
        const li = e.target.closest("li");
        if (!li || li.parentElement !== ul)
            return;
        setActive(ul, isItem(li) ? li : null);
        clearTimeout(submenuTimer);
        if (openStack.length > depth + 1 &&
            openStack[depth + 1].parentItem !== li) {
            submenuTimer = window.setTimeout(() => { closeFrom(depth + 1); }, SUBMENU_DELAY / 2);
        }
        if (isItem(li) && li._items && openStack.length <= depth + 1) {
            submenuTimer = window.setTimeout(() => { openSub(li, depth); }, SUBMENU_DELAY);
        }
    });
    ul.addEventListener("mouseleave", () => {
        clearTimeout(submenuTimer);
        if (openStack.length <= depth + 1)
            setActive(ul, null);
    });
    ul.addEventListener("click", (e) => {
        const li = e.target.closest("li");
        if (!li || li.parentElement !== ul || !isItem(li))
            return;
        e.stopPropagation();
        if (li._items) {
            clearTimeout(submenuTimer);
            openSub(li, depth);
            return;
        }
        choose(li);
    });
}
function openSub(li, depth) {
    if (openStack.length > depth + 1 && openStack[depth + 1].parentItem === li)
        return;
    closeFrom(depth + 1);
    li.setAttribute("aria-expanded", "true");
    const r = li.getBoundingClientRect();
    openMenu(li._items, r.right - 2, r.top - 5, { parentItem: li, detached: true, flipX: r.left + 2 });
}
function setActive(ul, li) {
    for (const c of [...ul.children]) {
        if (c === li)
            c.setAttribute("data-active", "");
        else
            c.removeAttribute("data-active");
    }
}
const activeIn = (ul) => ul.querySelector(":scope > li[data-active]");
function choose(li) {
    const detail = {
        id: li.dataset.id || null,
        label: (li.querySelector(".label") || li).textContent.trim(),
        item: li,
    };
    let resolver = null;
    for (let i = openStack.length - 1; i >= 0; i--) {
        if (openStack[i].resolve) {
            resolver = openStack[i].resolve;
            break;
        }
    }
    closeMenus();
    document.dispatchEvent(new CustomEvent("aqua:menuselect", { detail }));
    if (resolver)
        resolver(detail);
}
function onKey(e) {
    if (!openStack.length)
        return;
    const top = openStack[openStack.length - 1];
    const ul = top.menu;
    const list = items(ul);
    const cur = activeIn(ul);
    const i = cur ? list.indexOf(cur) : -1;
    switch (e.key) {
        case "Escape":
            e.preventDefault();
            e.stopPropagation();
            if (openStack.length > 1)
                closeFrom(openStack.length - 1);
            else
                closeMenus();
            return;
        case "ArrowDown":
            e.preventDefault();
            e.stopPropagation();
            setActive(ul, list[(i + 1 + list.length) % list.length] || list[0]);
            return;
        case "ArrowUp":
            e.preventDefault();
            e.stopPropagation();
            setActive(ul, list[(i - 1 + list.length) % list.length] || list[list.length - 1]);
            return;
        case "Home":
            e.preventDefault();
            setActive(ul, list[0]);
            return;
        case "End":
            e.preventDefault();
            setActive(ul, list[list.length - 1]);
            return;
        case "ArrowRight": {
            e.preventDefault();
            e.stopPropagation();
            if (cur && cur._items) {
                openSub(cur, openStack.length - 1);
                const sub = openStack[openStack.length - 1].menu;
                setActive(sub, items(sub)[0]);
            }
            else if (barOpen) {
                stepBar(1);
            }
            return;
        }
        case "ArrowLeft":
            e.preventDefault();
            e.stopPropagation();
            if (openStack.length > 1)
                closeFrom(openStack.length - 1);
            else if (barOpen)
                stepBar(-1);
            return;
        case "Enter":
        case " ":
            e.preventDefault();
            e.stopPropagation();
            if (cur) {
                if (cur._items)
                    openSub(cur, openStack.length - 1);
                else
                    choose(cur);
            }
            return;
    }
    if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const now = Date.now();
        typeahead.buf = (now - typeahead.at < 800) ? typeahead.buf + e.key : e.key;
        typeahead.at = now;
        const q = typeahead.buf.toLowerCase();
        const start = (i + (typeahead.buf.length > 1 ? 0 : 1)) % (list.length || 1);
        for (let k = 0; k < list.length; k++) {
            const cand = list[(start + k) % list.length];
            const lab = (cand.querySelector(".label") || cand).textContent.trim().toLowerCase();
            if (lab.indexOf(q) === 0) {
                setActive(ul, cand);
                e.preventDefault();
                return;
            }
        }
    }
}
const barTitles = [];
function stepBar(dir) {
    const idx = barOpen ? barTitles.indexOf(barOpen) : -1;
    if (idx < 0)
        return;
    const next = barTitles[(idx + dir + barTitles.length) % barTitles.length];
    pullDown(next, true);
}
function pullDown(title, focusFirst) {
    closeFrom(0);
    if (barOpen)
        barOpen.removeAttribute("aria-expanded");
    barOpen = title;
    title.setAttribute("aria-expanded", "true");
    const src = document.querySelector(title.dataset.menu);
    if (!src)
        return;
    const r = title.getBoundingClientRect();
    const ul = openMenu(src, r.left, r.bottom, { onClose: () => { } });
    if (focusFirst)
        setActive(ul, items(ul)[0]);
}
function wireMenuBar(root) {
    const titles = [...root.querySelectorAll("[data-menu]")];
    if (!titles.length)
        return;
    titles.forEach((t) => {
        if (t.dataset.aquaMenubar === "on")
            return;
        t.dataset.aquaMenubar = "on";
        if (barTitles.indexOf(t) < 0)
            barTitles.push(t);
        t.setAttribute("role", "menuitem");
        t.setAttribute("aria-haspopup", "true");
        t.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (barOpen === t)
                closeMenus();
            else
                pullDown(t);
        });
        t.addEventListener("mouseenter", () => {
            if (barOpen && barOpen !== t)
                pullDown(t);
        });
    });
}
function wirePopup(sel) {
    if (sel.dataset.aquaPopup === "on" || sel.hasAttribute("data-no-popup"))
        return;
    sel.dataset.aquaPopup = "on";
    sel.addEventListener("mousedown", (e) => {
        if (sel.disabled)
            return;
        e.preventDefault();
        const list = [...sel.options].map((o, i) => ({
            label: o.textContent ?? "", id: String(i),
            disabled: o.disabled, checked: i === sel.selectedIndex,
        }));
        const r = sel.getBoundingClientRect();
        const ul = buildMenu(list);
        ul.dataset.detached = "";
        ul.style.minWidth = Math.max(r.width, 60) + "px";
        layer().appendChild(ul);
        const rows = items(ul);
        const selRow = rows[sel.selectedIndex] || rows[0];
        place(ul, r.left - 1, r.top, {});
        if (selRow) {
            const want = r.top + (r.height - selRow.offsetHeight) / 2;
            const got = selRow.getBoundingClientRect().top;
            place(ul, r.left - 1, ul.getBoundingClientRect().top + (want - got), {});
        }
        const frame = { menu: ul, parentItem: null, resolve: (d) => {
                if (d && d.id != null) {
                    sel.selectedIndex = parseInt(d.id, 10);
                    sel.dispatchEvent(new Event("input", { bubbles: true }));
                    sel.dispatchEvent(new Event("change", { bubbles: true }));
                }
            } };
        openStack.push(frame);
        wireMenu(ul, openStack.length - 1);
        document.addEventListener("keydown", onKey, true);
        if (selRow)
            setActive(ul, selRow);
    });
    sel.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            sel.dispatchEvent(new MouseEvent("mousedown"));
        }
    });
}
function alertBody(o) {
    const wrap = el("div", "aqua-alert");
    if (o.icon !== false) {
        const ic = el("div", "icon");
        const img = document.createElement("img");
        img.src = o.icon || "";
        img.alt = "";
        if (o.icon)
            ic.appendChild(img);
        wrap.appendChild(ic);
    }
    const body = el("div", "body");
    if (o.message)
        body.appendChild(el("p", "message", o.message));
    if (o.informative)
        body.appendChild(el("p", "informative", o.informative));
    const row = el("div", "buttons");
    const btns = (o.buttons && o.buttons.length)
        ? o.buttons : [{ id: "ok", label: "OK", def: true }];
    btns.forEach((b) => {
        if (b === "-") {
            row.appendChild(el("span", "spacer"));
            return;
        }
        const isDefault = b.def || b.default;
        const btn = el("button", isDefault ? "default pulsing" : "", b.label);
        btn.dataset.id = b.id || b.label;
        if (b.cancel)
            btn.dataset.cancel = "";
        row.appendChild(btn);
    });
    body.appendChild(row);
    wrap.appendChild(body);
    return { wrap, row };
}
function wireButtons(container, done) {
    container.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (b && container.contains(b))
            done(b.dataset.id ?? null);
    });
    container.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const d = container.querySelector("button.default");
            if (d) {
                e.preventDefault();
                done(d.dataset.id ?? null);
            }
        }
        else if (e.key === "Escape") {
            e.preventDefault();
            const c = container.querySelector("button[data-cancel]")
                || container.querySelector("button");
            done(c ? c.dataset.id ?? null : null);
        }
    });
}
export function alert(o = {}) {
    return new Promise((resolve) => {
        const dlg = el("dialog", "aqua-dialog");
        const win = el("div", "window");
        if (o.title) {
            const tb = el("div", "title-bar");
            tb.appendChild(el("div", "title-bar-text", o.title));
            win.appendChild(tb);
        }
        const wb = el("div", "window-body");
        wb.style.padding = "0";
        wb.appendChild(alertBody(o).wrap);
        win.appendChild(wb);
        dlg.appendChild(win);
        dlg.classList.add("aqua");
        document.body.appendChild(dlg);
        const done = (id) => {
            if (!dlg.open)
                return;
            dlg.close();
            dlg.remove();
            resolve(id);
        };
        wireButtons(dlg, done);
        dlg.addEventListener("cancel", (e) => { e.preventDefault(); });
        dlg.showModal();
        const d = dlg.querySelector("button.default")
            || dlg.querySelector("button");
        if (d)
            d.focus();
    });
}
export function sheet(win, o = {}) {
    return new Promise((resolve) => {
        const host = el("div", "aqua-sheet-host");
        const panel = el("div", "aqua-sheet");
        panel.appendChild(alertBody(o).wrap);
        host.appendChild(panel);
        const tb = win.querySelector(".title-bar");
        host.style.top = (tb ? tb.offsetHeight : 0) + "px";
        win.appendChild(host);
        void panel.getBoundingClientRect().top;
        host.dataset.open = "";
        const done = (id) => {
            host.removeAttribute("data-open");
            let settled = false;
            const fin = () => {
                if (settled)
                    return;
                settled = true;
                host.remove();
                resolve(id);
            };
            if (matchMedia("(prefers-reduced-motion: reduce)").matches)
                return fin();
            panel.addEventListener("transitionend", fin, { once: true });
            setTimeout(fin, 600);
        };
        wireButtons(host, done);
        host.tabIndex = -1;
        const d = host.querySelector("button.default")
            || host.querySelector("button");
        if (d)
            setTimeout(() => d.focus(), 0);
    });
}
export function contextMenu(list, x, y) {
    return new Promise((resolve) => {
        closeMenus();
        openMenu(list, x, y, { detached: true, resolve });
    });
}
export function init(root = document) {
    wireMenuBar(root);
    root.querySelectorAll(".aqua select, select.aqua").forEach(wirePopup);
}
document.addEventListener("mousedown", (e) => {
    if (!openStack.length)
        return;
    const t = e.target;
    if (t.closest("." + LAYER_CLASS))
        return;
    if (t.closest("[data-menu]"))
        return;
    closeMenus();
}, true);
window.addEventListener("blur", closeMenus);
window.addEventListener("resize", closeMenus);
export const Aqua = {
    init, alert, sheet, menu: contextMenu, closeMenus,
};
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => init());
}
else {
    init();
}

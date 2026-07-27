import { Base, define } from "./base.js";
import { el, fill, wire } from "./util.js";

define("aqua-tab", class extends HTMLElement {});

interface Tab {
  label: string;
  value: string;
  disabled: boolean;
  node: HTMLElement;
  selected: boolean;
}

export class AquaTabs extends Base {
  static observedAttributes = ["selected"];

  declare selected: string | null;

  private _tabs: Tab[] = [];
  private _strip: HTMLElement | null = null;
  private _panel: HTMLElement | null = null;

  protected _read(src: DocumentFragment): void {
    this._tabs = ([...src.children] as HTMLElement[])
      .filter((c) => c.tagName === "AQUA-TAB")
      .map((t, i) => ({
        label: t.getAttribute("label") || `Tab ${i + 1}`,
        value: t.getAttribute("value") || t.getAttribute("label") || String(i),
        disabled: t.hasAttribute("disabled"),
        node: t,
        selected: t.hasAttribute("selected"),
      }));
    if (!this.hasAttribute("selected")) {
      const s = this._tabs.find((t) => t.selected) || this._tabs[0];
      if (s) this.setAttribute("selected", s.value);
    }
  }

  render(): void {
    const strip = el("div", { class: "tabs", role: "tablist" });
    this._panel = el("div", { class: "tab-panel", role: "tabpanel" });
    this._tabs.forEach((t) => {
      const b = el("button", {
        type: "button", role: "tab", text: t.label, disabled: t.disabled,
        "aria-selected": String(t.value === this.selected),
      });
      b.addEventListener("click", () => this._pick(t.value));
      b.addEventListener("keydown", (e: KeyboardEvent) => {
        const i = this._tabs.indexOf(t);
        let n = i;
        if (e.key === "ArrowLeft") n = i - 1;
        else if (e.key === "ArrowRight") n = i + 1;
        else if (e.key === "Home") n = 0;
        else if (e.key === "End") n = this._tabs.length - 1;
        else return;
        e.preventDefault();
        n = (n + this._tabs.length) % this._tabs.length;
        this._pick(this._tabs[n].value);
        (strip.children[n] as HTMLElement).focus();
      });
      strip.append(b);
    });
    this._strip = strip;
    this.style.display = this.style.display || "block";
    this._panel.append(...this._tabs.map((t) => t.node));
    fill(this, strip, this._panel);
    this.update();
  }

  private _pick(v: string): void {
    if (v === this.selected) return;
    this.selected = v;
    this.emit("change", { value: v });
  }

  update(): void {
    if (!this._strip) return;
    this._tabs.forEach((t, i) => this._strip!.children[i]
      .setAttribute("aria-selected", String(t.value === this.selected)));
    for (const t of this._tabs) {
      const on = t.value === this.selected;
      t.node.hidden = !on;
      t.node.style.display = on ? "block" : "none";
    }
    if (this._panel) wire(this._panel);
  }
}
AquaTabs.attr("selected");
define("aqua-tabs", AquaTabs);

export class AquaGroupBox extends Base {
  static observedAttributes = ["label", "metal"];

  declare label: string | null;
  declare metal: boolean;

  render(): void {
    const fs = el("fieldset", { class: this.metal ? "metal" : null }, [
      this.label ? el("legend", { text: this.label }) : null,
    ]);
    fs.append(this._frag);
    this.style.display = this.style.display || "block";
    fill(this, fs);
    wire(this);
  }

  update(): void {
    const fs = this.querySelector("fieldset");
    if (!fs) return;
    fs.classList.toggle("metal", this.metal);
    const lg = fs.querySelector("legend");
    if (lg) lg.textContent = this.label || "";
  }
}
AquaGroupBox.attr("label").bool("metal");
define("aqua-group-box", AquaGroupBox);

define("aqua-tree-item", class extends HTMLElement {});

interface TreeNode {
  label: string;
  value: string | null;
  open: boolean;
  kids: TreeNode[];
}

export class AquaTree extends Base {
  private _model: TreeNode[] = [];

  render(): void {
    this.className = "tree-view";
    fill(this, this._branch(this._model));
    wire(this);
  }

  protected _read(src: DocumentFragment): void { this._model = this._items(src); }

  private _items(root: ParentNode): TreeNode[] {
    return ([...root.children] as HTMLElement[])
      .filter((c) => c.tagName === "AQUA-TREE-ITEM")
      .map((c) => ({
        label: c.getAttribute("label") ?? c.childNodes[0]?.textContent?.trim() ?? "",
        value: c.getAttribute("value"),
        open: c.hasAttribute("open"),
        kids: this._items(c),
      }));
  }

  private _branch(items: TreeNode[]): HTMLElement[] {
    return items.map((it) => {
      if (!it.kids.length) {
        const leaf = el("div", { class: "leaf", text: it.label });
        leaf.addEventListener("click", () =>
          this.emit("select", { value: it.value ?? it.label }));
        return leaf;
      }
      return el("details", { open: it.open }, [
        el("summary", { text: it.label }),
        el("ul", null, this._branch(it.kids).map((n) =>
          n.tagName === "LI" ? n : el("li", null, n))),
      ]);
    });
  }
}
define("aqua-tree", AquaTree);

export class AquaTable extends Base {
  static observedAttributes = ["sortable", "selectable", "multiple"];

  declare sortable: boolean;
  declare selectable: boolean;
  declare multiple: boolean;

  private _table: HTMLTableElement | null = null;

  render(): void {
    this.style.display = this.style.display || "block";
    this.append(this._frag);
    const table = this.querySelector("table");
    if (!table) return;
    this._table = table;
    if (this.sortable) {
      table.querySelectorAll<HTMLTableCellElement>("thead th").forEach((th, i) => {
        th.tabIndex = 0;
        const go = (): void => this.sort(i,
          th.getAttribute("aria-sort") === "ascending" ? "descending" : "ascending");
        th.addEventListener("click", go);
        th.addEventListener("keydown", (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
        });
      });
    }
    if (this.selectable) {
      table.addEventListener("click", (e) => {
        const tr = (e.target as Element).closest("tbody tr");
        if (!tr) return;
        const add = this.multiple && (e.metaKey || e.ctrlKey || e.shiftKey);
        if (!add) {
          for (const r of table.querySelectorAll("tbody tr")) {
            r.removeAttribute("aria-selected");
          }
        }
        tr.setAttribute("aria-selected",
          add && tr.getAttribute("aria-selected") === "true" ? "false" : "true");
        this.emit("select", { rows: this.selection });
      });
    }
  }

  sort(col: number, dir: "ascending" | "descending"): void {
    const t = this._table;
    if (!t) return;
    const body = t.tBodies[0];
    const rows = [...body.rows];
    const key = (r: HTMLTableRowElement): string => (r.cells[col]?.textContent ?? "").trim();
    const nums = rows.every((r) => key(r) === "" || !isNaN(parseFloat(key(r))));
    rows.sort((a, b) => {
      const x = key(a), y = key(b);
      const c = nums ? parseFloat(x) - parseFloat(y)
        : x.localeCompare(y, undefined, { numeric: true });
      return dir === "descending" ? -c : c;
    });
    body.append(...rows);
    t.querySelectorAll("thead th").forEach((th, i) =>
      i === col ? th.setAttribute("aria-sort", dir) : th.removeAttribute("aria-sort"));
    this.emit("sort", { column: col, direction: dir });
  }

  get selection(): HTMLTableRowElement[] {
    return [...(this._table?.querySelectorAll<HTMLTableRowElement>(
      'tbody tr[aria-selected="true"]') ?? [])];
  }
}
AquaTable.bool("sortable", "selectable", "multiple");
define("aqua-table", AquaTable);

export class AquaScroll extends Base {
  static observedAttributes = ["arrows"];

  declare arrows: string | null;

  render(): void {
    this.style.display = this.style.display || "block";
    this.style.overflow = this.style.overflow || "auto";
    this.append(this._frag);
    this.update();
    wire(this);
  }

  update(): void {
    const mode = (this.arrows || "ends").toLowerCase();
    for (const m of ["ends", "together", "none"]) {
      this.classList.toggle(`scroll-arrows-${m}`, m === mode);
    }
  }
}
AquaScroll.attr("arrows");
define("aqua-scroll", AquaScroll);

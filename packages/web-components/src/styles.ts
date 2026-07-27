import { AQUA_CSS } from "./css.js";

export { AQUA_CSS } from "./css.js";

export function injectStyles(doc: Document = document): void {
  if (doc.querySelector('style[data-aqua-css], link[href*="aqua.css"]')) return;
  const s = doc.createElement("style");
  s.setAttribute("data-aqua-css", "");
  s.textContent = AQUA_CSS;
  (doc.head || doc.documentElement).appendChild(s);
}

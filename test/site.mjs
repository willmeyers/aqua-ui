import http from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { join, extname, normalize } from "node:path";
import { chromium } from "playwright";

const ROOT = new URL("..", import.meta.url).pathname;
const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".png": "image/png", ".jpg": "image/jpeg", ".txt": "text/plain",
};

const server = http.createServer((req, res) => {
  const path = normalize(decodeURIComponent(req.url.split("?")[0]));
  const file = join(ROOT, path);
  if (!file.startsWith(ROOT) || !existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "Content-Type": MIME[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

const fail = (m) => { console.error("FAIL:", m); process.exit(1); };
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

await page.goto(`${base}/website/index.html?boot=0`, { waitUntil: "networkidle" });
if (!(await page.evaluate(() => !!customElements.get("aqua-button")))) {
  fail("desktop: custom elements did not register");
}
const brokenDesktop = await page.$$eval("img", (imgs) =>
  imgs.filter((i) => i.complete && !i.naturalWidth).map((i) => i.getAttribute("src")));
if (brokenDesktop.length) fail(`desktop: broken images ${brokenDesktop.join(", ")}`);

await page.goto(`${base}/website/components.html`, { waitUntil: "networkidle" });
const sections = await page.$$eval("section.sec", (s) => s.length);
if (sections < 10) fail(`docs: expected 10 sections, got ${sections}`);
await page.waitForSelector("#icon-grid .icon-cell", { timeout: 5000 })
  .catch(() => fail("docs: icon gallery did not populate"));
const segs = await page.$$eval("#pm button", (b) => b.length);
if (segs !== 3) fail(`docs: package-manager picker has ${segs} segments`);

if (errors.length) fail(`page errors: ${errors.join(" | ")}`);
console.log("site smoke: all assertions passed");
await browser.close();
server.close();
process.exit(0);

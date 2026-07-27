const BASE = 40; // resting icon size, px (matches .dock-item width in CSS)
const MAX = 78; // size of the icon directly under the cursor, px
const SIGMA = 58; // spread of the magnification, px (~1.5 icons each side)
export function setupDock(dock) {
    if (dock.dataset.aquaMagnify === "on")
        return;
    if (matchMedia("(pointer: coarse)").matches)
        return;
    dock.dataset.aquaMagnify = "on";
    const items = [...dock.querySelectorAll(".dock-item")];
    if (!items.length)
        return;
    let centres = [];
    function measure() {
        const d = dock.getBoundingClientRect();
        centres = items.map((it) => {
            const r = it.getBoundingClientRect();
            return r.left - d.left + r.width / 2;
        });
    }
    const K = MAX / BASE - 1;
    const DEN = 2 * SIGMA * SIGMA;
    let dockLeft = 0;
    function apply(x) {
        for (let i = 0; i < items.length; i++) {
            const dist = x - centres[i];
            const scale = 1 + K * Math.exp(-(dist * dist) / DEN);
            items[i].style.width = (BASE * scale).toFixed(1) + "px";
        }
    }
    let pendingX = null, frame = 0;
    function onMove(e) {
        pendingX = e.clientX - dockLeft;
        if (!frame)
            frame = requestAnimationFrame(tick);
    }
    function tick() {
        frame = 0;
        if (pendingX != null)
            apply(pendingX);
    }
    function enter() {
        measure();
        dockLeft = dock.getBoundingClientRect().left;
        dock.classList.add("magnifying"); // CSS drops the width transition
    }
    function leave() {
        if (frame) {
            cancelAnimationFrame(frame);
            frame = 0;
        }
        pendingX = null;
        dock.classList.remove("magnifying"); // eased return to rest
        for (const it of items)
            it.style.width = BASE + "px";
    }
    dock.addEventListener("mouseenter", enter);
    dock.addEventListener("mousemove", onMove);
    dock.addEventListener("mouseleave", leave);
    window.addEventListener("resize", () => { leave(); measure(); });
    for (const it of items) {
        it.addEventListener("click", () => {
            it.classList.remove("bounce");
            void it.offsetWidth; // restart the animation
            it.classList.add("bounce");
            it.addEventListener("animationend", () => it.classList.remove("bounce"), { once: true });
        });
    }
    measure();
}
export function initDocks(root = document) {
    root.querySelectorAll(".dock").forEach(setupDock);
}

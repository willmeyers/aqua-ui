export function initClocks(root = document) {
    const fresh = [...root.querySelectorAll(".aqua-clock")]
        .filter((c) => c.dataset.aquaClock !== "on");
    fresh.forEach((c) => { c.dataset.aquaClock = "on"; });
    const clocks = fresh.map((c) => ({
        hour: c.querySelector(".hand.hour"),
        minute: c.querySelector(".hand.minute"),
    }));
    if (!clocks.length)
        return;
    function tick() {
        const now = new Date();
        const m = now.getMinutes();
        const h = now.getHours() % 12;
        const minDeg = m * 6; // 360 / 60
        const hourDeg = h * 30 + m * 0.5; // 360 / 12, plus minute fraction
        for (const c of clocks) {
            c.hour?.style.setProperty("--a", hourDeg + "deg");
            c.minute?.style.setProperty("--a", minDeg + "deg");
        }
    }
    tick();
    const now = new Date();
    setTimeout(() => {
        tick();
        setInterval(tick, 60000);
    }, (60 - now.getSeconds()) * 1000 - now.getMilliseconds());
}

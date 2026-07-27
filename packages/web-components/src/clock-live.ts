
interface ClockHands {
  hour: HTMLElement | null;
  minute: HTMLElement | null;
}

export function initClocks(root: Element | Document = document): void {
  const fresh = [...root.querySelectorAll<HTMLElement>(".aqua-clock")]
    .filter((c) => c.dataset.aquaClock !== "on");
  fresh.forEach((c) => { c.dataset.aquaClock = "on"; });
  const clocks: ClockHands[] = fresh.map((c) => ({
    hour: c.querySelector<HTMLElement>(".hand.hour"),
    minute: c.querySelector<HTMLElement>(".hand.minute"),
  }));
  if (!clocks.length) return;

  function tick(): void {
    const now = new Date();
    const m = now.getMinutes();
    const h = now.getHours() % 12;
    const minDeg = m * 6;                 // 360 / 60
    const hourDeg = h * 30 + m * 0.5;     // 360 / 12, plus minute fraction
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

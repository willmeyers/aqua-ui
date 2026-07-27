(function (global) {
  "use strict";

  const params = new URLSearchParams(location.search);
  if (params.get("boot") === "0") return;
  const DURATION = params.get("boot") === "slow" ? 6000 : 700;

  const boot = document.createElement("div");
  boot.className = "boot aqua";
  boot.innerHTML =
    '<div class="boot-panel">' +
      '<img class="boot-mark" src="assets/logo-128.png" alt="">' +
      '<div class="boot-word">Aqua UI</div>' +
      '<aqua-progress class="boot-bar" value="0" max="100"></aqua-progress>' +
    '</div>';
  document.body.appendChild(boot);
  document.documentElement.classList.add("booting");

  const bar = boot.querySelector(".boot-bar");
  let done = false;

  function finish() {
    if (done) return;
    done = true;
    boot.classList.add("out");
    document.documentElement.classList.remove("booting");
    boot.addEventListener("transitionend", () => boot.remove(), { once: true });
    setTimeout(() => boot.remove(), 1200);           // in case the tab is hidden
  }

  const ease = (t) => t * t * (3 - 2 * t);
  const t0 = performance.now();
  (function frame() {
    if (done) return;
    const p = Math.min(1, (performance.now() - t0) / DURATION);
    bar.setAttribute("value", (100 * ease(p)).toFixed(1));
    if (p >= 1) { setTimeout(finish, 180); return; }
    requestAnimationFrame(frame);
  })();
  setTimeout(finish, DURATION + 1500);

  global.replayBoot = () => location.reload();

  addEventListener("keydown", finish, { once: true });
  boot.addEventListener("click", finish);
})(window);

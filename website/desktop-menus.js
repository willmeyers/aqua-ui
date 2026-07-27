(function () {
  "use strict";

  const desk = document.querySelector(".desktop");
  const wins = () => Array.from(document.querySelectorAll(".win"));
  const front = () =>
    wins().sort((a, b) => (+b.style.zIndex || 0) - (+a.style.zIndex || 0))[0];

  const sub = document.getElementById("m-components");
  if (sub && window.AquaUI && window.AquaUI.components) {
    window.AquaUI.components().forEach((c) => {
      const li = document.createElement("li");
      li.dataset.id = "open:" + c.id;
      const lab = document.createElement("span");
      lab.className = "label";
      lab.textContent = c.title;
      li.appendChild(lab);
      sub.appendChild(li);
    });
  }

  const ICON = "icons/Finder.png";

  const ACTIONS = {
    launcher: () => AquaUI.openDocumentation(),

    closewin() {
      const w = front();
      if (w) w.querySelector('[aria-label="Close"]').click();
    },

    closeall() {
      wins().forEach((w) => w.querySelector('[aria-label="Close"]').click());
    },

    minall() {
      wins().forEach((w) => w.classList.add("inactive"));
    },

    cascade() {
      wins().forEach((w, i) => {
        w.style.left = 120 + i * 26 + "px";
        w.style.top = 70 + i * 26 + "px";
      });
    },

    tile() {
      const list = wins();
      const cols = Math.ceil(Math.sqrt(list.length)) || 1;
      list.forEach((w, i) => {
        w.style.left = 40 + (i % cols) * 300 + "px";
        w.style.top = 70 + Math.floor(i / cols) * 240 + "px";
      });
    },

    async savesheet() {
      const w = front();
      if (!w) return ACTIONS.alertdemo();
      const r = await Aqua.sheet(w, {
        message: "Do you want to save the changes you made in this document?",
        informative: "Your changes will be lost if you don’t save them.",
        icon: ICON,
        buttons: [
          { id: "dont", label: "Don’t Save" },
          "-",
          { id: "cancel", label: "Cancel", cancel: true },
          { id: "save", label: "Save", def: true },
        ],
      });
      if (r === "save" || r === "dont") ACTIONS.closewin();
    },

    async alertdemo() {
      await Aqua.alert({
        message: "Aqua UI",
        informative:
          "The 2001 Aqua desktop rebuilt in CSS. Menus, sheets and alerts " +
          "are driven by aqua-ui.js.",
        icon: ICON,
        buttons: [{ id: "ok", label: "OK", def: true }],
      });
    },

    about: () => AquaUI.openDocumentation(),

    async shutdown() {
      const r = await Aqua.alert({
        message: "Are you sure you want to shut down your computer now?",
        icon: ICON,
        buttons: [
          { id: "cancel", label: "Cancel", cancel: true },
          { id: "shut", label: "Shut Down", def: true },
        ],
      });
      if (r === "shut") document.body.classList.add("shutting-down");
    },

    components: () => window.open("components.html", "_blank"),
    icons: () => window.open("components.html#icons", "_blank"),
  };

  document.addEventListener("aqua:menuselect", (e) => {
    const id = e.detail.id;
    if (!id) return;
    if (id.startsWith("open:")) return AquaUI.openComponent(id.slice(5));
    const fn = ACTIONS[id];
    if (fn) fn();
  });

  desk.addEventListener("contextmenu", async (e) => {
    if (e.target.closest(".win, .dock, .menubar")) return;
    e.preventDefault();
    const r = await Aqua.menu(
      [
        { id: "launcher", label: "Documentation" },
        "-",
        { id: "cascade", label: "Cascade Windows" },
        { id: "tile", label: "Tile Windows" },
        "-",
        { id: "closeall", label: "Close All Windows" },
      ],
      e.clientX,
      e.clientY
    );
    if (r && ACTIONS[r.id]) ACTIONS[r.id]();
  });
})();

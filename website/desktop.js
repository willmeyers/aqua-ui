(function () {
  "use strict";

  const C = [
    { id: "window", title: "Window", group: "Windows",
      desc: `Titlebar is a 4px pinstripe over a downward ramp; the traffic lights are 13px gel gems.`,
      ex: `<div class="window" style="width:240px">
  <div class="title-bar">
    <div class="title-bar-controls">
      <button aria-label="Close"><span>&times;</span></button>
      <button aria-label="Minimize"><span>&minus;</span></button>
      <button aria-label="Zoom"><span>+</span></button>
    </div>
    <div class="title-bar-text">Finder</div>
    <div style="width:49px"></div>
  </div>
  <div class="window-body">Welcome to Aqua UI.</div>
</div>`,
      note: `Add <code>class="window inactive"</code> for the unfocused state.` },

    { id: "button", title: "Button", group: "Buttons",
      desc: `Three-sliced straight from the bitmap: 14px end caps plus a 1px column tiled between, with the silhouette drawn by <code>border-radius</code> so the edge antialiases at any DPI. The default gel is the throb&rsquo;s mid-phase, frames 1 and 3 averaged. Add <code>pulsing</code> for the dialog throb.`,
      ex: `<aqua-button>Cancel</aqua-button>
<aqua-button default>OK</aqua-button>
<aqua-button default pulsing>Yes</aqua-button>
<aqua-button disabled>Disabled</aqua-button>` },

    { id: "checkbox", title: "Checkbox & radio", group: "Forms",
      desc: `12px box in an 18px canvas. The dark tick overhangs the top-right corner, as in the bitmap.`,
      plain: true,
      ex: `<div class="field-row"><input type="checkbox" id="d1" checked><label for="d1">Show disks on the Desktop</label></div>
<div class="field-row"><input type="checkbox" id="d2"><label for="d2">Keep the same view</label></div>
<div class="field-row"><input type="radio" name="g" id="g1" checked><label for="g1">Jump to next page</label></div>
<div class="field-row"><input type="radio" name="g" id="g2"><label for="g2">Scroll to here</label></div>` },

    { id: "textbox", title: "Text fields", group: "Forms", plain: true,
      desc: `Edit-text frame. The search field takes the pill radius.`,
      ex: `<div class="field-row-stacked" style="width:260px">
  <input type="text" placeholder="Text field" style="width:100%">
  <input type="search" placeholder="Search field" style="width:100%">
  <textarea rows="3" style="width:100%" placeholder="Text view"></textarea>
</div>` },

    { id: "select", title: "Popup menu", group: "Forms",
      desc: `Nine-sliced popup with the blue &#9650;&#9660; gem.`,
      ex: `<span class="select-wrapper">
  <select>
    <option>Thousands</option>
    <option>Millions</option>
  </select>
</span>` },

    { id: "slider", title: "Slider", group: "Forms", plain: true,
      desc: `Dark inset track. Default thumb is a glossy round drop; add ticks for the pentagon.`,
      ex: `<div class="field-row-stacked">
  <input type="range" class="round" min="0" max="100" value="60">
  <div>
    <input type="range" min="0" max="100" value="40">
    <div class="slider-ticks"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
  </div>
</div>` },

    { id: "stepper", title: "Stepper", group: "Forms", plain: true,
      desc: `One pill with a continuous gel ramp; pressing tints a half blue.`,
      ex: `<div class="field-row">
  <input type="text" value="10" style="width:52px">
  <span class="stepper">
    <button aria-label="Increment"></button>
    <button aria-label="Decrement"></button>
  </span>
</div>` },

    { id: "progress", title: "Progress", group: "Progress", plain: true,
      desc: `Determinate fill is a blue gel. The indeterminate bar reproduces the 32-frame diagonal sweep.`,
      ex: `<div class="field-row-stacked" style="width:260px">
  <progress value="55" max="100" style="width:100%"></progress>
  <progress style="width:100%"></progress>
</div>` },

    { id: "tabs", title: "Tabs", group: "Containers",
      desc: `Selected tab is the blue cap; unselected tabs reuse the push-button fill.`,
      ex: `<div style="width:260px">
  <div class="tabs">
    <button aria-selected="true">Display</button>
    <button>Color</button>
  </div>
  <div class="tab-panel">Resolutions, colors, refresh rate.</div>
</div>` },

    { id: "groupbox", title: "Group box", group: "Containers",
      desc: `A rounded rule over the window pinstripe.`,
      ex: `<fieldset style="width:250px;background:#dedede">
  <legend>Disks</legend>
  <div class="field-row">
    <input type="checkbox" id="gg" checked>
    <label for="gg">Show disks on the Desktop</label>
  </div>
</fieldset>` },

    { id: "tree", title: "Tree view", group: "Containers", plain: true,
      desc: `Native <code>&lt;details&gt;</code>/<code>&lt;summary&gt;</code>: the disclosure actually toggles, no JS. <strong>Click a folder.</strong>`,
      ex: `<div class="tree-view" style="width:220px">
  <details open>
    <summary>Documents</summary>
    <ul>
      <li>Letter.rtf</li>
      <li>Notes.txt</li>
    </ul>
  </details>
  <details>
    <summary>Pictures</summary>
    <ul>
      <li>Trip.jpg</li>
    </ul>
  </details>
  <div class="leaf">Sites</div>
</div>` },

    { id: "table", title: "Table view", group: "Containers", plain: true,
      desc: `List header ramp with alternating row tint, as the 10.0 list view drew it.`,
      ex: `<table style="width:280px">
  <thead>
    <tr><th aria-sort="ascending">Name</th><th>Size</th></tr>
  </thead>
  <tbody>
    <tr><td>Desktop</td><td>4 KB</td></tr>
    <tr><td>Documents</td><td>12 KB</td></tr>
    <tr aria-selected="true"><td>Library</td><td>1.2 MB</td></tr>
    <tr><td>Movies</td><td>8 KB</td></tr>
  </tbody>
</table>` },

    { id: "menu", title: "Menus", group: "Windows",
      desc: `Menu background is the lighter 4px tile; selected items use the blue list-selection fill.`,
      ex: `<ul class="menu" style="width:200px">
  <li>About This Mac</li>
  <li>Get Aqua Software&hellip;</li>
  <li class="separator"><hr class="separator" style="margin:0"></li>
  <li>System Preferences&hellip;</li>
  <li aria-haspopup="true">Dock</li>
  <li aria-checked="true">Show Toolbar</li>
  <li aria-disabled="true">Force Quit&hellip;</li>
</ul>` },

    { id: "statusbar", title: "Status bar", group: "Windows",
      desc: `Window Placard ramp.`,
      ex: `<div class="window" style="width:240px">
  <div class="window-body">Documents</div>
  <div class="status-bar"><span>8 items, 1.2 GB available</span></div>
</div>` },

    { id: "separator", title: "Separators", group: "Containers", plain: true,
      desc: `1px rule with a white highlight beneath.`,
      ex: `<div style="width:240px">Above<hr class="separator">Below</div>` },

    { id: "buttongroup", title: "Button group", group: "Buttons", plain: true,
      desc: `Finder's segmented control, taken apart so it takes any content at any width. Sliced into caps, a gel column and dividers, it takes text, the three original view glyphs, or your own image. <strong>Click a segment, or focus it and press &larr;/&rarr;.</strong>`,
      ex: `<aqua-button-group value="icon" label="View">
  <button value="icon" icon="icon" label="Icon view"></button>
  <button value="list" icon="list" label="List view"></button>
  <button value="column" icon="column" label="Column view"></button>
</aqua-button-group>
<aqua-button-group value="all">
  <button value="all">All</button>
  <button value="mine">Mine</button>
  <button value="shared">Shared</button>
</aqua-button-group>
<aqua-button-group multiple value="b">
  <button value="b">Bold</button>
  <button value="i">Italic</button>
</aqua-button-group>`,
      note: `Three modes: single-select (default, a <code>radiogroup</code>), <code>multiple</code> for a toggle group, and <code>momentary</code> for plain buttons that fire <code>command</code>. Also takes <code>disabled</code> and <code>inactive</code>. Ships in <code>@aqua-ui/web-components</code>.` },

    { id: "toolbar", title: "Toolbar", group: "Windows", plain: true,
      desc: `The oval in a window's top-right shows and hides the toolbar. It belongs to the window frame rather than to the toolbar it controls, which is why it stays when the strip slides away. Pressed, the whole pill floods blue. <strong>Click the oval.</strong>`,
      ex: `<aqua-window label="Macintosh HD" toolbar style="width:330px">
  <aqua-toolbar>
    <aqua-toolbar-item value="computer" label="Computer" src="icons/computer.png"></aqua-toolbar-item>
    <aqua-toolbar-item value="home" label="Home" src="icons/home.png"></aqua-toolbar-item>
    <aqua-toolbar-item divider></aqua-toolbar-item>
    <aqua-toolbar-item value="favs" label="Favorites" src="icons/favorites.png"></aqua-toolbar-item>
  </aqua-toolbar>
  <div>Window content.</div>
</aqua-window>`,
      note: `<code>toolbar</code> on the window puts the pill in its title bar; clicking it slides the strip away and fires <code>toolbartoggle</code>. Items fire <code>command</code>. <code>&lt;aqua-toolbar small&gt;</code> is the icon-beside-label form; <code>divider</code> draws Finder's dotted group rule and <code>spacer</code> pushes what follows to the right.` },

    { id: "metal", title: "Brushed metal", group: "Windows", plain: true,
      desc: `A photograph of milled aluminium, painted on the window frame so it runs unbroken under the title the way a real metal window did. <code>class="metal"</code> also skins any container on its own.`,
      ex: `<div class="window metal" style="width:250px">
  <div class="title-bar">
    <div class="title-bar-controls">
      <button aria-label="Close"><span>&times;</span></button>
      <button aria-label="Minimize"><span>&minus;</span></button>
      <button aria-label="Zoom"><span>+</span></button>
    </div>
    <div class="title-bar-text">Metal</div>
    <div style="width:49px"></div>
  </div>
  <div class="window-body">
    <fieldset class="metal">
      <legend>Movie</legend>
      <div class="field-row">
        <button class="default">Play</button>
        <button>Stop</button>
      </div>
    </fieldset>
    <hr class="separator">
    <div>Fetching&hellip;</div>
  </div>
  <div class="status-bar"><span>00:00 / 03:12</span></div>
</div>`,
      note: `<code>class="metal"</code> skins any container on its own: a <code>.tab-panel</code>, a <code>fieldset</code>, a plain <code>&lt;div&gt;</code>. Add <code>inset</code> for a well.` },
  ];
  const byId = Object.fromEntries(C.map((c) => [c.id, c]));

  const VOID = new Set(["br","hr","img","input"]);
  const INLINE = new Set(["a","b","i","em","strong","span","small","label","button","option","legend","summary","code","td","th","li"]);
  function fmt(html) {
    const toks = html.match(/<[^>]+>|[^<]+/g) || [];
    let depth = 0; const out = [];
    const pad = (n) => "  ".repeat(Math.max(0, n));
    for (const raw of toks) {
      if (!raw.trim()) continue;
      if (raw[0] === "<") {
        const closing = /^<\//.test(raw);
        const tag = (raw.match(/^<\/?\s*([\w-]+)/) || [])[1] || "";
        const self = VOID.has(tag.toLowerCase()) || /\/>$/.test(raw);
        if (closing) depth--;
        out.push(pad(depth) + raw.trim());
        if (!closing && !self) depth++;
      } else out.push(pad(depth) + raw.trim());
    }
    return out.join("\n")
      .replace(/<(\w+)([^>]*)>\n\s*([^<\n]+)\n\s*<\/\1>/g,
        (m,t,a,inner)=>INLINE.has(t.toLowerCase())?`<${t}${a}>${inner}</${t}>`:m)
      .replace(/<(\w+)([^>]*)>\n\s*<\/\1>/g,"<$1$2></$1>");
  }
  const esc = (s)=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

  const desk = document.querySelector(".desktop");
  let z = 10, cascade = 0;
  const openWins = {};

  function focusWin(win) {
    win.style.zIndex = ++z;
    document.querySelectorAll(".win").forEach((w)=>w.classList.toggle("inactive", w!==win));
    win.classList.remove("inactive");
  }

  function drag(win, handle) {
    handle.style.touchAction = "none";
    handle.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".title-bar-controls")) return;
      focusWin(win);
      const sx = e.clientX, sy = e.clientY;
      const ox = win.offsetLeft, oy = win.offsetTop;
      handle.setPointerCapture(e.pointerId);
      function mv(ev){
        win.style.left = Math.min(Math.max(0, ox + ev.clientX - sx), innerWidth - 60) + "px";
        win.style.top  = Math.min(Math.max(22, oy + ev.clientY - sy), innerHeight - 40) + "px";
      }
      function up(){ handle.removeEventListener("pointermove",mv); handle.removeEventListener("pointerup",up); handle.removeEventListener("pointercancel",up); }
      handle.addEventListener("pointermove",mv);
      handle.addEventListener("pointerup",up);
      handle.addEventListener("pointercancel",up);
    });
  }

  function makeWin({ title, bodyHTML, cls = "", x, y, w }) {
    const win = document.createElement("div");
    win.className = "win aqua " + cls;
    if (w) win.style.width = Math.min(w, innerWidth - 12) + "px";
    const ww = Math.min(w || 320, innerWidth - 12);
    win.style.left = Math.max(6, Math.min(x ?? (120 + cascade*26), innerWidth - ww - 6)) + "px";
    win.style.top  = Math.max(22, Math.min(y ?? (70 + cascade*26), innerHeight - 120)) + "px";
    win.innerHTML =
      `<div class="title-bar">
        <div class="title-bar-controls">
          <button aria-label="Close"><span>&times;</span></button>
          <button aria-label="Minimize"><span>&minus;</span></button>
          <button aria-label="Zoom"><span>+</span></button>
        </div>
        <div class="title-bar-text">${title}</div>
        <div style="width:49px;flex:0 0 auto"></div>
      </div>
      <div class="win-content">${bodyHTML}</div>`;
    desk.appendChild(win);
    drag(win, win.querySelector(".title-bar"));
    win.addEventListener("pointerdown", () => focusWin(win));
    focusWin(win);
    cascade = (cascade + 1) % 8;
    return win;
  }

  function openComponent(id) {
    if (openWins[id]) { focusWin(openWins[id]); return; }
    const c = byId[id];
    const body =
      `<div class="doc">
        <h3>${c.title}</h3>
        <div class="desc">${c.desc}</div>
        <div class="stage${c.plain ? " plain" : ""} aqua">${c.ex}</div>
        <div class="code"><pre><code>${esc(fmt(c.ex))}</code></pre></div>
        ${c.note ? `<div class="note">${c.note}</div>` : ""}
      </div>`;
    const win = makeWin({ title: c.title, bodyHTML: body });
    openWins[id] = win;
  }

  function openCheetah() {
    if (openWins.__cheetah) { focusWin(openWins.__cheetah); return; }
    const W = 300;
    const win = makeWin({
      title: "cheetah.jpg", cls: "cheetah-win", w: W,
      x: Math.max(24, innerWidth - W - 56),
      y: Math.max(40, innerHeight - 610),
      bodyHTML: '<img src="assets/cheetah.jpg" alt="A cheetah sitting on a termite mound">' +
                '<div class="status-bar"><span>682 × 1023, 155 KB</span></div>',
    });
    openWins.__cheetah = win;
  }

  function openDocumentation() {
    if (openWins.__docs) { focusWin(openWins.__docs); return; }
    const W = Math.min(980, Math.max(Math.min(640, innerWidth - 12), Math.round(innerWidth * 0.62)));
    const win = makeWin({
      title: "Documentation", cls: "docs-win", w: W, x: 48, y: 56,
      bodyHTML:
        '<iframe class="docs-frame" src="components.html" title="Aqua UI library reference"></iframe>' +
        '<div class="status-bar"><span>v1.0.0</span>' +
        '<span class="spacer"></span>' +
        '<span><a href="components.html" target="_blank">Open the documentation</a></span></div>'
    });
    const fr = win.querySelector(".docs-frame");
    fr.addEventListener("load", () => {
      try {
        fr.contentWindow.addEventListener("pointerdown", () => focusWin(win), true);
      } catch (e) { /* cross-origin frame: focus via the title bar */ }
    });
    openWins.__docs = win;
  }
  const openLauncher = openDocumentation;   // old name, kept for the menus

  window.AquaUI = { openComponent, openLauncher, openDocumentation, openCheetah,
    components: () => C.map(({id, title, group}) => ({id, title, group})) };
  openDocumentation();
  openCheetah();  // Preview, with something worth previewing

  const finder = document.querySelector('.dock-item[data-launch="finder"]');
  if (finder) finder.addEventListener("click", openDocumentation);
  const preview = document.querySelector('.dock-item[data-launch="preview"]');
  if (preview) preview.addEventListener("click", openCheetah);
})();

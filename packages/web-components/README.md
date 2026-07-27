# @aqua-ui/web-components

Aqua UI: the classic Aqua interface rebuilt for the web, as custom elements.
Every gradient was transcribed from the original widget artwork. The
stylesheet is bundled and injects itself once on import; there is no separate
CSS to ship.

```ts
import "@aqua-ui/web-components";   // registers every aqua-* element

// or selectively, styles opt-in:
import { injectStyles } from "@aqua-ui/web-components/styles";
import { AquaWindow } from "@aqua-ui/web-components/window";
injectStyles();
```

This is an alpha. Docs and live demos: https://github.com/willmeyers/aqua-ui

License note: the sprites embedded in the bundled stylesheet are derived from
original Apple artwork, included for fidelity. Not affiliated with or endorsed
by Apple. Everything else is the project's own code.

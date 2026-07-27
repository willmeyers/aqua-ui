# @aqua-ui/react

Aqua UI: the classic Aqua interface rebuilt for the web, as typed React
components over the @aqua-ui/web-components custom elements. The stylesheet is
bundled and injects itself once on import.

```tsx
import { AquaWindow, AquaButton } from "@aqua-ui/react";

export const App = () => (
  <AquaWindow label="Untitled">
    <AquaButton default>OK</AquaButton>
  </AquaWindow>
);
```

This is an alpha. Docs and live demos: https://github.com/willmeyers/aqua-ui

License note: the sprites embedded in the bundled stylesheet are derived from
original Apple artwork, included for fidelity. Not affiliated with or endorsed
by Apple. Everything else is the project's own code.

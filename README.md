# Aqua UI

The classic Aqua interface, rebuilt for the web. Every gradient and sprite is
generated from the original widget artwork, and the system font ships with it.

Live docs: open `website/components.html`. The desktop demo is `website/index.html`.

## Install

```
npm install @aqua-ui/web-components @aqua-ui/react
```

`@aqua-ui/web-components` registers every `aqua-*` custom element and injects
the bundled stylesheet on import. `@aqua-ui/react` wraps the same elements as
typed React components.

```tsx
import { AquaWindow, AquaButton } from "@aqua-ui/react";

export const App = () => (
  <AquaWindow label="Untitled">
    <AquaButton default>OK</AquaButton>
  </AquaWindow>
);
```

## Repo

| Path | What |
|---|---|
| `packages/web-components` | the elements, TypeScript |
| `packages/react` | the React bindings |
| `website/aqua.css` | the generated stylesheet; regenerated from the original artwork outside this repo |
| `website/` | the docs site and the desktop demo; sources in `website/site/`, assembled by `npm run site` |

## Development

```
npm ci
npm run build      # compile both packages
npm test           # package unit tests
npm run test:site  # browser smoke test of the website
npm run website    # dev server on http://127.0.0.1:8777
npm run site       # assemble website/components.html from website/site/
npm run icons      # regenerate the icon gallery fragment
npm run css        # regenerate the stylesheet (needs the install media mounted)
```

Publishing runs from CI on a GitHub release, using the `NPM_TOKEN` secret.

## A note on the artwork

The sprites and the font embedded in the stylesheet are derived from original
Apple resources, included for fidelity. This project is not affiliated with or
endorsed by Apple.

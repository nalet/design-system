## install

Each GitHub release carries the packed package; apps install it by URL — no registry needed.

```sh
npm i https://github.com/nalet/design-system/releases/download/v0.3.0/nalet-design-system-0.3.0.tgz
```

Peer dependencies: `react` and `react-dom` 18 or 19, and `lucide-react` 0.300 or newer (the library imports its types; your app passes icons in). An app that must not fetch at install time can vendor the tarball and depend on it with `file:`.

## load the styles

```tsx
// once, near the app root:
import '@nalet/design-system/styles.css';

import { Button, ObjectStatus } from '@nalet/design-system';

export function Example() {
  return (
    <>
      <ObjectStatus state="information">on its way</ObjectStatus>
      <Button variant="primary">grab 8 selected</Button>
    </>
  );
}
```

- `styles.css` holds the component styles **and** the tokens (the `:root` custom properties, the page base and the type utilities).
- `tokens.css` holds only the tokens — for an app that uses the identity without the components.
- Nothing else is global. The components are plain React with co-located CSS; no provider is needed. One exception: render one `<Toaster />` near the root if you call `toast()`.

## fonts

The package ships no font files. Load **Inter** (400, 500, 600, 700) and **JetBrains Mono** (400–800) yourself — self-hosted, for example with `@fontsource/inter` and `@fontsource/jetbrains-mono`:

```ts
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/600.css';
import '@fontsource/jetbrains-mono/700.css';
import '@fontsource/jetbrains-mono/800.css';
```

Or from Google Fonts:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" />
```

Without them the stacks fall back to `system-ui` and `ui-monospace`. Load JetBrains Mono 400: most mono values are drawn at 400, and without it they render at the next weight. Shipping the fonts in the package is **planned**.

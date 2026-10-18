## install

Each release on GitHub carries the packed package, and apps install it straight from its address, with no registry in between:

```sh
npm i https://github.com/nalet/design-system/releases/download/v0.3.0/nalet-design-system-0.3.0.tgz
```

Your app installs three packages next to it: `react` and `react-dom` 18 or 19, and `lucide-react` 0.300 or newer. The library only uses the icon set's types; your app passes the icons in. An app that must not download anything while it installs can keep the tarball in its own repository and depend on it with `file:`.

## load the styles

```tsx
// once, near the app root:
import '@nalet/design-system/styles.css';

import { Button, Status } from '@nalet/design-system';

export function Example() {
  return (
    <>
      <Status state="information">on its way</Status>
      <Button variant="primary">grab 8 selected</Button>
    </>
  );
}
```

- `styles.css` holds the component styles **and** the tokens: the `:root` custom properties, the page's base styles and the type classes.
- `tokens.css` holds only the tokens, for an app that uses the identity without the components.
- Nothing else is global. The components are plain React, each with its own CSS, and need no provider around them. The one exception: if you call `toast()`, render one `<Toaster />` near the root.

## fonts

The package doesn't include the font files, so your app loads **Inter** (400, 500, 600 and 700) and **JetBrains Mono** (400 to 800) itself. You can host them yourself, for example with `@fontsource/inter` and `@fontsource/jetbrains-mono`:

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

Or load them from a font service:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" />
```

Without them, the text falls back to the system's own fonts, `system-ui` and `ui-monospace`. Make sure to load JetBrains Mono 400: most monospace values are drawn at 400, and without it they show at the next weight up. Including the fonts in the package is **planned**.

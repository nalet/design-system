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

## touch screens and tvs

The components are drawn for a pointer and a keyboard. An app made for touch, or for a TV, says so once, with an attribute on its root element:

```html
<html data-nc-screen="touch">
```

```html
<html data-nc-screen="tv">
```

- **`touch`**, for a phone, a tablet or a kiosk: every control is drawn at its large size, whatever size it was given, and answers to a touch in at least 48 × 48px; a checkbox or a switch with its label, and a table's row, are at least 48px high.
- **`tv`**, for a screen used with a remote from across the room: controls are large, rows are 48px, no text is smaller than 12px, the focus is the tv focus, and a `Select` opens the system's own list.
- **Without the attribute** nothing changes. The components never look at the window's width or at the kind of pointer: a small window on a computer is still used with a mouse. Set the attribute where your app knows what it runs on.
- **Where to put it.** On `<html>` or `<body>`, so that it reaches the dialogs and menus too, which are drawn at the end of `<body>`. On another element it applies to what is inside that element. From a script: `document.documentElement.dataset.ncScreen = 'tv'`.
- **Nothing else to load.** The rules are part of `styles.css`.
- **What stays with your app:** the space between components (8px on a touch screen, 12px on a tv), a tv's safe area, and moving the focus from one component to the next with the remote's arrow keys, which is the tv browser's spatial navigation or your own.

The sizes and where they come from are on the guidelines site, under [touch and tv sizes](https://nalet.github.io/design-system/foundations/layout/#touch-and-tv-sizes) and [tv focus](https://nalet.github.io/design-system/patterns/tv-focus/).

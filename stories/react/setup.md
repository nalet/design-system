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

## the page's language

The components write counts and dates, and bring a few words of their own, such as “loading”, “clear” and “4 of 2,500”. All of it follows the language of the page, so a page says its language once and nothing is set component by component.

A page says its language on its root element. The components read it there, and follow a change of it:

```html
<html lang="de">
```

A page without a `lang` is English. For one part of a page in another language, or where the root element isn't yours to set, wrap that part in `Language`:

```tsx
import { Language } from '@nalet/design-system';

<Language lang="de">
  <Backups />
</Language>
```

- **Counts and dates** are written by the browser's own `Intl`, in every language it knows: “2,500” in English, “2.500” in German, “2'500” on a Swiss German page (`de-CH`). English without a region writes a date day first, “12 oct 2026”; `en-US` writes it the American way.
- **The components' own words** come from one set per language. English (`en`) and German (`de`) are built in. A region reads its language's set, so `de-CH` reads the German one. Any other language reads the English set until you give it its own.
- **A prop still wins.** Where a component takes a word as a prop, such as a spinner's `label` or a banner's `dismissLabel`, what you pass is used as it is.

### words for another language, or of your own

`Language` takes `words`: any part of a set. Every text you leave out stays the built-in one.

```tsx
import { Language, type WordsOverride } from '@nalet/design-system';

// single texts, replaced for everything inside
const own: WordsOverride = {
  toolbar: { clear: 'clear selection' },
};

// a language that isn't built in: the blocks of the components the app uses
const french: WordsOverride = {
  spinner: { loading: 'chargement' },
  toolbar: {
    clear: 'effacer',
    selected: { one: '{n} sélectionné', other: '{n} sélectionnés' },
  },
};

<Language lang="fr" words={french}>
  <App />
</Language>
```

- A set has one block per component, named after it. The `Words` type lists every text, with a note on where it shows; `english` and `german` are the two built-in sets, to copy from.
- A text with a value in it names the place in braces: `'select {name}'`.
- A text that counts has one form for each number the language tells apart, `one` and `other` in English and German, with `{n}` where the count goes.
- Monospace chrome is written in lowercase, as it is read. A sentence in the body face keeps the language's own capitals.
- Give `lang` and `words` together, once, near the root. A `Language` inside another starts again from the built-in set for its own language.

### your own texts

The same helpers write the app's own texts in the language a component is in:

```tsx
import { counted, useLanguage } from '@nalet/design-system';

function Heading({ total }: { total: number }) {
  const { lang } = useLanguage();
  // "2,500 backups" in English, "2.500 backups" where the page is German
  return <h2>{counted({ one: '{n} backup', other: '{n} backups' }, total, lang)}</h2>;
}
```

- `useLanguage()` returns the language a component is in, `lang`, and the components' `words` for it.
- `formatCount(2500, lang)` writes a count. `counted(text, n, lang)` picks the form of a text that counts and puts the count in. `fill('{shown} of {total}', { shown, total })` puts values into a text.
- `relativeDay(then, now, lang)` says how long ago, as the date cell does.
- Without a language, `formatCount` and `relativeDay` write in the page's own.

Not built: a language written from right to left. It turns every layout round, which the components don't do.

# @nalet/design-system

the nalet design system. dark canvas, monospace voice, blue chevron, one
cursor. a single identity for every nalet surface — it replaces fiori as the
house style.

> if a screen would look at home in a tmux pane, it is on. if it looks like a
> saas landing page, start over.

- **storybook (github pages):** https://nalet.github.io/design-system/
- **source:** https://github.com/nalet/design-system

## install

```sh
npm i @nalet/design-system
```

the components are plain react + css (no tailwind dependency inside the library).
import the tokens stylesheet once, near your app root, then use components:

```tsx
// tokens: css custom properties + @font + base. import once.
import '@nalet/design-system/tokens.css';

import { Button, Chevron, Lockup } from '@nalet/design-system';

export function App() {
  return (
    <main>
      <Lockup />
      <Button>run</Button>
    </main>
  );
}
```

typed token objects are available too:

```ts
import { tokens } from '@nalet/design-system/tokens';
```

### tailwind consumers

if your app uses tailwind and you want the same colors / fonts / spacing, extend
your config with the shipped preset:

```js
// tailwind.config.js
module.exports = {
  presets: [require('@nalet/design-system/tailwind')],
};
```

the preset only maps tokens into `theme.extend` (colors, fontFamily, spacing). the
library itself does not depend on tailwind.

## non-negotiables

- **dark canvas only.** `--bg #0B0F19` / `--bg-2 #0D1117` / `--surface #11161F` /
  `--surface-2 #161B26` / `--border #1F2633` / `--border-2 #2A3142`.
- **foreground.** `--fg #E6E6E6` / `--fg-2 #C9D1D9` / `--fg-muted #AEB8C2` /
  `--fg-dim #6E7787`.
- **the `>` chevron is the brand glyph** and is **always** `--cloud-blue`
  (`#58A6FF`) — links and the primary cta too. `--cloud-cyan #00A4DC` is the
  cursor / active stroke. `--signal-green #2EA043` = ok, `--signal-amber #F2B233`
  = warn.
- **type.** `'JetBrains Mono'` for display / headings / system / code / brand,
  `'Inter'` for body / prose / ui-labels. exact metrics per role in
  `tokens/tokens.json`.
- **space.** 4-base only: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64`.
- **square frames.** `border-radius: 0` on every card, panel, tile, button,
  input, and dialog. **no rounded corners.** icons are the only rounded shape and
  that radius is baked into the icon pngs — never add radius in css.
- **voice.** lowercase, short copy, no emoji, no exclamation marks.

## what's in the box

- `@nalet/design-system` — react components + brand glyphs (`Chevron`, `Lockup`,
  `Icon`).
- `@nalet/design-system/tokens.css` — css custom properties, `@font`, and base.
- `@nalet/design-system/tokens` — typed token objects.
- `@nalet/design-system/tailwind` — tailwind preset for consumer apps.

## develop

```sh
npm ci
npm run build-tokens     # tokens.json -> src/styles/tokens.css, src/tokens.ts, tailwind-preset.cjs
npm run storybook        # local storybook on :6006
npm run build            # build tokens + the library (vite lib mode)
npm run build-storybook  # static storybook -> storybook-static/
npm run lint             # tsc --noEmit (typecheck)
```

tokens are the source of truth: edit `tokens/tokens.json`, run `build-tokens`,
and the css, the typed tokens, and the tailwind preset regenerate together.

## release

publishing is gated on a version tag. bump `version` in `package.json`, commit,
then:

```sh
git tag vX.Y.Z
git push origin vX.Y.Z
```

the `publish` workflow runs `npm publish --access public` to npmjs. it requires
an `NPM_TOKEN` actions secret (an npm automation token for the `@nalet` org). see
`.github/workflows/publish.yml` for the github-packages alternative.

## license

[mit](./LICENSE).

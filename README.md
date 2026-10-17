# @nalet/design-system

The nalet design system. Dark canvas, monospace voice, blue chevron, one
cursor. A single identity for every nalet surface, and the house style of
every console built on it.

> If a screen would look at home in a tmux pane, it is on. If it looks like a
> SaaS landing page, start over.

- **Guidelines:** https://nalet.github.io/design-system/ — principles, foundations,
  styles, a design-guidance page per component, and patterns.
- **React:** https://nalet.github.io/design-system/react/ — the Storybook: each
  component's playground, examples, implementation notes and props.
- **Source:** https://github.com/nalet/design-system

## install

Install a release tarball (each GitHub release carries one; no registry needed):

```sh
npm i https://github.com/nalet/design-system/releases/download/v0.3.0/nalet-design-system-0.3.0.tgz
```

Peer dependencies: `react` and `react-dom` 18 or 19, `lucide-react`.

The components are plain React + CSS (no Tailwind dependency inside the library).
Import the two stylesheets once, near your app root, then use components:

```tsx
// tokens: css custom properties, the page base and the type utilities (no fonts).
import '@nalet/design-system/tokens.css';
// component styles.
import '@nalet/design-system/styles.css';

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

No font files ship with the package. Load **Inter** (400–700) and **JetBrains Mono**
(400–800) in the app — self-hosted (e.g. `@fontsource/inter`,
`@fontsource/jetbrains-mono`) or from Google Fonts; without them the stacks fall back
to `system-ui` and `ui-monospace`.

Typed token objects are available too:

```ts
import { tokens } from '@nalet/design-system/tokens';
```

### tailwind consumers

If your app uses Tailwind and you want the same colors / fonts / spacing, extend
your config with the shipped preset:

```js
// tailwind.config.js
module.exports = {
  presets: [require('@nalet/design-system/tailwind')],
};
```

The preset only maps tokens into `theme.extend` (colors, fontFamily, spacing). The
library itself does not depend on Tailwind.

## non-negotiables

- **Dark canvas only.** `--bg #0B0F19` / `--bg-2 #0D1117` / `--surface #11161F` /
  `--surface-2 #161B26` / `--border #1F2633` / `--border-2 #2A3142`.
- **Foreground.** `--fg #E6E6E6` / `--fg-2 #C9D1D9` / `--fg-muted #AEB8C2` /
  `--fg-dim #7B8597`. Every text token meets 4.5:1 on every background — a
  test enforces it.
- **The `>` chevron is the brand glyph** and is **always** `--cloud-blue`
  (`#58A6FF`) — links and the primary CTA too. `--cloud-cyan #00A4DC` is the
  cursor / active stroke. `--signal-green #2EA043` = ok, `--signal-amber #F2B233`
  = warn.
- **Type.** `'JetBrains Mono'` for display / headings / system / code / brand,
  `'Inter'` for body / prose / UI labels. Exact metrics per role in
  `tokens/tokens.json`.
- **Space.** 4-base only: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64`.
- **Square frames.** `border-radius: 0` on every card, panel, tile, button,
  input, and dialog. **No rounded corners.** Icons are the only rounded shape and
  that radius is baked into the icon PNGs — never add radius in CSS.
- **Voice.** Two voices, one per typeface. Monospace is the system's voice and
  it is lowercase: titles, buttons, tabs, navigation, statuses, headers, numbers
  and codes. The body face is the reader's language, in sentence case:
  descriptions, messages, field labels, hints and errors, and prose. Short copy,
  no emoji, no exclamation marks.

## what's in the box

- `@nalet/design-system` — React components + brand glyphs (`Chevron`, `Lockup`,
  `Icon`).
- `@nalet/design-system/tokens.css` — CSS custom properties, the page base and the type utilities (no font files: see install).
- `@nalet/design-system/styles.css` — the component styles.
- `@nalet/design-system/tokens` — typed token objects.
- `@nalet/design-system/tailwind` — Tailwind preset for consumer apps.

## develop

Toolchain: Node 20.19+ (CI uses 24), React 19, Vite 8, TypeScript 7 (with
`@typescript/typescript6` for the declaration build), Storybook 10.

```sh
npm ci
npm run build-tokens     # tokens.json -> src/styles/tokens.css, src/tokens.ts, tailwind-preset.cjs
npm run storybook        # the react subsite (storybook) on :6006
npm run site:dev         # the guidelines site (astro) on :4321/design-system/
npm run build            # build tokens + the library (vite lib mode)
npm run build-storybook  # static storybook -> storybook-static/
npm run site:build       # the guidelines site and its search index -> site/dist/
npm run site:react       # the storybook into site/dist/react/, as it is published
npm run site:check       # every internal link of site/dist resolves
npm test                 # unit, accessibility (axe), token-contrast and redirect tests
npm run lint             # tsc --noEmit (typecheck)
```

The docs are two sites in one folder: the guidelines (`site/`, Astro) at
`/design-system/`, and the React subsite (`stories/`, Storybook) at
`/design-system/react/`. Examples are written once, as stories, and the
guidelines render them through Storybook's portable stories. See
[contributing](./CONTRIBUTING.md).

Tokens are the source of truth: edit `tokens/tokens.json`, run `build-tokens`,
and the CSS, the typed tokens, and the Tailwind preset regenerate together.

## release

Releases are gated on a version tag. Bump `version` in `package.json`, commit,
then:

```sh
git tag vX.Y.Z
git push origin vX.Y.Z
```

The `release` workflow builds the library and attaches the packed tarball to a
GitHub release — that is what apps install. It also publishes to npmjs once an
`NPM_TOKEN` actions secret (an npm automation token for the `@nalet` org) exists;
without it that step is skipped.

## license

[MIT](./LICENSE).

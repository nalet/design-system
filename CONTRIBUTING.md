# contributing

the nalet design system. read the [principles](https://nalet.github.io/design-system/foundations/principles/),
the [foundations](https://nalet.github.io/design-system/foundations/) and `brand/brand.md` before you touch
anything. the rules below are not style preferences — they are the brand.

## the test

if a screen would look at home in a tmux pane, it is on. if it looks like a saas
landing page, start over.

## non-negotiables (do not break these)

- dark canvas only. use the canvas / foreground tokens, never raw hex.
- the `>` chevron is the brand glyph and is always `--cloud-blue` (`#58A6FF`).
- `'JetBrains Mono'` for display / headings / system / code / brand, `'Inter'`
  for body / prose / ui-labels.
- space is 4-base only: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.
- square frames. `border-radius: 0` on every card, panel, tile, button, input,
  and dialog. icons are the only rounded shape and that radius is baked into the
  pngs — never add radius in css.
- voice is lowercase, short, no emoji, no exclamation marks. this applies to
  copy, component labels, stories, docs, and commit messages.

## token-first

tokens are the single source of truth. you do not hand-write a color, a font
stack, a type metric, or a spacing value in a component.

1. edit `tokens/tokens.json` (dtcg format).
2. run `npm run build-tokens`. this regenerates `src/styles/tokens.css`
   (css-vars + base + the type utilities), `src/tokens.ts` (typed tokens), and
   `tailwind-preset.cjs`.
3. reference the css custom properties (`var(--bg)`, `var(--cloud-blue)`,
   `var(--s-4)`, `var(--ff-mono)`) in component css — never raw values.

## the two documentation sites

the docs come in two parts, and each says a thing once:

- **the guidelines site** (`site/`, built with astro) — the design guidance:
  principles, foundations, styles, a page per component (when to use it, anatomy,
  states, behaviour, content, do and don't) and patterns. it is served at
  `/design-system/`.
- **the react subsite** (`stories/`, built with storybook) — the implementation:
  each component's playground, examples, implementation notes and props. it is
  served at `/design-system/react/`.

examples are written once, as stories in `stories/**/*.stories.tsx`. the react
subsite shows them with their code; the guidelines site renders the same stories
through storybook's portable stories (`site/src/examples/`).

## how to add a component

1. create `src/components/<Name>/<Name>.tsx` and `src/components/<Name>/<Name>.css`.
   the css uses the token css-vars only. no tailwind inside the library.
2. keep it square (`border-radius: 0`), dark, and lowercase.
3. re-export it from `src/index.ts` so it ships from `@nalet/design-system`.
4. write its tests next to it (`<Name>.test.tsx`): behaviour, and axe for each
   state.
5. write its stories in `stories/components/<Name>.stories.tsx`, titled
   `Components/<role>/<name>`, with a `Playground` and one story per variant or
   state worth showing.
6. write its react page, `stories/components/<Name>.mdx`: a link to its guidance,
   the playground, the examples, the implementation notes and the props.
7. write its guidance page, `site/src/pages/components/<slug>.mdx`, and add it to
   `site/src/data/components.ts`. use the stories as its live examples.
8. run `npm run build-tokens && npm run lint && npm test && npm run build &&
   npm run site:build && npm run site:check` before opening a pr. ci runs the
   same steps on push and pr.

## previewing the docs

```sh
npm run site:dev         # the guidelines site on :4321/design-system/
npm run storybook        # the react subsite on :6006
npm run site:build       # the guidelines site, static, into site/dist/
npm run site:check       # every internal link in the built site resolves
```

previews render on the dark canvas with the brand fonts. do not add a light
background.

## commits

lowercase, short, imperative. no emoji, no exclamation marks, no co-author
trailers.

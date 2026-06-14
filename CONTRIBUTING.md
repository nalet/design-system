# contributing

the nalet design system. read `brand/brand.md` and the foundations in
storybook before you touch anything. the rules below are not style preferences —
they are the brand.

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
   (css-vars + `@font` + base), `src/tokens.ts` (typed tokens), and
   `tailwind-preset.cjs`.
3. reference the css custom properties (`var(--bg)`, `var(--cloud-blue)`,
   `var(--s-4)`, `var(--ff-mono)`) in component css — never raw values.

## how to add a component

1. create `src/components/<Name>/<Name>.tsx` and `src/components/<Name>/<Name>.css`.
   the css uses the token css-vars only. no tailwind inside the library.
2. keep it square (`border-radius: 0`), dark, and lowercase.
3. re-export it from `src/index.ts` so it ships from `@nalet/design-system`.
4. add a story. either co-located at
   `src/components/<Name>/<Name>.stories.tsx`, or under
   `stories/components/<Name>.stories.tsx`. include controls (argTypes) and a
   short, lowercase title under `Components/`.
5. run `npm run build-tokens && npm run lint && npm run build &&
   npm run build-storybook` before opening a pr. ci runs the same steps on push
   and pr.

## stories

- foundations live under `stories/foundations/` (colors, type, space, brand,
  guidelines). they read tokens live so they never drift.
- component stories title under `Components/<Name>`.
- previews render on the dark canvas with the brand fonts — that is configured in
  `.storybook/preview.tsx`; do not add a light background.

## commits

lowercase, short, imperative. no emoji, no exclamation marks, no co-author
trailers.

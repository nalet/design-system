# contributing

The nalet design system. Read the [principles](https://nalet.github.io/design-system/foundations/principles/),
the [foundations](https://nalet.github.io/design-system/foundations/) and `brand/brand.md` before you touch
anything. The rules below are not style preferences — they are the brand.

## the test

If a screen would look at home in a tmux pane, it is on. If it looks like a SaaS
landing page, start over.

## non-negotiables (do not break these)

- Dark canvas only. Use the canvas / foreground tokens, never raw hex.
- The `>` chevron is the brand glyph and is always `--cloud-blue` (`#58A6FF`).
- `'JetBrains Mono'` for display / headings / system / code / brand, `'Inter'`
  for body / prose / UI labels.
- Space is 4-base only: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.
- Square frames. `border-radius: 0` on every card, panel, tile, button, input,
  and dialog. Icons are the only rounded shape and that radius is baked into the
  PNGs — never add radius in CSS.
- Two voices, one per typeface. Monospace is the system's voice and it is
  lowercase: titles and headings, buttons, tabs and navigation, statuses and
  badges, table headers, menu items, toolbar and filter labels, numbers and
  codes. The body face is the reader's language, in sentence case:
  descriptions, messages, field labels, hints and errors, checkbox and switch
  labels, and the prose of the docs. Both are short, with no emoji and no
  exclamation marks. This applies to copy, component labels, stories and docs;
  commit messages stay lowercase.

## token-first

Tokens are the single source of truth. You do not hand-write a color, a font
stack, a type metric, or a spacing value in a component.

1. Edit `tokens/tokens.json` (DTCG format).
2. Run `npm run build-tokens`. This regenerates `src/styles/tokens.css`
   (CSS-vars + base + the type utilities), `src/tokens.ts` (typed tokens), and
   `tailwind-preset.cjs`.
3. Reference the CSS custom properties (`var(--bg)`, `var(--cloud-blue)`,
   `var(--s-4)`, `var(--ff-mono)`) in component CSS — never raw values.

## the two documentation sites

The docs come in two parts, and each says a thing once:

- **The guidelines site** (`site/`, built with Astro) — the design guidance:
  principles, foundations, styles, a page per component (when to use it, anatomy,
  states, behaviour, content, do and don't) and patterns. It is served at
  `/design-system/`.
- **The React subsite** (`stories/`, built with Storybook) — the implementation:
  each component's playground, examples, implementation notes and props. It is
  served at `/design-system/react/`.

Examples are written once, as stories in `stories/**/*.stories.tsx`. The React
subsite shows them with their code; the guidelines site renders the same stories
through Storybook's portable stories (`site/src/examples/`).

## writing the guidelines

The guidelines are read by people who aren't designers, and by agents. Write
for the people; give the agents their own compact version.

- **Explain before you advise.** Start with what something is for and why it
  matters, in a sentence or two, then say how to use it. Write like a colleague
  who knows the system and is happy to help: "Use tabs when…", "This helps
  people…", "Try to keep…". Save words like *must* and *never* for the
  accessibility baseline, where they are true.
- **Keep the sentences flowing.** Leave component names, prop names and token
  names out of the prose. Say "the emphasized button" rather than
  `variant="primary"`; the React pages carry the technical names.
- **Mark the words a reader may not know** with `<Term id="…">`, defined once in
  `site/src/data/glossary.ts`. Mark a word the first time it appears on a page,
  not every time. The explanation shows in a popup and is not part of the text.
- **Draw the idea, not the component.** Principles and patterns use storyboard
  sketches (`site/src/sketches/`, built from `kit.tsx`): frames, placeholder
  lines, one blue accent, state colours only where they mean something, and a
  word only where it carries the point. Pair a "do" with a "don't" when the
  contrast is the lesson. Every sketch has a label that describes it. Component
  pages keep their live examples, because there the real component is the point.
- **For agents**, `/llms.txt` lists the rules in compact plain text, and
  `/glossary.json` holds the glossary. Both are built from the same data as the
  site.

## how to add a component

1. Create `src/components/<Name>/<Name>.tsx` and `src/components/<Name>/<Name>.css`.
   The CSS uses the token CSS-vars only. No Tailwind inside the library.
2. Keep it square (`border-radius: 0`) and dark. Set `text-transform: lowercase`
   on monospace chrome only, never on text in the body face.
3. Re-export it from `src/index.ts` so it ships from `@nalet/design-system`.
4. Write its tests next to it (`<Name>.test.tsx`): behaviour, and axe for each
   state.
5. Write its stories in `stories/components/<Name>.stories.tsx`, titled
   `Components/<role>/<name>`, with a `Playground` and one story per variant or
   state worth showing.
6. Write its React page, `stories/components/<Name>.mdx`: a link to its guidance,
   the playground, the examples, the implementation notes and the props.
7. Write its guidance page, `site/src/pages/components/<slug>.mdx`, and add it to
   `site/src/data/components.ts`. Use the stories as its live examples.
8. Run `npm run build-tokens && npm run lint && npm test && npm run build &&
   npm run site:build && npm run site:check` before opening a PR. CI runs the
   same steps on push and PR.

## previewing the docs

```sh
npm run site:dev         # the guidelines site on :4321/design-system/
npm run storybook        # the react subsite on :6006
npm run site:build       # the guidelines site, static, into site/dist/
npm run site:check       # every internal link in the built site resolves
```

Previews render on the dark canvas with the brand fonts. Do not add a light
background.

## commits

Lowercase, short, imperative. No emoji, no exclamation marks, no co-author
trailers.

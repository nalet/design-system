# nalet — brand non-negotiables

a single identity for every nalet surface. dark canvas, monospace
voice, blue chevron, one cursor. two type families, ten color tokens, one glyph.

if a screen would look at home in a tmux pane, it is on. if it looks like a saas
landing page, start over.

## canvas (dark only)

| token         | value     | use                              |
| ------------- | --------- | -------------------------------- |
| `--bg`        | `#0B0F19` | primary background, deepest      |
| `--bg-2`      | `#0D1117` | deeper recesses, terminal blocks |
| `--surface`   | `#11161F` | cards, panels, raised areas      |
| `--surface-2` | `#161B26` | hover state on surface           |
| `--border`    | `#1F2633` | hairline borders, dividers       |
| `--border-2`  | `#2A3142` | heavier dividers                 |

## foreground

| token        | value     | use                          |
| ------------ | --------- | ---------------------------- |
| `--fg`       | `#E6E6E6` | primary text, titles         |
| `--fg-2`     | `#C9D1D9` | body text, the n glyph       |
| `--fg-muted` | `#AEB8C2` | labels, meta, captions       |
| `--fg-dim`   | `#7B8597` | helpers, hints, off state    |

## brand & signal

| token            | value     | use                                  |
| ---------------- | --------- | ------------------------------------ |
| `--cloud-blue`   | `#58A6FF` | the `>` chevron, links, primary cta  |
| `--cloud-cyan`   | `#00A4DC` | cursor, active stroke                |
| `--signal-green` | `#2EA043` | ok / running / healthy               |
| `--signal-amber` | `#F2B233` | warn / delayed / degraded            |
| `--signal-red`   | `#F85149` | error / failed / offline             |

## semantic state

status and messages never pick a signal colour directly; they use one of five
semantic states. each has a text/icon colour, a `-bg` tint and a `-border`.

| token                 | value     | means                                         |
| --------------------- | --------- | --------------------------------------------- |
| `--state-neutral`     | `#AEB8C2` | a plain fact: missing, queued                 |
| `--state-information` | `#58A6FF` | under way or worth knowing: on its way        |
| `--state-success`     | `#2EA043` | done and good: held, saved                    |
| `--state-warning`     | `#F2B233` | works, but someone should look: firewalled    |
| `--state-error`       | `#F85149` | failed or blocked, needs action               |

every text token meets 4.5:1 on every background, and control boundaries
(`--border-control #646C7A`) meet 3:1; `tokens/contrast.test.ts` enforces it.

the `>` chevron is the brand glyph. it is **always** `--cloud-blue` (`#58A6FF`).

## type

- `'JetBrains Mono'` for display, headings, system, code, and brand.
- `'Inter'` for body, prose, and ui-labels.
- type roles (display / h1 / h2 / body / ui / code) carry exact size, weight, and
  letter-spacing in `tokens/tokens.json` — do not eyeball them.

## space

4-base scale only: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64`.

## square frames

`border-radius: 0` on every card, panel, tile, button, input, and dialog. **no
rounded corners.** icons are the only rounded shape, and that radius is baked into
the icon pngs — never add radius in css.

## voice

lowercase. short copy. no emoji. no exclamation marks. terminal / tmux aesthetic.

## source of truth

- tokens: `tokens/tokens.json` (dtcg) — generates `src/styles/tokens.css`,
  `src/tokens.ts`, and the tailwind preset.
- brand reference: `brand/llm.txt`.
- guidelines (github pages): https://nalet.github.io/design-system/, with the
  react components at https://nalet.github.io/design-system/react/

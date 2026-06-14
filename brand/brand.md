# nalet.cloud — brand non-negotiables

a single identity for everything under *.nalet.cloud. dark canvas, monospace
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
| `--fg-dim`   | `#6E7787` | helpers, hints, off state    |

## brand & signal

| token            | value     | use                                  |
| ---------------- | --------- | ------------------------------------ |
| `--cloud-blue`   | `#58A6FF` | the `>` chevron, links, primary cta  |
| `--cloud-cyan`   | `#00A4DC` | cursor, active stroke                |
| `--signal-green` | `#2EA043` | ok / running / healthy               |
| `--signal-amber` | `#F2B233` | warn / delayed / degraded            |

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
- rendered manual: https://kb.nalet.cloud/standards/design-system

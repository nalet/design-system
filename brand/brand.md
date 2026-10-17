# nalet — brand non-negotiables

A single identity for every nalet surface. Dark canvas, monospace
voice, blue chevron, one cursor. Two type families, ten color tokens, one glyph.

If a screen would look at home in a tmux pane, it is on. If it looks like a SaaS
landing page, start over.

## canvas (dark only)

| token         | value     | use                              |
| ------------- | --------- | -------------------------------- |
| `--bg`        | `#0B0F19` | Primary background, deepest      |
| `--bg-2`      | `#0D1117` | Deeper recesses, terminal blocks |
| `--surface`   | `#11161F` | Cards, panels, raised areas      |
| `--surface-2` | `#161B26` | Hover state on surface           |
| `--border`    | `#1F2633` | Hairline borders, dividers       |
| `--border-2`  | `#2A3142` | Heavier dividers                 |

## foreground

| token        | value     | use                          |
| ------------ | --------- | ---------------------------- |
| `--fg`       | `#E6E6E6` | Primary text, titles         |
| `--fg-2`     | `#C9D1D9` | Body text, the n glyph       |
| `--fg-muted` | `#AEB8C2` | Labels, meta, captions       |
| `--fg-dim`   | `#7B8597` | Helpers, hints, off state    |

## brand & signal

| token            | value     | use                                  |
| ---------------- | --------- | ------------------------------------ |
| `--cloud-blue`   | `#58A6FF` | The `>` chevron, links, primary CTA  |
| `--cloud-cyan`   | `#00A4DC` | Cursor, active stroke                |
| `--signal-green` | `#2EA043` | OK / running / healthy               |
| `--signal-amber` | `#F2B233` | Warn / delayed / degraded            |
| `--signal-red`   | `#F85149` | Error / failed / offline             |

## semantic state

Status and messages never pick a signal colour directly; they use one of five
semantic states. Each has a text/icon colour, a `-bg` tint and a `-border`.

| token                 | value     | means                                         |
| --------------------- | --------- | --------------------------------------------- |
| `--state-neutral`     | `#AEB8C2` | A plain fact: missing, queued                 |
| `--state-information` | `#58A6FF` | Under way or worth knowing: on its way        |
| `--state-success`     | `#2EA043` | Done and good: held, saved                    |
| `--state-warning`     | `#F2B233` | Works, but someone should look: firewalled    |
| `--state-error`       | `#F85149` | Failed or blocked, needs action               |

Every text token meets 4.5:1 on every background, and control boundaries
(`--border-control #646C7A`) meet 3:1; `tokens/contrast.test.ts` enforces it.

The `>` chevron is the brand glyph. It is **always** `--cloud-blue` (`#58A6FF`).

## type

- `'JetBrains Mono'` for display, headings, system, code, and brand.
- `'Inter'` for body, prose, and UI labels.
- Type roles (display / h1 / h2 / body / ui / code) carry exact size, weight, and
  letter-spacing in `tokens/tokens.json` — do not eyeball them.

## space

4-base scale only: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64`.

## square frames

`border-radius: 0` on every card, panel, tile, button, input, and dialog. **No
rounded corners.** Icons are the only rounded shape, and that radius is baked into
the icon PNGs — never add radius in CSS.

## voice

Two voices, one per typeface. Monospace is the system's voice, and it is
lowercase: titles, buttons, tabs, navigation, statuses, headers, numbers and
codes. The body face is the reader's language, in sentence case: descriptions,
messages, field labels, hints and errors, and prose. Short copy. No emoji. No
exclamation marks. Terminal / tmux aesthetic.

## source of truth

- Tokens: `tokens/tokens.json` (DTCG) — generates `src/styles/tokens.css`,
  `src/tokens.ts`, and the Tailwind preset.
- Brand reference: `brand/llm.txt`.
- Guidelines (GitHub Pages): https://nalet.github.io/design-system/, with the
  React components at https://nalet.github.io/design-system/react/

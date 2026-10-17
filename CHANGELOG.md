# changelog

the design system follows [semantic versioning](https://semver.org). while it is
0.x, a minor version (0.3.0) may change how existing components look; a patch
(0.3.1) only fixes. every release is a git tag `vX.Y.Z` with the packed tarball
attached to its github release.

## 0.3.0 — 2026-10-17

the foundation for enterprise worklists, and a documentation site that reads
like guidelines.

### added

- **semantic state tokens.** `--state-{neutral,information,success,warning,error}`,
  each with a `-bg` tint and a `-border`. status and messages use only these.
- **control and selection tokens.** `--border-control` (the 3:1 boundary of an
  input, select, textarea, checkbox and the switch track), `--focus-ring` (the
  focus outline, `--cloud-cyan`), `--surface-selected` (a selected row).
- **a contrast policy with a test.** `tokens/contrast.mjs` names every pair that
  must meet wcag 2.2 aa (text 4.5:1 on every background and state tint, non-text
  ui 3:1). `tokens/contrast.test.ts` fails on any pair below it; the token build
  warns; the colour page renders the same table.
- **components:** `ObjectStatus` (+ `defineStates`, `STATE_SEVERITY`),
  `MessageStrip`, `toast()` and `Toaster`, `IllustratedMessage`, `ActionMenu`,
  `Toolbar`, `SelectionToolbar`, `FilterTabs`, `MultiSelect`, `FilterBar`,
  `DataTable` (sorting, selection, grouping, growing, pop-in, row-focus
  keyboard model) and its cells `StatusCell`, `DateCell`, `IdentifierCell`;
  helpers `formatCount`, `relativeDay`, `filterTabId`, `OBJECT_STATES`.
- **pattern:** `Worklist`, the floorplan for lists of things that need doing.
- **tests.** vitest, testing-library and axe-core; `npm test` runs unit,
  accessibility and token-contrast tests, and ci runs it.
- **documentation.** the storybook is now the guidelines site: introduction,
  foundations (colour with the contrast table, typography, space and grid,
  iconography, voice and content, motion, accessibility, brand), a page with
  the same anatomy for every component, grouped by role, and patterns
  (worklist, status vocabulary, message handling, empty states, selection and
  bulk actions, forms and settings, portal).

### changed — visible

- `--fg-dim` is `#7B8597` (was `#6E7787`, 4.0–4.2:1 on the canvas). it now meets
  4.5:1 on every background, `--surface-selected` included.
- input, select, textarea, checkbox and switch boundaries use `--border-control`
  (brighter than `--border-2`), so the control is visible against the page.
- invalid inputs, selects and textareas, and a field's error text, use
  `--state-error` (red) instead of amber: an error reads as an error.
- every focus outline uses `--focus-ring` (same colour as before).
- the tokens declare `color-scheme: dark`, so native controls, scrollbars and form
  widgets render dark on the canvas.
- `Portal` takes a `searchLabel` (default "search apps") that names its search
  landmark and field; several launchers on one page each need their own.

### fixed

- `Modal` no longer pulls focus back to its first element when its parent
  re-renders with a new `onClose`; widgets inside it (an open action menu) get
  `esc` first; `tab` from the dialog itself stays inside.
- `Tabs` move focus with the selection (arrow keys, and now `home` / `end`).
- `Field` sets `aria-invalid` only for an `error`, so a control's own `invalid`
  is kept.
- `Select` keeps the error colour while focused.
- `Portal` search hides non-matching tiles (not only whole groups), and a hidden
  tile never keeps the tab stop.
- `Table` and a `Code` block whose content scrolls sideways become a focusable,
  named region while they overflow, so the keyboard can scroll them.
- `Switch`'s thumb no longer slides under reduced motion.

### planned

- light and high-contrast themes. the system is dark only today.
- font files in the package. load inter and jetbrains mono yourself (see the
  readme).

## 0.2.0 — 2026-10-02

- toolchain on the newest majors: react 19.3, vite 8.3, typescript 7.0,
  storybook 10.6, lucide-react 1.50; ci and pages on node 24.
- `./styles.css` export (the component styles).
- release workflow: a version tag attaches the packed tarball to a github
  release; npm publishing only when an `NPM_TOKEN` secret exists.

## 0.1.0 — 2026-06-14

- first release: tokens (dtcg `tokens/tokens.json` → css, typed tokens, tailwind
  preset), 22 react components, the brand glyphs, storybook.
- later in 0.1.x: the portal launchpad (`Portal`, `Tile`, `TileGroup`,
  `useRovingGrid`) and per-component docs pages.

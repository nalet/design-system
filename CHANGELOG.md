# changelog

The design system follows [semantic versioning](https://semver.org). While it is
0.x, a minor version (0.3.0) may change how existing components look; a patch
(0.3.1) only fixes. Every release is a Git tag `vX.Y.Z` with the packed tarball
attached to its GitHub release.

## unreleased

### documentation

- **Two sites.** The guidelines are a site of their own at `/design-system/`,
  built with Astro and with the design system itself: get started,
  foundations (principles, accessibility, content & voice, interaction,
  layout), styles (colour, typography, iconography, shape, motion, brand),
  a guidance page per component and patterns. The Storybook moved to
  `/design-system/react/` and keeps the implementation: playgrounds, examples,
  implementation notes, props. Each component's two pages link to each other,
  and examples are written once, as stories, and appear on both.
- **Old links keep working.** An old Storybook URL sends itself on to its new
  page, or to the same entry on the React subsite, and a page that was renamed
  keeps its old address, which leads on to the new one.
- **Search** over the guidelines, with Pagefind.
- **Drafts under review:** the principles, and the patterns top bar, app
  navigation, home & tiles, settings and setup, loading and progress, and
  selection and bulk actions. The start page is called home, and its tiles are
  found with the one search, in the top bar; `Portal`'s own search box is for
  a launcher outside a shell.

### changed — names

Three components, and a few words of the guidelines, are called by plain
names. The old component names still work in this release: each is the new
export under its old name, marked `@deprecated`, so an editor strikes it
through. They go in 0.5.0. Class names stay as they are.

- `ObjectStatus` is `Status`, and `ObjectStatusProps` is `StatusProps`. Its
  helpers follow: `ObjectState` is `State`, and `OBJECT_STATES` is `STATES`.
- `MessageStrip` is `Banner`, and `MessageStripProps` is `BannerProps`.
- `IllustratedMessage` is `EmptyState`, `IllustratedMessageProps` is
  `EmptyStateProps`, and `IllustratedMessageSize` is `EmptyStateSize`.
- In the guidelines, the shell bar is the **top bar**, floorplans are **page
  layouts**, and the planned object page is the **detail page**.
- The pages `components/object-status/`, `components/message-strip/`,
  `components/illustrated-message/` and `patterns/shell-bar/` are now
  `components/status/`, `components/banner/`, `components/empty-state/` and
  `patterns/top-bar/`. The old addresses lead on to the new pages, and a link
  to one of the three components on the React subsite, under its old name,
  lands on the same page or story under the new one.

### changed — visible

- **Two voices, one per typeface.** Monospace is the system's voice, and it is
  lowercase: titles and headings, buttons, tabs and navigation, status chips and
  badges, table and column headers, menu items, toolbar and filter labels,
  numbers and codes. Names and codes inside it keep their own case. The body
  face is the reader's language and follows that language's rules, in sentence
  case: descriptions and subtitles, messages, empty-state descriptions, field
  labels, hints and errors, checkbox and switch labels. The brand lives in the
  monospace layer, where text is short and set apart; readability and correct
  spelling in every language live in the layer people read.
- `Field`'s label is no longer lowercased by CSS: it shows what you write, in
  sentence case. `text-transform: lowercase` is now set on monospace chrome
  only, and nothing in the body face is transformed.
- `toast()`'s message is set in Inter, the body face, instead of JetBrains Mono,
  and is written in sentence case: `Settings saved`.
- `Portal`'s built-in no-match message is set in Inter and reads
  `No apps match “…”.`
- `MultiSelect`'s options are set in JetBrains Mono, like the value its trigger
  shows and the options of a `Select`: they are filter values.
- The docs follow the same rule. The guidelines, the React subsite and its props
  tables are written in sentence case, with headings, labels, statuses and other
  monospace samples lowercase; the content & voice page states the rule, with
  examples in English and German. On the guidelines site, "on this page" and the
  search's buttons are set in mono, as navigation and buttons are.
- `Spinner` is a still square frame with three quarters of it lit and the gap
  running round it, one lap in four seconds, instead of a turning ring: the
  frames of the system are square, and only the moving snake says "working".
  Under reduced motion it stands still and its label carries the state.

### fixed

- A loading `Button` or `IconButton` shows its spinner in the label's colour;
  on a primary button the spinner's blue vanished into the fill.

### fixed — on phones

- Text hidden for screen readers inside a box that scrolls sideways (a wide
  table, a code block, a dialog body, filter tabs) no longer widens the page:
  every scroll box is positioned, so the hidden text stays inside it. Before,
  a page with such a table scrolled sideways in Safari and zoomed out in
  Chrome. A test now fails on any scroll box that is not positioned.
- A date cell no longer breaks hydration when the server and the browser
  format the same date differently ("Sept" in one engine, "Sep" in another,
  or a later "today"): React keeps the server's text.

## 0.3.0 — 2026-10-17

The foundation for enterprise worklists, and a documentation site that reads
like guidelines.

### added

- **Semantic state tokens.** `--state-{neutral,information,success,warning,error}`,
  each with a `-bg` tint and a `-border`. Status and messages use only these.
- **Control and selection tokens.** `--border-control` (the 3:1 boundary of an
  input, select, textarea, checkbox and the switch track), `--focus-ring` (the
  focus outline, `--cloud-cyan`), `--surface-selected` (a selected row).
- **A contrast policy with a test.** `tokens/contrast.mjs` names every pair that
  must meet WCAG 2.2 AA (text 4.5:1 on every background and state tint, non-text
  UI 3:1). `tokens/contrast.test.ts` fails on any pair below it; the token build
  warns; the colour page renders the same table.
- **Components:** `ObjectStatus` (+ `defineStates`, `STATE_SEVERITY`),
  `MessageStrip`, `toast()` and `Toaster`, `IllustratedMessage`, `ActionMenu`,
  `Toolbar`, `SelectionToolbar`, `FilterTabs`, `MultiSelect`, `FilterBar`,
  `DataTable` (sorting, selection, grouping, growing, pop-in, row-focus
  keyboard model) and its cells `StatusCell`, `DateCell`, `IdentifierCell`;
  helpers `formatCount`, `relativeDay`, `filterTabId`, `OBJECT_STATES`.
- **Pattern:** `Worklist`, the page layout for lists of things that need doing.
- **Tests.** Vitest, Testing Library and axe-core; `npm test` runs unit,
  accessibility and token-contrast tests, and CI runs it.
- **Documentation.** The Storybook is now the guidelines site: introduction,
  foundations (colour with the contrast table, typography, space and grid,
  iconography, voice and content, motion, accessibility, brand), a page with
  the same anatomy for every component, grouped by role, and patterns
  (worklist, status vocabulary, message handling, empty states, selection and
  bulk actions, forms and settings, portal).

### changed — visible

- `--fg-dim` is `#7B8597` (was `#6E7787`, 4.0–4.2:1 on the canvas). It now meets
  4.5:1 on every background, `--surface-selected` included.
- Input, select, textarea, checkbox and switch boundaries use `--border-control`
  (brighter than `--border-2`), so the control is visible against the page.
- Invalid inputs, selects and textareas, and a field's error text, use
  `--state-error` (red) instead of amber: an error reads as an error.
- Every focus outline uses `--focus-ring` (same colour as before).
- The tokens declare `color-scheme: dark`, so native controls, scrollbars and form
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

- Light and high-contrast themes. The system is dark only today.
- Font files in the package. Load Inter and JetBrains Mono yourself (see the
  README).

## 0.2.0 — 2026-10-02

- Toolchain on the newest majors: React 19.3, Vite 8.3, TypeScript 7.0,
  Storybook 10.6, lucide-react 1.50; CI and Pages on Node 24.
- `./styles.css` export (the component styles).
- Release workflow: a version tag attaches the packed tarball to a GitHub
  release; npm publishing only when an `NPM_TOKEN` secret exists.

## 0.1.0 — 2026-06-14

- First release: tokens (DTCG `tokens/tokens.json` → CSS, typed tokens, Tailwind
  preset), 22 React components, the brand glyphs, Storybook.
- Later in 0.1.x: the portal's home page of tiles (`Portal`, `Tile`,
  `TileGroup`, `useRovingGrid`) and per-component docs pages.

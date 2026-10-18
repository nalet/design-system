// every component of @nalet/design-system, grouped by what it is for. the
// components index, the section navigation and each guidance page's
// "react implementation" link read this list.
import { url, reactDocs } from './site';

export type Role =
  | 'actions'
  | 'inputs'
  | 'data display'
  | 'feedback & status'
  | 'layout & structure'
  | 'overlays'
  | 'navigation';

export const ROLES: { role: Role; summary: string }[] = [
  { role: 'actions', summary: 'Start something on this screen.' },
  { role: 'inputs', summary: 'Take a value, a choice or a filter.' },
  { role: 'data display', summary: 'Show records, values and text.' },
  { role: 'feedback & status', summary: 'Say what is true, what happened, what is under way.' },
  { role: 'layout & structure', summary: 'Space, frames and titles.' },
  { role: 'overlays', summary: 'Content above the page.' },
  { role: 'navigation', summary: 'Move between views and apps.' },
];

export interface ComponentEntry {
  /** the page's slug under /components/. */
  slug: string;
  /** the name as the docs write it: lowercase words. */
  name: string;
  /** what the package exports for it. */
  exports: string[];
  role: Role;
  /** what it is for, in one line. */
  summary: string;
  /** the storybook id of its react page. */
  react: string;
  /**
   * where its design guidance lives. most components have a page of their
   * own; the tile and the tile group share the home & tiles pattern's page.
   */
  guidance?: string;
}

export const COMPONENTS: ComponentEntry[] = [
  // actions
  { slug: 'button', name: 'button', exports: ['Button'], role: 'actions', summary: 'Starts an action on this screen; one emphasized button marks the next step.', react: 'components-actions-button' },
  { slug: 'icon-button', name: 'icon button', exports: ['IconButton'], role: 'actions', summary: 'An action shown as an icon only, with a name for screen readers.', react: 'components-actions-icon-button' },
  { slug: 'action-menu', name: 'action menu', exports: ['ActionMenu'], role: 'actions', summary: 'Several actions behind one button, such as one menu per table row.', react: 'components-actions-action-menu' },
  { slug: 'toolbar', name: 'toolbar and selection toolbar', exports: ['Toolbar', 'SelectionToolbar'], role: 'actions', summary: 'Actions above the content they act on; the selection toolbar acts on the selected rows.', react: 'components-actions-toolbar' },

  // inputs
  { slug: 'input', name: 'input', exports: ['Input'], role: 'inputs', summary: 'One line of text.', react: 'components-inputs-input' },
  { slug: 'textarea', name: 'textarea', exports: ['Textarea'], role: 'inputs', summary: 'Several lines of text.', react: 'components-inputs-textarea' },
  { slug: 'select', name: 'select', exports: ['Select'], role: 'inputs', summary: 'One value picked from a short list.', react: 'components-inputs-select' },
  { slug: 'multi-select', name: 'multi select', exports: ['MultiSelect'], role: 'inputs', summary: 'Several values of one filter, as checkboxes in a panel that opens.', react: 'components-inputs-multi-select' },
  { slug: 'checkbox', name: 'checkbox', exports: ['Checkbox'], role: 'inputs', summary: 'An option that is saved with a form, with a mixed state for “some of these”.', react: 'components-inputs-checkbox' },
  { slug: 'switch', name: 'switch', exports: ['Switch'], role: 'inputs', summary: 'A setting that takes effect at once.', react: 'components-inputs-switch' },
  { slug: 'field', name: 'field', exports: ['Field'], role: 'inputs', summary: 'A label, a hint and an error, joined to one control.', react: 'components-inputs-field' },
  { slug: 'filter-bar', name: 'filter bar', exports: ['FilterBar'], role: 'inputs', summary: 'Search, filters, “clear all”, and the count of what is left.', react: 'components-inputs-filter-bar' },

  // data display
  { slug: 'data-table', name: 'data table', exports: ['DataTable'], role: 'data display', summary: 'A list people work through: they sort it, select rows, open groups and load more.', react: 'components-data-display-data-table' },
  { slug: 'table-cells', name: 'table cells', exports: ['StatusCell', 'DateCell', 'IdentifierCell'], role: 'data display', summary: 'A status with its reason, a date said both ways, an identifier.', react: 'components-data-display-table-cells' },
  { slug: 'table', name: 'table', exports: ['Table'], role: 'data display', summary: 'A simple table for a short list that people only read.', react: 'components-data-display-table' },
  { slug: 'badge', name: 'badge', exports: ['Badge'], role: 'data display', summary: 'A label, a count, a tag: not a status.', react: 'components-data-display-badge' },
  { slug: 'text', name: 'text', exports: ['Text'], role: 'data display', summary: 'Text in one of the text styles.', react: 'components-data-display-text' },
  { slug: 'code', name: 'code', exports: ['Code'], role: 'data display', summary: 'Code and commands, inside a sentence or as a block.', react: 'components-data-display-code' },
  { slug: 'kbd', name: 'kbd', exports: ['Kbd'], role: 'data display', summary: 'A key to press.', react: 'components-data-display-kbd' },

  // feedback & status
  { slug: 'object-status', name: 'object status', exports: ['ObjectStatus', 'defineStates', 'STATE_SEVERITY'], role: 'feedback & status', summary: 'The state of one thing, with one of five meanings.', react: 'components-feedback-status-object-status' },
  { slug: 'message-strip', name: 'message strip', exports: ['MessageStrip'], role: 'feedback & status', summary: 'A message about the page or the list that stays for as long as it is true.', react: 'components-feedback-status-message-strip' },
  { slug: 'toast', name: 'toast', exports: ['toast', 'Toaster'], role: 'feedback & status', summary: 'A short confirmation of an action just taken.', react: 'components-feedback-status-toast' },
  { slug: 'illustrated-message', name: 'illustrated message', exports: ['IllustratedMessage'], role: 'feedback & status', summary: "What a list shows when it is empty, done, has no matches, failed or can't be known.", react: 'components-feedback-status-illustrated-message' },
  { slug: 'spinner', name: 'spinner', exports: ['Spinner'], role: 'feedback & status', summary: 'Something is loading, where nothing better shows it.', react: 'components-feedback-status-spinner' },

  // layout & structure
  { slug: 'box', name: 'box', exports: ['Box'], role: 'layout & structure', summary: 'Padding and a canvas background.', react: 'components-layout-structure-box' },
  { slug: 'stack', name: 'stack', exports: ['Stack'], role: 'layout & structure', summary: 'A row or a column with a gap from the space scale.', react: 'components-layout-structure-stack' },
  { slug: 'divider', name: 'divider', exports: ['Divider'], role: 'layout & structure', summary: 'A thin line between two parts of a page.', react: 'components-layout-structure-divider' },
  { slug: 'card', name: 'card', exports: ['Card'], role: 'layout & structure', summary: 'A framed panel with an optional header and footer.', react: 'components-layout-structure-card' },
  { slug: 'heading', name: 'heading', exports: ['Heading'], role: 'layout & structure', summary: 'A page or a section title.', react: 'components-layout-structure-heading' },

  // overlays
  { slug: 'modal', name: 'modal', exports: ['Modal'], role: 'overlays', summary: 'A decision that blocks the page until it is made.', react: 'components-overlays-modal' },
  { slug: 'tooltip', name: 'tooltip', exports: ['Tooltip'], role: 'overlays', summary: 'A short label for something that has no room for one.', react: 'components-overlays-tooltip' },

  // navigation
  { slug: 'tabs', name: 'tabs', exports: ['Tabs'], role: 'navigation', summary: 'Switch between the parts of one thing.', react: 'components-navigation-tabs' },
  { slug: 'filter-tabs', name: 'filter tabs', exports: ['FilterTabs'], role: 'navigation', summary: 'Counts at the top of a list that also filter it.', react: 'components-navigation-filter-tabs' },
  { slug: 'tile', name: 'tile', exports: ['Tile'], role: 'navigation', summary: 'A square on the home page that opens an app, or shows a key figure.', react: 'components-navigation-tile', guidance: 'patterns/home-and-tiles/#the-tile' },
  { slug: 'tile-group', name: 'tile group', exports: ['TileGroup'], role: 'navigation', summary: 'A titled grid of tiles.', react: 'components-navigation-tile-group', guidance: 'patterns/home-and-tiles/#tile-groups' },
];

/**
 * the components that have a guidance page of their own here: every
 * site/src/pages/components/<slug>.mdx. a component without one links to its
 * react page instead.
 */
export const GUIDANCE_PAGES = new Set(
  Object.keys(import.meta.glob('../pages/components/*.mdx')).map((path) => path.replace(/^.*\/|\.mdx$/g, '')),
);

/** where a component's design guidance is read. */
export function guidanceHref(c: ComponentEntry): string {
  if (c.guidance) return url(c.guidance);
  if (GUIDANCE_PAGES.has(c.slug)) return url(`components/${c.slug}/`);
  return reactDocs(c.react);
}

export const reactHref = (c: ComponentEntry) => reactDocs(c.react);

export const bySlug = (slug: string) => {
  const c = COMPONENTS.find((x) => x.slug === slug);
  if (!c) throw new Error(`no component "${slug}" in site/src/data/components.ts`);
  return c;
};

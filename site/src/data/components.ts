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
  { role: 'actions', summary: 'start something on this screen.' },
  { role: 'inputs', summary: 'take a value, a choice or a filter.' },
  { role: 'data display', summary: 'show records, values and text.' },
  { role: 'feedback & status', summary: 'say what is true, what happened, what is under way.' },
  { role: 'layout & structure', summary: 'space, frames and titles.' },
  { role: 'overlays', summary: 'content above the page.' },
  { role: 'navigation', summary: 'move between views and apps.' },
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
   * own; the tile and the tile group share the launchpad pattern's page.
   */
  guidance?: string;
}

export const COMPONENTS: ComponentEntry[] = [
  // actions
  { slug: 'button', name: 'button', exports: ['Button'], role: 'actions', summary: 'an action on this screen; primary is the one emphasized action.', react: 'components-actions-button' },
  { slug: 'icon-button', name: 'icon button', exports: ['IconButton'], role: 'actions', summary: 'the same action with an icon only, and a required name.', react: 'components-actions-icon-button' },
  { slug: 'action-menu', name: 'action menu', exports: ['ActionMenu'], role: 'actions', summary: 'several actions behind one trigger, such as one menu per table row.', react: 'components-actions-action-menu' },
  { slug: 'toolbar', name: 'toolbar and selection toolbar', exports: ['Toolbar', 'SelectionToolbar'], role: 'actions', summary: 'actions above the content they act on; the selection toolbar follows the selection.', react: 'components-actions-toolbar' },

  // inputs
  { slug: 'input', name: 'input', exports: ['Input'], role: 'inputs', summary: 'one line of text.', react: 'components-inputs-input' },
  { slug: 'textarea', name: 'textarea', exports: ['Textarea'], role: 'inputs', summary: 'several lines of text.', react: 'components-inputs-textarea' },
  { slug: 'select', name: 'select', exports: ['Select'], role: 'inputs', summary: 'one value from a list, native.', react: 'components-inputs-select' },
  { slug: 'multi-select', name: 'multi select', exports: ['MultiSelect'], role: 'inputs', summary: 'several values of a facet, as checkboxes in a disclosure.', react: 'components-inputs-multi-select' },
  { slug: 'checkbox', name: 'checkbox', exports: ['Checkbox'], role: 'inputs', summary: 'an option that is saved with a form; indeterminate for a partial group.', react: 'components-inputs-checkbox' },
  { slug: 'switch', name: 'switch', exports: ['Switch'], role: 'inputs', summary: 'a setting that takes effect at once.', react: 'components-inputs-switch' },
  { slug: 'field', name: 'field', exports: ['Field'], role: 'inputs', summary: 'a label, a hint and an error wired to one control.', react: 'components-inputs-field' },
  { slug: 'filter-bar', name: 'filter bar', exports: ['FilterBar'], role: 'inputs', summary: 'search, facets, clear all and the count of what is left.', react: 'components-inputs-filter-bar' },

  // data display
  { slug: 'data-table', name: 'data table', exports: ['DataTable'], role: 'data display', summary: 'an interactive list: sort, select, group, grow, keyboard rows.', react: 'components-data-display-data-table' },
  { slug: 'table-cells', name: 'table cells', exports: ['StatusCell', 'DateCell', 'IdentifierCell'], role: 'data display', summary: 'a status with its reason, a date said both ways, an identifier.', react: 'components-data-display-table-cells' },
  { slug: 'table', name: 'table', exports: ['Table'], role: 'data display', summary: 'a static, presentational table.', react: 'components-data-display-table' },
  { slug: 'badge', name: 'badge', exports: ['Badge'], role: 'data display', summary: 'a label, a count, a tag: not a status.', react: 'components-data-display-badge' },
  { slug: 'text', name: 'text', exports: ['Text'], role: 'data display', summary: 'copy at one of the type roles.', react: 'components-data-display-text' },
  { slug: 'code', name: 'code', exports: ['Code'], role: 'data display', summary: 'inline code or a code block.', react: 'components-data-display-code' },
  { slug: 'kbd', name: 'kbd', exports: ['Kbd'], role: 'data display', summary: 'a key to press.', react: 'components-data-display-kbd' },

  // feedback & status
  { slug: 'object-status', name: 'object status', exports: ['ObjectStatus', 'defineStates', 'STATE_SEVERITY'], role: 'feedback & status', summary: 'the state of one object, in one of five semantic states.', react: 'components-feedback-status-object-status' },
  { slug: 'message-strip', name: 'message strip', exports: ['MessageStrip'], role: 'feedback & status', summary: "a lasting condition of the page's content, with actions and details.", react: 'components-feedback-status-message-strip' },
  { slug: 'toast', name: 'toast', exports: ['toast', 'Toaster'], role: 'feedback & status', summary: 'a short confirmation of an action just taken.', react: 'components-feedback-status-toast' },
  { slug: 'illustrated-message', name: 'illustrated message', exports: ['IllustratedMessage'], role: 'feedback & status', summary: 'empty, done, no-match, error and unknown states.', react: 'components-feedback-status-illustrated-message' },
  { slug: 'spinner', name: 'spinner', exports: ['Spinner'], role: 'feedback & status', summary: 'something is loading, where nothing better shows it.', react: 'components-feedback-status-spinner' },

  // layout & structure
  { slug: 'box', name: 'box', exports: ['Box'], role: 'layout & structure', summary: 'padding and a canvas background.', react: 'components-layout-structure-box' },
  { slug: 'stack', name: 'stack', exports: ['Stack'], role: 'layout & structure', summary: 'a row or a column with a gap from the space scale.', react: 'components-layout-structure-stack' },
  { slug: 'divider', name: 'divider', exports: ['Divider'], role: 'layout & structure', summary: 'a hairline between regions.', react: 'components-layout-structure-divider' },
  { slug: 'card', name: 'card', exports: ['Card'], role: 'layout & structure', summary: 'a framed panel with an optional header and footer.', react: 'components-layout-structure-card' },
  { slug: 'heading', name: 'heading', exports: ['Heading'], role: 'layout & structure', summary: 'a page or a section title.', react: 'components-layout-structure-heading' },

  // overlays
  { slug: 'modal', name: 'modal', exports: ['Modal'], role: 'overlays', summary: 'a decision that blocks the page until it is made.', react: 'components-overlays-modal' },
  { slug: 'tooltip', name: 'tooltip', exports: ['Tooltip'], role: 'overlays', summary: 'a short label for something that has no room for one.', react: 'components-overlays-tooltip' },

  // navigation
  { slug: 'tabs', name: 'tabs', exports: ['Tabs'], role: 'navigation', summary: 'switching between views of one thing.', react: 'components-navigation-tabs' },
  { slug: 'filter-tabs', name: 'filter tabs', exports: ['FilterTabs'], role: 'navigation', summary: 'key figures that filter one list.', react: 'components-navigation-filter-tabs' },
  { slug: 'tile', name: 'tile', exports: ['Tile'], role: 'navigation', summary: 'a launch tile: an app, or a key figure.', react: 'components-navigation-tile', guidance: 'patterns/launchpad-and-tiles/#the-tile' },
  { slug: 'tile-group', name: 'tile group', exports: ['TileGroup'], role: 'navigation', summary: 'a titled grid of tiles.', react: 'components-navigation-tile-group', guidance: 'patterns/launchpad-and-tiles/#tile-groups' },
];

/**
 * the components whose guidance page has moved to this site. until a page is
 * here, its card links to the component's react page, which still carries it.
 */
export const GUIDANCE_PAGES = new Set<string>([]);

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

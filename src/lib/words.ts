/**
 * words — every word a component brings itself, one set per language.
 *
 * A page gives its language once (`<Language>` or the `lang` of its root
 * element), and each component takes its own words from the set for that
 * language. English and German are built in; a page with another language, or
 * with words of its own, passes them to `<Language words={…}>`.
 *
 * How the sets are written:
 * - One block per component, named after it. A component reads only its own
 *   block.
 * - A text is whole: it is never put together from parts. Where a value goes
 *   into it, the text names the place in braces: "select {name}".
 * - A text that counts is a `Counted`: one form for each number the language
 *   tells apart, chosen by `Intl.PluralRules`, with `{n}` where the count goes.
 * - Monospace chrome is written in lowercase, as it is read. A sentence in the
 *   body face follows the language's own rules for capitals.
 */

/** A text that counts: a form for each plural category the language has. `other` is always there. */
export type Counted = Partial<Record<'zero' | 'one' | 'two' | 'few' | 'many', string>> & { other: string };

export interface Words {
  // ---- existing components -------------------------------------------------
  actionMenu: Record<string, never>;
  banner: {
    /** The button that shows a banner's details. */
    details: string;
    /** The button that closes a banner. */
    dismiss: string;
    /** What a screen reader hears before the message, the state's name: "{state}:". */
    stateBefore: string;
    /** The states' names, as that place takes them. A neutral banner has none. */
    information: string;
    success: string;
    warning: string;
    error: string;
  };
  dataTable: {
    /** The header checkbox. */
    selectAllVisible: string;
    /** A row's checkbox, for a screen reader: "select {name}". */
    selectRow: string;
    /** The same for a table that gives its rows no names. */
    selectUnnamedRow: string;
    /** A group row that is given no label of its own, its name and how many rows it holds: "{name} · {n}". */
    group: string;
    /** Under a table that grows: "{shown} of {total}". */
    shownOfTotal: string;
    /** The button that shows the next rows: "show {n} more". */
    showMore: Counted;
  };
  dateCell: {
    /** What a screen reader says for an empty date. */
    noDate: string;
  };
  emptyState: Record<string, never>;
  filterBar: {
    /** The button the facets fold behind, and the group's name. */
    filters: string;
    /** That button when facets are set: "filters · {n}". */
    filtersActive: string;
  };
  iconButton: Record<string, never>;
  modal: {
    /** The close button's name. */
    close: string;
  };
  multiSelect: {
    /** What a multi select shows with nothing chosen. */
    any: string;
  };
  portal: {
    /** The search field's name. */
    search: string;
    /** The search field's placeholder. */
    searchPlaceholder: string;
    /** What a screen reader hears while people search: "{n} apps match". */
    matches: Counted;
    /** The sentence shown when the search matches nothing: "No apps match “{query}”." */
    noMatch: string;
  };
  select: Record<string, never>;
  spinner: {
    /** The loader's name for a screen reader. */
    loading: string;
  };
  switch: Record<string, never>;
  table: {
    /** A table without rows. */
    empty: string;
    /** The name of a table that scrolls sideways and has no name of its own. */
    region: string;
  };
  tabs: Record<string, never>;
  tile: {
    /** A tile's status dot, for a screen reader: "status: {status}". */
    status: string;
    /** The four statuses, as that place takes them. */
    online: string;
    offline: string;
    degraded: string;
    unknown: string;
  };
  toast: {
    /** The name of the region the toasts appear in. */
    region: string;
  };
  toolbar: {
    /** The button that holds the actions that don't fit. */
    more: string;
    /** The button that clears the selection. */
    clear: string;
    /** The selection toolbar's heading: "{n} selected". */
    selected: Counted;
    /** What a screen reader hears when the selection goes back to nothing. */
    selectionCleared: string;
  };
  // the other existing parts that bring a word, in a group of their own.
  chevron: {
    /** The brand glyph's name, where it isn't decoration. */
    name: string;
  };
  code: {
    /** The name of a code block that scrolls sideways. */
    region: string;
  };
  status: {
    /** What a screen reader hears before the text, the state's name: "{state}:". */
    stateBefore: string;
    /** The two states that are named, as that place takes them. */
    warning: string;
    error: string;
  };
  worklist: {
    /** The name of the tabs that filter the list. */
    tabs: string;
  };

  // ---- new components: each fills its own block ------------------------------
  navigation: Record<string, never>;
  progressBar: Record<string, never>;
  sheet: Record<string, never>;
  slider: Record<string, never>;
  stepper: Record<string, never>;
  topBar: Record<string, never>;
  userMenu: Record<string, never>;
}

export const english: Words = {
  actionMenu: {},
  banner: {
    details: 'details',
    dismiss: 'dismiss',
    stateBefore: '{state}:',
    information: 'information',
    success: 'success',
    warning: 'warning',
    error: 'error',
  },
  dataTable: {
    selectAllVisible: 'select every visible row',
    selectRow: 'select {name}',
    selectUnnamedRow: 'select row',
    group: '{name} · {n}',
    shownOfTotal: '{shown} of {total}',
    showMore: { one: 'show {n} more', other: 'show {n} more' },
  },
  dateCell: {
    noDate: 'no date',
  },
  emptyState: {},
  filterBar: {
    filters: 'filters',
    filtersActive: 'filters · {n}',
  },
  iconButton: {},
  modal: {
    close: 'close',
  },
  multiSelect: {
    any: 'any',
  },
  portal: {
    search: 'search apps',
    searchPlaceholder: 'search apps…',
    matches: { one: '{n} app match', other: '{n} apps match' },
    noMatch: 'No apps match “{query}”.',
  },
  select: {},
  spinner: {
    loading: 'loading',
  },
  switch: {},
  table: {
    empty: 'no rows',
    region: 'table',
  },
  tabs: {},
  tile: {
    status: 'status: {status}',
    online: 'online',
    offline: 'offline',
    degraded: 'degraded',
    unknown: 'unknown',
  },
  toast: {
    region: 'notifications',
  },
  toolbar: {
    more: 'more actions',
    clear: 'clear',
    selected: { one: '{n} selected', other: '{n} selected' },
    selectionCleared: 'selection cleared',
  },
  chevron: {
    name: 'chevron',
  },
  code: {
    region: 'code',
  },
  status: {
    stateBefore: '{state}:',
    warning: 'warning',
    error: 'error',
  },
  worklist: {
    tabs: 'filter the list',
  },

  navigation: {},
  progressBar: {},
  sheet: {},
  slider: {},
  stepper: {},
  topBar: {},
  userMenu: {},
};

export const german: Words = {
  actionMenu: {},
  banner: {
    details: 'details',
    dismiss: 'ausblenden',
    stateBefore: '{state}:',
    information: 'hinweis',
    success: 'erfolg',
    warning: 'warnung',
    error: 'fehler',
  },
  dataTable: {
    selectAllVisible: 'alle sichtbaren zeilen auswählen',
    selectRow: '{name} auswählen',
    selectUnnamedRow: 'zeile auswählen',
    group: '{name} · {n}',
    shownOfTotal: '{shown} von {total}',
    showMore: { one: '{n} weitere anzeigen', other: '{n} weitere anzeigen' },
  },
  dateCell: {
    noDate: 'kein datum',
  },
  emptyState: {},
  filterBar: {
    filters: 'filter',
    filtersActive: 'filter · {n}',
  },
  iconButton: {},
  modal: {
    close: 'schließen',
  },
  multiSelect: {
    any: 'alle',
  },
  portal: {
    search: 'apps suchen',
    searchPlaceholder: 'apps suchen…',
    matches: { one: '{n} app gefunden', other: '{n} apps gefunden' },
    noMatch: 'Keine App passt zu „{query}“.',
  },
  select: {},
  spinner: {
    loading: 'lädt',
  },
  switch: {},
  table: {
    empty: 'keine zeilen',
    region: 'tabelle',
  },
  tabs: {},
  tile: {
    status: 'status: {status}',
    online: 'online',
    offline: 'offline',
    degraded: 'beeinträchtigt',
    unknown: 'unbekannt',
  },
  toast: {
    region: 'benachrichtigungen',
  },
  toolbar: {
    more: 'weitere aktionen',
    clear: 'aufheben',
    selected: { one: '{n} ausgewählt', other: '{n} ausgewählt' },
    selectionCleared: 'auswahl aufgehoben',
  },
  chevron: {
    name: 'chevron',
  },
  code: {
    region: 'code',
  },
  status: {
    stateBefore: '{state}:',
    warning: 'warnung',
    error: 'fehler',
  },
  worklist: {
    tabs: 'liste filtern',
  },

  navigation: {},
  progressBar: {},
  sheet: {},
  slider: {},
  stepper: {},
  topBar: {},
  userMenu: {},
};

/** The sets the package brings, by language. */
export const builtInWords: Readonly<Record<string, Words>> = { en: english, de: german };

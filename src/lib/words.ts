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
  };
  dataTable: {
    /** The header checkbox. */
    selectAllVisible: string;
    /** A row's checkbox, for a screen reader: "select {name}". */
    selectRow: string;
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
  };
  tabs: Record<string, never>;
  tile: {
    /** A tile's status dot, for a screen reader: "status: {status}". */
    status: string;
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
  };

  // ---- new components: each fills its own block ------------------------------
  navigation: Record<string, never>;
  progressBar: Record<string, never>;
  sheet: Record<string, never>;
  slider: Record<string, never>;
  stepper: Record<string, never>;
  topBar: {
    /** The product's name as a link, named after where it goes: "{product}, home". */
    home: string;
    /** The search field's name where the app gives none, and the name of the icon it folds into. */
    search: string;
    /** The search field's placeholder, from its name: "{label}…". */
    searchPlaceholder: string;
    /** The button that closes the search a narrow bar opened. */
    closeSearch: string;
    /** The name of the list of results under the search. */
    resultList: string;
    /** What a screen reader hears while someone types: "{n} results". */
    results: Counted;
    /** The list's one line when nothing was found. */
    noResults: string;
    /** The bell's name with nothing unread. */
    notifications: string;
    /** The bell's name with its count: "notifications, {n} unread". */
    unread: Counted;
  };
  userMenu: {
    /** The avatar button's name, what it shows and what it opens: "{who}, user menu". */
    label: string;
    /** The last item. */
    signOut: string;
  };
}

export const english: Words = {
  actionMenu: {},
  banner: {
    details: 'details',
    dismiss: 'dismiss',
  },
  dataTable: {
    selectAllVisible: 'select every visible row',
    selectRow: 'select {name}',
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
  },
  select: {},
  spinner: {
    loading: 'loading',
  },
  switch: {},
  table: {
    empty: 'no rows',
  },
  tabs: {},
  tile: {
    status: 'status: {status}',
  },
  toast: {
    region: 'notifications',
  },
  toolbar: {
    more: 'more actions',
    clear: 'clear',
    selected: { one: '{n} selected', other: '{n} selected' },
  },

  navigation: {},
  progressBar: {},
  sheet: {},
  slider: {},
  stepper: {},
  topBar: {
    home: '{product}, home',
    search: 'search',
    searchPlaceholder: '{label}…',
    closeSearch: 'close search',
    resultList: 'results',
    results: { one: '{n} result', other: '{n} results' },
    noResults: 'no results',
    notifications: 'notifications',
    unread: { one: 'notifications, {n} unread', other: 'notifications, {n} unread' },
  },
  userMenu: {
    label: '{who}, user menu',
    signOut: 'sign out',
  },
};

export const german: Words = {
  actionMenu: {},
  banner: {
    details: 'details',
    dismiss: 'ausblenden',
  },
  dataTable: {
    selectAllVisible: 'alle sichtbaren zeilen auswählen',
    selectRow: '{name} auswählen',
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
  },
  select: {},
  spinner: {
    loading: 'lädt',
  },
  switch: {},
  table: {
    empty: 'keine zeilen',
  },
  tabs: {},
  tile: {
    status: 'status: {status}',
  },
  toast: {
    region: 'benachrichtigungen',
  },
  toolbar: {
    more: 'weitere aktionen',
    clear: 'aufheben',
    selected: { one: '{n} ausgewählt', other: '{n} ausgewählt' },
  },

  navigation: {},
  progressBar: {},
  sheet: {},
  slider: {},
  stepper: {},
  topBar: {
    home: '{product}, startseite',
    search: 'suchen',
    searchPlaceholder: '{label}…',
    closeSearch: 'suche schließen',
    resultList: 'ergebnisse',
    results: { one: '{n} ergebnis', other: '{n} ergebnisse' },
    noResults: 'keine ergebnisse',
    notifications: 'benachrichtigungen',
    unread: { one: 'benachrichtigungen, {n} ungelesen', other: 'benachrichtigungen, {n} ungelesen' },
  },
  userMenu: {
    label: '{who}, benutzermenü',
    signOut: 'abmelden',
  },
};

/** The sets the package brings, by language. */
export const builtInWords: Readonly<Record<string, Words>> = { en: english, de: german };

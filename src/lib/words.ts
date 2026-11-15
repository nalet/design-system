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
  progressBar: {
    /** The share that is done: "{n}%". */
    percent: string;
    /** Under the bar, the share and the amount: "{percent} · {amount}". */
    valueWithAmount: string;
    /** The same for a screen reader: "{percent}, {amount}". */
    spokenWithAmount: string;
    /** Under a bar that is paused: "paused · {percent}". */
    paused: string;
    /** The same for a screen reader: "paused, {percent}". */
    pausedSpoken: string;
    /** A bar that failed, for a screen reader, and under it where the app gives no message: "stopped at {percent}". */
    failed: string;
    /** The button that stops the work. */
    cancel: string;
    /** The button that pauses the work. */
    pause: string;
    /** The button that takes paused work up again. */
    resume: string;
    /** The button that starts failed work again. */
    tryAgain: string;
  };
  sheet: Record<string, never>;
  slider: Record<string, never>;
  stepper: {
    /** The minus button's name, where the app gives none. */
    minus: string;
    /** The plus button's name, where the app gives none. */
    plus: string;
  };
  topBar: Record<string, never>;
  userMenu: Record<string, never>;
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
  progressBar: {
    percent: '{n}%',
    valueWithAmount: '{percent} · {amount}',
    spokenWithAmount: '{percent}, {amount}',
    paused: 'paused · {percent}',
    pausedSpoken: 'paused, {percent}',
    failed: 'stopped at {percent}',
    cancel: 'cancel',
    pause: 'pause',
    resume: 'resume',
    tryAgain: 'try again',
  },
  sheet: {},
  slider: {},
  stepper: {
    minus: 'less',
    plus: 'more',
  },
  topBar: {},
  userMenu: {},
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
  progressBar: {
    // a no-break space stands between the number and the sign
    percent: '{n}\u00a0%',
    valueWithAmount: '{percent} · {amount}',
    spokenWithAmount: '{percent}, {amount}',
    paused: 'pausiert · {percent}',
    pausedSpoken: 'pausiert, {percent}',
    failed: 'bei {percent} angehalten',
    cancel: 'abbrechen',
    pause: 'pausieren',
    resume: 'fortsetzen',
    tryAgain: 'erneut versuchen',
  },
  sheet: {},
  slider: {},
  stepper: {
    minus: 'weniger',
    plus: 'mehr',
  },
  topBar: {},
  userMenu: {},
};

/** The sets the package brings, by language. */
export const builtInWords: Readonly<Record<string, Words>> = { en: english, de: german };

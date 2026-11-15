import * as React from 'react';
import { cx } from '../../lib/cx';
import { counted, fill, formatCount, useLanguage } from '../../lib/language';
import { useElementWidth } from '../../lib/useElementWidth';
import { Chevron } from '../../brand/Chevron/Chevron';
import '../../lib/a11y.css';
import './TopBar.css';

export interface TopBarResult {
  id: string;
  /** What was found: an app's name, or the name of a thing inside one. */
  label: React.ReactNode;
  /** Quieter words after the name: what kind of thing it is, or where it is. */
  detail?: React.ReactNode;
  /** A leading icon (decoration). */
  icon?: React.ReactNode;
  /** The page the result leads to. The row is then a link, and opens in a new tab like one. */
  href?: string;
  /** Runs when the result is chosen. */
  onSelect?: () => void;
}

export interface TopBarResultGroup {
  /** The group's title, lowercase: "apps". A list of one kind needs none. */
  title?: string;
  results: TopBarResult[];
}

export interface TopBarSearch {
  /** What is typed in the field. The bar doesn't search: the app does, from this. */
  value: string;
  onChange: (value: string) => void;
  /**
   * Names the search and its field after what it finds: "search apps". The
   * placeholder is the same words with an ellipsis. Default "search".
   */
  label?: string;
  /** The field's placeholder, where the name with an ellipsis isn't it. */
  placeholder?: string;
  /**
   * The short list under the field, which the app fills: the apps first, then
   * the things found inside them. Give it on every screen but the one that
   * answers the search itself, as the home page's tiles do. An empty list
   * under a typed word says "no results".
   */
  results?: TopBarResultGroup[];
  /**
   * How many results there are, for a screen reader: "3 results". Default:
   * the rows of the list. Give it where the list shows only the first of
   * them, or where the page answers instead of a list.
   */
  resultCount?: number;
  /** Enter in the field, with no result picked from the list. */
  onSubmit?: (value: string) => void;
}

export interface TopBarProps extends React.HTMLAttributes<HTMLElement> {
  /** The product's name, lowercase, as on its tile. It leads home. */
  product: string;
  /** Where the product's name leads: the home page. Default "/". */
  homeHref?: string;
  /** A press on the product's name, for an app that routes itself. */
  onHomeClick?: React.MouseEventHandler<HTMLAnchorElement>;
  /**
   * The open app's name, the same word as on its tile. It follows the
   * product's name after a slash. A narrow bar has room for the product's
   * name alone; there the app's own header says where people are.
   */
  app?: React.ReactNode;
  /** The one search. Without it the bar has none. */
  search?: TopBarSearch;
  /**
   * Where the search sits. "end" (the default): just before the
   * notifications, in a bar that starts with names. "start": right after the
   * product's mark, for a product whose views are in a rail; the bar then
   * starts with the mark alone, as wide as the rail under it.
   */
  searchPlacement?: 'start' | 'end';
  /**
   * Below this width of the bar, in px at the usual text size, the search is
   * an icon that opens the field across the whole bar, and the bar starts
   * with the product's name alone. Default 600.
   */
  narrowBelow?: number;
  /** How many notifications are unread. The bell shows the number and says it in its name. */
  unread?: number;
  /** A press on the bell. Without it the bar has no bell. The bar doesn't draw the notifications. */
  onNotifications?: () => void;
  /** Whether the app's notifications are open, for a screen reader. */
  notificationsExpanded?: boolean;
  /** The user menu, at the end of the bar: a `UserMenu`. */
  userMenu?: React.ReactNode;
}

const SearchGlyph = () => (
  <svg className="nc-topbar__glyph" viewBox="0 0 16 16" width="1rem" height="1rem" fill="none" aria-hidden="true" focusable="false">
    <rect x="2.75" y="2.75" width="8" height="8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10.75 10.75 L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
  </svg>
);

const BellGlyph = () => (
  <svg className="nc-topbar__glyph" viewBox="0 0 16 16" width="1rem" height="1rem" fill="none" aria-hidden="true" focusable="false">
    <path d="M4 11.25 V7 A4 4 0 0 1 12 7 V11.25" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2.75 11.25 H13.25 M6.75 13.75 H9.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
  </svg>
);

const CloseGlyph = () => (
  <svg className="nc-topbar__glyph" viewBox="0 0 16 16" width="1rem" height="1rem" fill="none" aria-hidden="true" focusable="false">
    <path d="M4 4 L12 12 M12 4 L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
  </svg>
);

// input types that take no typed text: "/" in one of them still jumps to the search.
const NOT_TYPED = new Set(['checkbox', 'radio', 'button', 'submit', 'reset', 'range', 'color', 'file', 'image']);

/** Whether a key press belongs to something the person is typing in. */
function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  const el = target.closest(
    'input, textarea, select, [contenteditable], [role="textbox"], [role="searchbox"], [role="combobox"]',
  );
  if (!el) return false;
  if (el instanceof HTMLInputElement) return !NOT_TYPED.has(el.type);
  return el.getAttribute('contenteditable') !== 'false';
}

const STOPS = 'a[href], button:not(:disabled), input:not(:disabled), [tabindex="0"]';

/**
 * TopBar — the bar across the top of every screen, the page's header: the
 * product's name, led by the chevron and leading home; the open app's name;
 * the one search; the notifications bell with its unread count; and the user
 * menu. It measures its own width: when it is narrow, the search folds into
 * an icon that opens the field across the whole bar. The bar gives the field
 * and a place for the results; the app searches, and draws its notifications.
 */
export const TopBar = React.forwardRef<HTMLElement, TopBarProps>(function TopBar(
  {
    product,
    homeHref = '/',
    onHomeClick,
    app,
    search,
    searchPlacement = 'end',
    narrowBelow = 600,
    unread = 0,
    onNotifications,
    notificationsExpanded,
    userMenu,
    className,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const { lang, words } = useLanguage();
  const barRef = React.useRef<HTMLElement>(null);
  React.useImperativeHandle(ref, () => barRef.current as HTMLElement);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const searchButtonRef = React.useRef<HTMLButtonElement>(null);
  const listId = React.useId();

  const width = useElementWidth(barRef);
  const narrow = width != null && width < narrowBelow;

  // the narrow bar's field: open once the icon is pressed, and for as long as it holds a word.
  const [searchOpen, setSearchOpen] = React.useState(false);
  const searching = !!search && narrow && (searchOpen || search.value !== '');
  const mark = searchPlacement === 'start' && !narrow;

  // the list under the field: there while the search has the focus, until esc sends it away.
  const [focused, setFocused] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  const [active, setActive] = React.useState<string | null>(null);

  const groups = search?.results;
  const rows = groups?.flatMap((g) => g.results) ?? [];
  const typed = !!search && search.value.trim() !== '';
  const panelOpen = !!groups && focused && !dismissed && (rows.length > 0 || typed);
  // a list only when there is something to pick; with nothing found, the place says so in a line.
  const listOpen = panelOpen && rows.length > 0;
  const activeIndex = listOpen ? rows.findIndex((r) => r.id === active) : -1;
  const optionId = (index: number) => `${listId}-${index}`;

  const count = search?.resultCount ?? (groups ? rows.length : undefined);
  const announcement = typed && count != null ? counted(words.topBar.results, count, lang) : '';

  // where the focus goes once the bar has drawn itself again.
  const focusNext = React.useRef<'input' | 'button' | null>(null);
  React.useLayoutEffect(() => {
    if (focusNext.current === 'input' && inputRef.current) {
      focusNext.current = null;
      inputRef.current.focus();
    } else if (focusNext.current === 'button' && searchButtonRef.current) {
      focusNext.current = null;
      searchButtonRef.current.focus();
    }
  });

  const focusSearch = React.useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    } else {
      focusNext.current = 'input';
      setSearchOpen(true);
    }
  }, []);

  // "/" from anywhere on the page, unless the person is typing somewhere.
  const hasSearch = !!search;
  React.useEffect(() => {
    if (!hasSearch) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
      if (isTyping(e.target)) return;
      // a dialog that blocks the page blocks the bar under it too.
      const modal = document.querySelector('[aria-modal="true"]');
      if (modal && !modal.contains(barRef.current)) return;
      e.preventDefault();
      focusSearch();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [hasSearch, focusSearch]);

  // the way back from the narrow bar's field: empty it, fold it, and return the focus to the icon.
  const closeSearch = () => {
    if (search?.value) search.onChange('');
    setSearchOpen(false);
    setDismissed(false);
    setActive(null);
    focusNext.current = 'button';
  };

  // a chosen result closes the list; in a narrow bar it gives the whole bar back.
  const choose = (result: TopBarResult) => {
    setActive(null);
    if (narrow) closeSearch();
    else setDismissed(true);
    result.onSelect?.();
  };

  const move = (step: 1 | -1) => {
    if (!rows.length) return;
    const next = activeIndex < 0 ? (step === 1 ? 0 : rows.length - 1) : (activeIndex + step + rows.length) % rows.length;
    setActive(rows[next].id);
    document.getElementById(optionId(next))?.scrollIntoView({ block: 'nearest' });
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // keys pressed while a word is being composed belong to the composing.
    if (!search || e.nativeEvent.isComposing) return;
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        if (!groups || !rows.length) return;
        e.preventDefault();
        setDismissed(false);
        move(e.key === 'ArrowDown' ? 1 : -1);
        return;
      case 'Enter':
        if (activeIndex >= 0) {
          e.preventDefault();
          document.getElementById(optionId(activeIndex))?.click();
        } else {
          search.onSubmit?.(search.value);
        }
        return;
      case 'Escape':
        if (panelOpen) {
          setDismissed(true);
          setActive(null);
        } else if (narrow) {
          closeSearch();
        } else if (search.value) {
          search.onChange('');
        } else {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        return;
      default:
    }
  };

  const onSearchBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    setFocused(false);
    setActive(null);
    // an empty field that lost the focus folds back into its icon.
    setSearchOpen(false);
  };

  // on a tv, ← and → move between the bar's own controls; in the field, only from the ends of its text.
  const onBarKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
    const bar = e.currentTarget;
    const target = e.target as HTMLElement;
    if (!bar.closest('[data-nc-screen="tv"]') || target.closest('[role="menu"]')) return;
    if (target instanceof HTMLInputElement) {
      const at = target.selectionStart;
      if (at !== target.selectionEnd || at !== (e.key === 'ArrowLeft' ? 0 : target.value.length)) return;
    }
    const stops = Array.from(bar.querySelectorAll<HTMLElement>(STOPS)).filter(
      (el) => !el.closest('[role="menu"], [role="listbox"]'),
    );
    const next = stops[stops.indexOf(target) + (e.key === 'ArrowRight' ? 1 : -1)];
    if (stops.indexOf(target) < 0 || !next) return;
    e.preventDefault();
    next.focus();
  };

  const homeName = fill(words.topBar.home, { product });
  const searchName = search?.label ?? words.topBar.search;
  const bellName = unread > 0 ? counted(words.topBar.unread, unread, lang) : words.topBar.notifications;

  const option = (result: TopBarResult, index: number) => {
    const shared = {
      id: optionId(index),
      role: 'option' as const,
      'aria-selected': index === activeIndex,
      tabIndex: -1,
      className: cx('nc-topbar__result', index === activeIndex && 'nc-topbar__result--active'),
      onClick: () => choose(result),
    };
    const content = (
      <>
        {result.icon ? (
          <span className="nc-topbar__result-icon" aria-hidden="true">
            {result.icon}
          </span>
        ) : null}
        <span className="nc-topbar__result-label">{result.label}</span>
        {result.detail != null ? <span className="nc-topbar__result-detail">{result.detail}</span> : null}
      </>
    );
    return result.href != null ? (
      <a key={result.id} href={result.href} {...shared}>
        {content}
      </a>
    ) : (
      <div key={result.id} {...shared}>
        {content}
      </div>
    );
  };

  let index = 0;
  const list = listOpen && groups ? (
    <div
      id={listId}
      role="listbox"
      aria-label={words.topBar.resultList}
      className="nc-topbar__results"
      // a press on a result keeps the focus in the field.
      onMouseDown={(e) => e.preventDefault()}
    >
      {groups.map((group, g) =>
        group.title ? (
          <div key={group.title} role="group" aria-labelledby={`${listId}-g${g}`} className="nc-topbar__group">
            <div id={`${listId}-g${g}`} className="nc-topbar__group-title">
              {group.title}
            </div>
            {group.results.map((result) => option(result, index++))}
          </div>
        ) : (
          group.results.map((result) => option(result, index++))
        ),
      )}
    </div>
  ) : panelOpen ? (
    <div className="nc-topbar__results">
      <div className="nc-topbar__none">{words.topBar.noResults}</div>
    </div>
  ) : null;

  const parts: React.ReactNode[] = [];

  if (!searching) {
    parts.push(
      mark ? (
        <a key="home" className="nc-topbar__mark" href={homeHref} aria-label={homeName} title={homeName} onClick={onHomeClick}>
          <Chevron size={16} aria-hidden />
          <span className="nc-topbar__letter" aria-hidden="true">
            {Array.from(product.trim())[0] ?? ''}
          </span>
        </a>
      ) : (
        <div key="names" className="nc-topbar__names">
          <a className="nc-topbar__home" href={homeHref} aria-label={homeName} onClick={onHomeClick}>
            <Chevron size={16} aria-hidden />
            <span className="nc-topbar__product">{product}</span>
          </a>
          {app != null && app !== false && !narrow ? (
            <span className="nc-topbar__app">
              <span className="nc-topbar__slash" aria-hidden="true">
                /
              </span>
              <span className="nc-topbar__app-name">{app}</span>
            </span>
          ) : null}
        </div>
      ),
    );
  }

  const searchRegion = search ? (
    <div
      key="search"
      className="nc-topbar__search"
      role="search"
      aria-label={searchName}
      onFocus={() => {
        setFocused(true);
        // a field that has the focus stays, even when its last letter goes.
        setSearchOpen(true);
      }}
      onBlur={onSearchBlur}
    >
      <div
        className="nc-topbar__field"
        // a press beside the text, on the glyph or in the field's touch area, lands in the field.
        onMouseDown={(e) => {
          if (e.target === inputRef.current) return;
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <SearchGlyph />
        <input
          ref={inputRef}
          className="nc-topbar__input"
          type="text"
          role={groups ? 'combobox' : 'searchbox'}
          aria-label={searchName}
          aria-autocomplete={groups ? 'list' : undefined}
          aria-expanded={groups ? listOpen : undefined}
          aria-controls={listOpen ? listId : undefined}
          aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
          placeholder={search.placeholder ?? fill(words.topBar.searchPlaceholder, { label: searchName })}
          value={search.value}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          onChange={(e) => {
            setDismissed(false);
            setActive(null);
            search.onChange(e.target.value);
          }}
          onKeyDown={onInputKeyDown}
        />
      </div>
      {searching ? (
        <button
          type="button"
          className="nc-topbar__button"
          aria-label={words.topBar.closeSearch}
          title={words.topBar.closeSearch}
          onClick={closeSearch}
        >
          <CloseGlyph />
        </button>
      ) : null}
      {list}
      <span className="nc-sr-only" role="status">
        {announcement}
      </span>
    </div>
  ) : null;

  if (searching) {
    parts.push(searchRegion);
  } else {
    if (mark) parts.push(searchRegion);
    parts.push(<span key="space" className="nc-topbar__space" />);
    if (!mark && !narrow) parts.push(searchRegion);

    // what stands at the end of the bar in every frame, in this order.
    const end: React.ReactNode[] = [];
    if (search && narrow) {
      end.push(
        <button
          key="open-search"
          ref={searchButtonRef}
          type="button"
          className="nc-topbar__button"
          aria-label={words.topBar.search}
          title={words.topBar.search}
          onClick={() => {
            focusNext.current = 'input';
            setSearchOpen(true);
          }}
        >
          <SearchGlyph />
        </button>,
      );
    }
    if (onNotifications) {
      end.push(
        <button
          key="bell"
          type="button"
          className="nc-topbar__button"
          aria-label={bellName}
          title={bellName}
          aria-expanded={notificationsExpanded}
          onClick={onNotifications}
        >
          <BellGlyph />
          {unread > 0 ? (
            <span className="nc-topbar__count" aria-hidden="true">
              {formatCount(unread, lang)}
            </span>
          ) : null}
        </button>,
      );
    }
    if (userMenu != null && userMenu !== false) {
      end.push(
        <div key="user" className="nc-topbar__user">
          {userMenu}
        </div>,
      );
    }
    if (end.length) {
      parts.push(
        <div key="end" className="nc-topbar__end">
          {end}
        </div>,
      );
    }
  }

  return (
    <header
      ref={barRef}
      className={cx(
        'nc-topbar',
        `nc-topbar--search-${searchPlacement}`,
        width != null && (narrow ? 'nc-topbar--narrow' : 'nc-topbar--wide'),
        mark && 'nc-topbar--mark',
        searching && 'nc-topbar--searching',
        className,
      )}
      onKeyDown={onBarKeyDown}
      {...rest}
    >
      {parts}
    </header>
  );
});

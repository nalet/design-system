import * as React from 'react';
import { cx } from '../../lib/cx';
import { Chevron } from '../../brand/Chevron/Chevron';
import { useRovingGrid } from '../../lib/useRovingGrid';
import { PortalContext } from './context';
import './Portal.css';

export interface PortalProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'onChange'> {
  /** lowercase mono heading (a leading blue chevron is added). */
  title?: string;
  /** show the search box. default true. */
  searchable?: boolean;
  /** search input placeholder. */
  searchPlaceholder?: string;
  /** controlled search value (pair with onQueryChange). */
  query?: string;
  /** per-keystroke search callback (controlled / analytics). */
  onQueryChange?: (query: string) => void;
  /**
   * keyboard model. 'roving' (default) = the launcher owns one tab stop and
   * arrow keys move between tiles across groups. 'tab' = native tab order.
   */
  navigation?: 'roving' | 'tab';
  /** global spacing scale. */
  density?: 'comfortable' | 'compact';
  /** pinned slot above the groups (typically a favourites TileGroup). */
  favorites?: React.ReactNode;
  /** shown when search matches nothing. */
  emptyState?: React.ReactNode;
  /** the TileGroups. */
  children: React.ReactNode;
}

/**
 * Portal — the launchpad home. lays out grouped square Tiles, with a persistent
 * favourites slot, a search box, and roving-tabindex arrow-key navigation that
 * spans every group. groups stay in a stable order; search filters tiles in
 * place. the terminal-aesthetic app launcher that replaces a fiori launchpad.
 */
export const Portal = React.forwardRef<HTMLDivElement, PortalProps>(function Portal(
  {
    title,
    searchable = true,
    searchPlaceholder = 'search apps…',
    query,
    onQueryChange,
    navigation = 'roving',
    density = 'comfortable',
    favorites,
    emptyState,
    className,
    children,
    ...rest
  },
  ref,
) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const [innerQuery, setInnerQuery] = React.useState('');
  const q = (query ?? innerQuery).trim().toLowerCase();
  const [matches, setMatches] = React.useState(-1); // -1 = no filter active

  const setQuery = (value: string) => {
    if (query === undefined) setInnerQuery(value);
    onQueryChange?.(value);
  };

  const roving = useRovingGrid(containerRef, navigation === 'roving');

  // filter tiles in place against the query. dom-driven so it works regardless
  // of how deeply Tiles are nested inside groups, and hides empty groups.
  React.useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const tiles = Array.from(root.querySelectorAll<HTMLElement>('.nc-tile'));
    let visible = 0;
    for (const el of tiles) {
      const hay = el.getAttribute('data-nc-search') ?? '';
      const ok = !q || hay.includes(q);
      el.toggleAttribute('hidden', !ok);
      if (ok) visible += 1;
    }
    for (const g of Array.from(root.querySelectorAll<HTMLElement>('.nc-tilegroup'))) {
      g.toggleAttribute('hidden', !g.querySelector('.nc-tile:not([hidden])'));
    }
    setMatches(q ? visible : -1);
  }, [q, children, favorites]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    // `/` focuses search from anywhere in the launcher.
    if (e.key === '/' && searchable && document.activeElement !== searchRef.current) {
      e.preventDefault();
      searchRef.current?.focus();
      return;
    }
    if (navigation === 'roving') roving.onKeyDown(e);
  };

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setQuery('');
      // re-home focus onto the first visible tile.
      const first = containerRef.current?.querySelector<HTMLElement>('[data-nc-tile]');
      first?.focus();
    }
  };

  return (
    <PortalContext.Provider value={{ rovingManaged: navigation === 'roving' }}>
      <div
        ref={ref}
        className={cx('nc-portal', `nc-portal--${density}`, className)}
        {...rest}
      >
        {title || searchable ? (
          <div className="nc-portal__bar">
            {title ? (
              <h1 className="nc-portal__title">
                <Chevron size={18} className="nc-portal__chev" aria-hidden />
                {title}
              </h1>
            ) : (
              <span />
            )}
            {searchable ? (
              <div className="nc-portal__search" role="search">
                <input
                  ref={searchRef}
                  type="text"
                  className="nc-portal__search-input"
                  placeholder={searchPlaceholder}
                  aria-label="search apps"
                  value={query ?? innerQuery}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onSearchKeyDown}
                />
              </div>
            ) : null}
          </div>
        ) : null}

        <div ref={containerRef} className="nc-portal__body" onKeyDown={onKeyDown}>
          {favorites ? <div className="nc-portal__favorites">{favorites}</div> : null}
          {children}
          {matches === 0 ? (
            <div className="nc-portal__empty">
              {emptyState ?? <span>no apps match “{query ?? innerQuery}”.</span>}
            </div>
          ) : null}
        </div>

        <span className="nc-portal__sr" aria-live="polite">
          {matches >= 0 ? `${matches} app${matches === 1 ? '' : 's'} match` : ''}
        </span>
      </div>
    </PortalContext.Provider>
  );
});

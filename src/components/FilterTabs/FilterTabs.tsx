import * as React from 'react';
import { cx } from '../../lib/cx';
import { formatCount } from '../../lib/format';
import type { State } from '../../lib/StateGlyph';
import './FilterTabs.css';

export interface FilterTab {
  id: string;
  /** What the tab keeps, lowercase: "needs attention". */
  label: string;
  /** How many items the tab keeps. Omit when unknown. */
  count?: number;
  /**
   * The count's meaning, when it carries one: error for "needs attention",
   * warning for "can't be checked". Neutral (plain) by default.
   */
  state?: State;
  disabled?: boolean;
}

export interface FilterTabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  tabs: FilterTab[];
  /** The selected tab's ID (controlled). */
  value: string;
  onChange: (id: string) => void;
  /** The tablist's accessible name ("filter missing by state"). */
  label: string;
  /** The ID of the region the tabs filter; every tab points at it with aria-controls. */
  panelId?: string;
  /** Prefix for the tabs' IDs, so the panel can be labelled by the selected one: `${idPrefix}-${tab.id}`. */
  idPrefix?: string;
}

/** The ID a FilterTabs tab gets, for aria-labelledby on its panel. */
export function filterTabId(idPrefix: string, tabId: string): string {
  return `${idPrefix}-${tabId}`;
}

/**
 * FilterTabs — key figures that filter one list: each tab is a count over a
 * label ("3 · needs attention"); choosing a tab filters the list below it. A
 * tablist with automatic activation — arrow keys move and select, home and end
 * jump — and one tab stop.
 */
export const FilterTabs = React.forwardRef<HTMLDivElement, FilterTabsProps>(function FilterTabs(
  { tabs, value, onChange, label, panelId, idPrefix, className, ...rest },
  ref,
) {
  const fallbackPrefix = React.useId();
  const prefix = idPrefix ?? fallbackPrefix;
  const listRef = React.useRef<HTMLDivElement>(null);
  // when the row is wider than its room it scrolls; a fade on the cut edge says so.
  const [more, setMore] = React.useState({ start: false, end: false });
  React.useLayoutEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const update = () => {
      const start = el.scrollLeft > 1;
      const end = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
      setMore((m) => (m.start === start && m.end === end ? m : { start, end }));
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    ro?.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro?.disconnect();
    };
  }, [tabs.length]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const enabled = tabs.filter((t) => !t.disabled);
    const idx = enabled.findIndex((t) => t.id === value);
    let next: FilterTab | undefined;
    if (e.key === 'ArrowRight') next = enabled[idx < 0 ? 0 : (idx + 1) % enabled.length];
    else if (e.key === 'ArrowLeft') next = enabled[idx < 0 ? enabled.length - 1 : (idx - 1 + enabled.length) % enabled.length];
    else if (e.key === 'Home') next = enabled[0];
    else if (e.key === 'End') next = enabled[enabled.length - 1];
    if (!next) return;
    e.preventDefault();
    onChange(next.id);
    // by id, not a selector: react's generated ids hold characters a selector would need escaped.
    const el = listRef.current?.ownerDocument.getElementById(filterTabId(prefix, next.id));
    el?.focus();
  };

  return (
    <div
      ref={ref}
      className={cx(
        'nc-filtertabs',
        more.start && 'nc-filtertabs--more-start',
        more.end && 'nc-filtertabs--more-end',
        className,
      )}
      {...rest}
    >
      <div ref={listRef} className="nc-filtertabs__list" role="tablist" aria-label={label}>
        {tabs.map((t) => {
          const selected = t.id === value;
          return (
            <button
              key={t.id}
              id={filterTabId(prefix, t.id)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              disabled={t.disabled}
              className={cx(
                'nc-filtertabs__tab',
                selected && 'nc-filtertabs__tab--selected',
                t.state && `nc-filtertabs__tab--${t.state}`,
              )}
              onClick={() => onChange(t.id)}
              onKeyDown={onKeyDown}
            >
              <span className="nc-filtertabs__label">{t.label}</span>
              {/* a real space, so the name reads "needs attention 3" in every engine; flex hides it. */}
              {t.count != null ? ' ' : null}
              {t.count != null ? <span className="nc-filtertabs__count">{formatCount(t.count)}</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
});

import * as React from 'react';
import { cx } from '../../lib/cx';
import { fill, formatCount, useLanguage } from '../../lib/language';
import { useElementWidth } from '../../lib/useElementWidth';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';
import { Button } from '../Button/Button';
import { MultiSelect, type MultiSelectOption } from '../MultiSelect/MultiSelect';
import './FilterBar.css';

export interface FilterBarSearch {
  value: string;
  onChange: (value: string) => void;
  /** A hint of what can be searched: "search titles". */
  placeholder?: string;
  /** The field's accessible name. Default "search", in the page's language. */
  label?: string;
}

export interface FilterSelectDef {
  type: 'select';
  id: string;
  /** The facet's name: "kind". */
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** The first option should be the "no filter" one ("all"). */
  options: { value: string; label: string }[];
  /** The value that means no filter. Default "". */
  emptyValue?: string;
}

export interface FilterMultiSelectDef {
  type: 'multiselect';
  id: string;
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: MultiSelectOption[];
}

export type FilterDef = FilterSelectDef | FilterMultiSelectDef;

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** A search field, filtering as the person types. */
  search?: FilterBarSearch;
  /** Facets: single (native select) or several values (multi select). */
  filters?: FilterDef[];
  /** Resets search and every facet; "clear all" is enabled while any is set. */
  onClearAll?: () => void;
  /** What the filters leave: "312 of 2,500". Announced politely as it changes. */
  resultCount?: React.ReactNode;
  /** The landmark's accessible name. Default "filters", in the page's language. */
  label?: string;
  /**
   * The height of every control in the bar, the "filters" button included:
   * 34, or 42 at `lg`, where a multi select's options are rows 48 high.
   * Default md.
   */
  size?: 'md' | 'lg';
  /** Below this width (px) the facets fold behind a "filters" toggle. Default 640. */
  collapseBelow?: number;
  /** Extra controls after the facets. */
  children?: React.ReactNode;
}

const SearchGlyph = () => (
  <svg viewBox="0 0 16 16" width="0.875rem" height="0.875rem" fill="none" aria-hidden="true" focusable="false">
    <rect x="2.75" y="2.75" width="8" height="8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10.75 10.75 L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
  </svg>
);

function isActive(f: FilterDef): boolean {
  return f.type === 'select' ? f.value !== (f.emptyValue ?? '') : f.value.length > 0;
}

/**
 * FilterBar — what narrows a list: a search field, facets, "clear all" and the
 * count of what is left. Fully controlled; the list filters itself from the
 * values. A search landmark; on a narrow screen the facets fold behind one
 * "filters" toggle that says how many are set. Every control shares one
 * height: 34, or 42 at `size="lg"` and on a screen made for touch.
 */
export const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(function FilterBar(
  {
    search,
    filters = [],
    onClearAll,
    resultCount,
    label,
    size = 'md',
    collapseBelow = 640,
    className,
    children,
    ...rest
  },
  ref,
) {
  const { lang, words } = useLanguage();
  const innerRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);
  const width = useElementWidth(innerRef);
  const narrow = width != null && width < collapseBelow;
  const [expanded, setExpanded] = React.useState(false);
  const facetsId = React.useId();
  const searchRef = React.useRef<HTMLInputElement>(null);

  const activeFacets = filters.filter(isActive).length;
  const anyActive = activeFacets > 0 || !!search?.value;
  const showFacets = !narrow || expanded;
  const hasCount = resultCount != null && resultCount !== '';
  // clear all disables itself once nothing is set; focus moves on to the search
  // (or the toolbar's own button would drop it on the page).
  const clearAll = onClearAll ? (
    <Button
      size={size}
      variant="ghost"
      disabled={!anyActive}
      onClick={() => {
        onClearAll();
        searchRef.current?.focus();
      }}
    >
      {words.filterBar.clearAll}
    </Button>
  ) : null;

  return (
    <div
      ref={innerRef}
      role="search"
      aria-label={label ?? words.filterBar.filters}
      className={cx('nc-filterbar', `nc-filterbar--${size}`, narrow && 'nc-filterbar--narrow', className)}
      {...rest}
    >
      <div className="nc-filterbar__row">
        {search ? (
          // a label, so a press anywhere on the field's box, the glyph included,
          // puts the cursor in it. the field's name is its aria-label.
          <label className="nc-filterbar__search">
            <Input
              ref={searchRef}
              type="search"
              inputSize={size}
              value={search.value}
              placeholder={search.placeholder}
              aria-label={search.label ?? words.filterBar.search}
              leading={<SearchGlyph />}
              onChange={(e) => search.onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape' && search.value) {
                  e.preventDefault();
                  search.onChange('');
                }
              }}
            />
          </label>
        ) : null}
        {narrow && filters.length > 0 ? (
          <Button
            size={size}
            variant="default"
            aria-expanded={expanded}
            aria-controls={facetsId}
            onClick={() => setExpanded((x) => !x)}
          >
            {activeFacets
              ? fill(words.filterBar.filtersActive, { n: formatCount(activeFacets, lang) })
              : words.filterBar.filters}
          </Button>
        ) : null}
        <div
          id={facetsId}
          className="nc-filterbar__facets"
          hidden={!showFacets || (filters.length === 0 && !children)}
        >
          {filters.map((f) =>
            f.type === 'select' ? (
              <label key={f.id} className={cx('nc-filterbar__facet', isActive(f) && 'nc-filterbar__facet--active')}>
                <span className="nc-filterbar__facet-label">{f.label}</span>
                <Select
                  selectSize={size}
                  value={f.value}
                  options={f.options}
                  onChange={(e) => f.onChange(e.target.value)}
                />
              </label>
            ) : (
              <MultiSelect
                key={f.id}
                label={f.label}
                size={size}
                options={f.options}
                value={f.value}
                onChange={f.onChange}
              />
            ),
          )}
          {children}
          {narrow ? clearAll : null}
        </div>
        {/* the count is a live region that is always there, so the first change is announced too. */}
        <div className={cx('nc-filterbar__end', !hasCount && narrow && 'nc-filterbar__end--empty')}>
          <span className={cx('nc-filterbar__count', !hasCount && 'nc-filterbar__count--empty')} aria-live="polite" aria-atomic="true">
            {hasCount ? resultCount : ''}
          </span>
          {narrow ? null : clearAll}
        </div>
      </div>
    </div>
  );
});

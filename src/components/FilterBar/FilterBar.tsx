import * as React from 'react';
import { cx } from '../../lib/cx';
import { formatCount } from '../../lib/format';
import { useElementWidth } from '../../lib/useElementWidth';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';
import { Button } from '../Button/Button';
import { MultiSelect, type MultiSelectOption } from '../MultiSelect/MultiSelect';
import './FilterBar.css';

export interface FilterBarSearch {
  value: string;
  onChange: (value: string) => void;
  /** a hint of what can be searched: "search titles". */
  placeholder?: string;
  /** the field's accessible name. default "search". */
  label?: string;
}

export interface FilterSelectDef {
  type: 'select';
  id: string;
  /** the facet's name: "kind". */
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** the first option should be the "no filter" one ("all"). */
  options: { value: string; label: string }[];
  /** the value that means no filter. default "". */
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
  /** a search field, filtering as the person types. */
  search?: FilterBarSearch;
  /** facets: single (native select) or several values (multi select). */
  filters?: FilterDef[];
  /** resets search and every facet; "clear all" is enabled while any is set. */
  onClearAll?: () => void;
  /** what the filters leave: "312 of 2,500". announced politely as it changes. */
  resultCount?: React.ReactNode;
  /** the landmark's accessible name. default "filters". */
  label?: string;
  /** below this width (px) the facets fold behind a "filters" toggle. default 640. */
  collapseBelow?: number;
  /** extra controls after the facets. */
  children?: React.ReactNode;
}

const SearchGlyph = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true" focusable="false">
    <rect x="2.75" y="2.75" width="8" height="8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10.75 10.75 L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
  </svg>
);

function isActive(f: FilterDef): boolean {
  return f.type === 'select' ? f.value !== (f.emptyValue ?? '') : f.value.length > 0;
}

/**
 * FilterBar — what narrows a list: a search field, facets, "clear all" and the
 * count of what is left. fully controlled; the list filters itself from the
 * values. a search landmark; on a narrow screen the facets fold behind one
 * "filters" toggle that says how many are set.
 */
export const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(function FilterBar(
  {
    search,
    filters = [],
    onClearAll,
    resultCount,
    label = 'filters',
    collapseBelow = 640,
    className,
    children,
    ...rest
  },
  ref,
) {
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
      size="md"
      variant="ghost"
      disabled={!anyActive}
      onClick={() => {
        onClearAll();
        searchRef.current?.focus();
      }}
    >
      clear all
    </Button>
  ) : null;

  return (
    <div
      ref={innerRef}
      role="search"
      aria-label={label}
      className={cx('nc-filterbar', narrow && 'nc-filterbar--narrow', className)}
      {...rest}
    >
      <div className="nc-filterbar__row">
        {search ? (
          <div className="nc-filterbar__search">
            <Input
              ref={searchRef}
              type="search"
              inputSize="md"
              value={search.value}
              placeholder={search.placeholder}
              aria-label={search.label ?? 'search'}
              leading={<SearchGlyph />}
              onChange={(e) => search.onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape' && search.value) {
                  e.preventDefault();
                  search.onChange('');
                }
              }}
            />
          </div>
        ) : null}
        {narrow && filters.length > 0 ? (
          <Button
            size="md"
            variant="default"
            aria-expanded={expanded}
            aria-controls={facetsId}
            onClick={() => setExpanded((x) => !x)}
          >
            {activeFacets ? `filters · ${formatCount(activeFacets)}` : 'filters'}
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
                  selectSize="md"
                  value={f.value}
                  options={f.options}
                  onChange={(e) => f.onChange(e.target.value)}
                />
              </label>
            ) : (
              <MultiSelect
                key={f.id}
                label={f.label}
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

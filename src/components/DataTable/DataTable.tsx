import * as React from 'react';
import { cx } from '../../lib/cx';
import { formatCount } from '../../lib/format';
import { useElementWidth } from '../../lib/useElementWidth';
import type { ObjectState } from '../../lib/StateGlyph';
import { Checkbox } from '../Checkbox/Checkbox';
import { Button } from '../Button/Button';
import '../../lib/a11y.css';
import './DataTable.css';

export type SortDirection = 'ascending' | 'descending';

export interface DataTableSort {
  columnId: string;
  direction: SortDirection;
}

export type SortValue = string | number | Date | boolean | null | undefined;

export interface DataTableColumn<Row> {
  id: string;
  /** lowercase label. */
  header: React.ReactNode;
  /** the cell's content. */
  cell: (row: Row) => React.ReactNode;
  /** makes the column sortable by this value (strings compare naturally, nulls last). */
  sortValue?: (row: Row) => SortValue;
  /** or by a full comparator. */
  compare?: (a: Row, b: Row) => number;
  /** the direction a first click sorts in. default ascending; dates usually want descending. */
  firstSortDirection?: SortDirection;
  align?: 'left' | 'right' | 'center';
  width?: number | string;
  /**
   * responsive priority, by the table's own width. high always shows; low
   * pops in under the row's first column at 720px and below, medium at 480px
   * and below. a popped-in column is not rendered as a column at all.
   */
  importance?: 'high' | 'medium' | 'low';
  /** the label a popped-in value carries. default: the header, when it is a string. */
  popinLabel?: string;
  /** the cell names the row (th scope=row). default: the first column. */
  rowHeader?: boolean;
}

export interface DataTableGroup<Row> {
  key: string;
  rows: Row[];
}

export interface DataTableProps<Row> {
  columns: DataTableColumn<Row>[];
  rows: readonly Row[];
  /** a stable, unique key per row. */
  rowKey: (row: Row) => string;
  /** the table's accessible name (or pass aria-labelledby). */
  'aria-label'?: string;
  'aria-labelledby'?: string;

  /** controlled sort. the table sorts `rows` itself unless `manualSort`. */
  sort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort) => void;
  /** `rows` arrive sorted (e.g. by a server); the table only shows the sort state. */
  manualSort?: boolean;

  /** adds the checkbox column. selection is controlled. */
  selectable?: boolean;
  selected?: ReadonlySet<string>;
  onSelectionChange?: (next: Set<string>) => void;
  /** rows that cannot be selected get a disabled checkbox. */
  isRowSelectable?: (row: Row) => boolean;
  /** names a row for its checkbox: "S04E07" gives "select S04E07". */
  rowLabel?: (row: Row) => string;

  /** groups rows under header rows, in order of first appearance after sorting. */
  groupBy?: (row: Row) => string;
  /** the group row's label, usually with a count: "the example show · s04 · 8 missing". */
  groupHeader?: (group: DataTableGroup<Row>) => React.ReactNode;
  /** an action on the whole group (one ghost button). */
  groupAction?: (group: DataTableGroup<Row>) => React.ReactNode;
  /** controlled collapsed groups; omit to let the table keep them. */
  collapsedGroups?: ReadonlySet<string>;
  onCollapsedGroupsChange?: (next: Set<string>) => void;
  defaultCollapsedGroups?: Iterable<string>;

  /** show this many rows, then "show more" adds as many again. omit to show every row. */
  growing?: number;
  /** a change of this value (e.g. the active filters) starts growing over. */
  growingResetKey?: unknown;
  /** how the growing count reads. default "100 of 2,500". */
  formatGrowing?: (shown: number, total: number) => string;

  /** enter on a row, or a click outside its controls. without it a click toggles selection. */
  onRowPress?: (row: Row) => void;
  /** a state rule on the row's leading edge; the row must also say it in words. */
  rowHighlight?: (row: Row) => ObjectState | undefined;

  /** the header row sticks while the page scrolls. default true. offset it with --nc-dt-sticky-top. */
  stickyHeader?: boolean;
  dense?: boolean;
  /** shown in the body when there are no rows. */
  empty?: React.ReactNode;
  /** marks the table busy (aria-busy) and shows a progress rule. */
  loading?: boolean;
  className?: string;
}

const EMPTY_SET: ReadonlySet<string> = new Set();

/** the table widths (px) at and below which low and medium columns pop in. */
const LOW_BELOW = 720;
const MEDIUM_BELOW = 480;

type Item<Row> =
  | {
      kind: 'group';
      key: string;
      group: DataTableGroup<Row>;
      collapsed: boolean;
      posinset: number;
      rowIndex: number;
    }
  | {
      kind: 'row';
      key: string;
      row: Row;
      posinset: number;
      setsize: number;
      rowIndex: number;
    };

// natural order ("E2" before "E10"), case-insensitive. one collator: building
// one per comparison (what localeCompare with options does) makes a sort of a
// few thousand rows take hundreds of milliseconds.
const COLLATOR = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

function compareValues(a: SortValue, b: SortValue): number {
  if (a instanceof Date) a = a.getTime();
  if (b instanceof Date) b = b.getTime();
  if (typeof a === 'string' && typeof b === 'string') return COLLATOR.compare(a, b);
  return (a as number) < (b as number) ? -1 : (a as number) > (b as number) ? 1 : 0;
}

function sortRows<Row>(rows: readonly Row[], column: DataTableColumn<Row>, direction: SortDirection): Row[] {
  const dir = direction === 'descending' ? -1 : 1;
  const indexed = rows.map((row, i) => ({ row, i }));
  if (column.compare) {
    const cmp = column.compare;
    indexed.sort((x, y) => cmp(x.row, y.row) * dir || x.i - y.i);
  } else if (column.sortValue) {
    const get = column.sortValue;
    const values = indexed.map((x) => get(x.row));
    indexed.sort((x, y) => {
      const va = values[x.i];
      const vb = values[y.i];
      // empty values sort last in either direction.
      const na = va == null || va === '';
      const nb = vb == null || vb === '';
      if (na || nb) return na === nb ? x.i - y.i : na ? 1 : -1;
      return compareValues(va, vb) * dir || x.i - y.i;
    });
  } else {
    return rows.slice();
  }
  return indexed.map((x) => x.row);
}

function groupInOrder<Row>(rows: readonly Row[], groupBy: (row: Row) => string): DataTableGroup<Row>[] {
  const map = new Map<string, Row[]>();
  for (const row of rows) {
    const k = groupBy(row);
    const list = map.get(k);
    if (list) list.push(row);
    else map.set(k, [row]);
  }
  return Array.from(map, ([key, list]) => ({ key, rows: list }));
}

function useLatest<T>(value: T) {
  const ref = React.useRef(value);
  React.useLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}

const INTERACTIVE = 'button, a[href], input, label, select, textarea, summary, [role="menuitem"], [data-nc-stop]';

// controls inside rows that the roving tab stop has not taken over yet. one
// scan per commit: about 6 ms over 3,000 rendered rows (77,000 nodes).
const UNMANAGED = ['button', 'a[href]', 'input', 'select', 'textarea', 'summary', '[tabindex]']
  .map((s) => `tr[data-nc-item] ${s}:not([data-nc-tab])`)
  .join(', ');

function setAttr(el: Element, name: string, value: string) {
  if (el.getAttribute(name) !== value) el.setAttribute(name, value);
}

/** put a row (and its own controls) in or out of the tab order. */
function setRowTabbable(tr: HTMLTableRowElement, on: boolean) {
  tr.tabIndex = on ? 0 : -1;
  for (const el of Array.from(tr.querySelectorAll<HTMLElement>('[data-nc-tab]'))) {
    if (!on) {
      el.tabIndex = -1;
      continue;
    }
    const orig = el.getAttribute('data-nc-tab');
    if (orig) el.setAttribute('tabindex', orig);
    else el.removeAttribute('tabindex');
  }
}

const SortGlyph = ({ direction }: { direction?: SortDirection }) => (
  <svg viewBox="0 0 10 12" width="10" height="12" fill="none" aria-hidden="true" className="nc-dt__sortglyph">
    <path
      d="M2 4.5 L5 1.5 L8 4.5"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      opacity={direction === 'ascending' ? 1 : 0.35}
    />
    <path
      d="M2 7.5 L5 10.5 L8 7.5"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      opacity={direction === 'descending' ? 1 : 0.35}
    />
  </svg>
);

interface CellsProps<Row> {
  row: Row;
  columns: DataTableColumn<Row>[];
  primaryId: string;
  popins: DataTableColumn<Row>[];
}

function popinLabel<Row>(c: DataTableColumn<Row>) {
  return c.popinLabel ?? (typeof c.header === 'string' ? c.header : c.id);
}

// a row's cells, memoised on the row and the columns alone: selecting a row,
// moving focus, sorting or collapsing a group never re-renders them.
const RowCells = React.memo(function RowCells<Row>({ row, columns, primaryId, popins }: CellsProps<Row>) {
  return (
    <>
      {columns.map((c) => {
        const content = c.cell(row);
        const style = { textAlign: c.align ?? 'left' } as const;
        if (c.id === primaryId) {
          return (
            <th key={c.id} scope="row" className="nc-dt__cell nc-dt__primary" style={style}>
              {content}
              {popins.length ? (
                <div className="nc-dt__popins">
                  {popins.map((p) => (
                    <div key={p.id} className="nc-dt__popin">
                      <span className="nc-dt__popin-label">{popinLabel(p)}</span>
                      <span className="nc-dt__popin-value">{p.cell(row)}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </th>
          );
        }
        return (
          <td key={c.id} className="nc-dt__cell" style={style}>
            {content}
          </td>
        );
      })}
    </>
  );
}) as <Row>(props: CellsProps<Row>) => React.ReactElement;

interface RowProps<Row> extends CellsProps<Row> {
  itemKey: string;
  selectable: boolean;
  isSelected: boolean;
  canSelect: boolean;
  label: string;
  grouped: boolean;
  highlight?: ObjectState;
  onToggle: (key: string, shift: boolean) => void;
}

// one data row. its position (aria-rowindex, -posinset, -setsize) is written
// by the table after each commit, so a re-sort only moves rows.
const DataRow = React.memo(function DataRow<Row>({
  row,
  itemKey,
  columns,
  primaryId,
  popins,
  selectable,
  isSelected,
  canSelect,
  label,
  grouped,
  highlight,
  onToggle,
}: RowProps<Row>) {
  return (
    <tr
      data-nc-item=""
      data-kind="row"
      data-key={itemKey}
      tabIndex={-1}
      aria-selected={selectable && canSelect ? isSelected : undefined}
      aria-level={grouped ? 2 : undefined}
      className={cx(
        'nc-dt__row',
        isSelected && 'nc-dt__row--selected',
        highlight && `nc-dt__row--hl nc-dt__row--hl-${highlight}`,
      )}
    >
      {selectable ? (
        <td className="nc-dt__cell nc-dt__select">
          <Checkbox
            aria-label={`select ${label}`}
            checked={isSelected}
            disabled={!canSelect}
            onChange={() => undefined}
            onClick={(e) => onToggle(itemKey, e.shiftKey)}
          />
        </td>
      ) : null}
      <RowCells<Row> row={row} columns={columns} primaryId={primaryId} popins={popins} />
    </tr>
  );
}) as <Row>(props: RowProps<Row>) => React.ReactElement;

/**
 * DataTable — the interactive table: controlled sorting (aria-sort), row
 * selection with select-all, shift ranges and space, collapsible group rows,
 * a sticky header, growing ("show more", "100 of 2,500"), responsive pop-in,
 * and one tab stop with arrow-key row focus. a grid; a treegrid when grouped.
 *
 * keyboard on a focused row: ↑ ↓ home end page-up page-down move; space
 * toggles selection, shift+space selects the range from the last toggled row,
 * shift+↑/↓ extend it, ctrl/cmd+a selects every visible row; enter presses the
 * row. on a group row: ← collapses, → expands, enter or space toggles; ← on a
 * row moves to its group. tab enters the focused row's own controls.
 */
export function DataTable<Row>({
  columns,
  rows,
  rowKey,
  sort = null,
  onSortChange,
  manualSort = false,
  selectable = false,
  selected = EMPTY_SET,
  onSelectionChange,
  isRowSelectable,
  rowLabel,
  groupBy,
  groupHeader,
  groupAction,
  collapsedGroups,
  onCollapsedGroupsChange,
  defaultCollapsedGroups,
  growing,
  growingResetKey,
  formatGrowing = (shown, total) => `${formatCount(shown)} of ${formatCount(total)}`,
  onRowPress,
  rowHighlight,
  stickyHeader = true,
  dense = false,
  empty,
  loading = false,
  className,
  ...aria
}: DataTableProps<Row>) {
  const tbodyRef = React.useRef<HTMLTableSectionElement>(null);
  const activeKey = React.useRef<string | null>(null);
  const anchorKey = React.useRef<string | null>(null);

  // ---- sort ---------------------------------------------------------------
  const sortColumn = sort ? columns.find((c) => c.id === sort.columnId) : undefined;
  const sortedRows = React.useMemo(
    () => (sort && sortColumn && !manualSort ? sortRows(rows, sortColumn, sort.direction) : rows),
    [rows, sort, sortColumn, manualSort],
  );

  // ---- group --------------------------------------------------------------
  const groups = React.useMemo(
    () => (groupBy ? groupInOrder(sortedRows, groupBy) : null),
    [sortedRows, groupBy],
  );
  const [innerCollapsed, setInnerCollapsed] = React.useState<ReadonlySet<string>>(
    () => new Set(defaultCollapsedGroups ?? []),
  );
  const collapsed = collapsedGroups ?? innerCollapsed;
  const setCollapsed = (next: Set<string>) => {
    if (!collapsedGroups) setInnerCollapsed(next);
    onCollapsedGroupsChange?.(next);
  };
  const toggleGroup = (key: string, open?: boolean) => {
    const isCollapsed = collapsed.has(key);
    const wantOpen = open ?? isCollapsed;
    if (wantOpen === !isCollapsed) return;
    const next = new Set(collapsed);
    if (wantOpen) next.delete(key);
    else next.add(key);
    setCollapsed(next);
  };

  // ---- growing ------------------------------------------------------------
  const pageSize = growing && growing > 0 ? growing : Infinity;
  const [limit, setLimit] = React.useState(pageSize);
  const resetRef = React.useRef(growingResetKey);
  if (resetRef.current !== growingResetKey) {
    resetRef.current = growingResetKey;
    if (limit !== pageSize) setLimit(pageSize);
  }

  // ---- the rendered list: group rows and data rows, cut at the limit -------
  const model = React.useMemo(() => {
    const items: Item<Row>[] = [];
    let shown = 0;
    let available = 0;
    let rowIndex = 2; // aria-rowindex: the header row is 1
    if (!groups) {
      available = sortedRows.length;
      const n = Math.min(sortedRows.length, limit);
      for (let i = 0; i < n; i++) {
        const row = sortedRows[i];
        items.push({ kind: 'row', key: rowKey(row), row, posinset: i + 1, setsize: available, rowIndex: i + 2 });
      }
      shown = n;
      return { items, shown, available, rowCount: available + 1 };
    }
    groups.forEach((group, gi) => {
      const isCollapsed = collapsed.has(group.key);
      if (shown < limit) {
        items.push({ kind: 'group', key: `group:${group.key}`, group, collapsed: isCollapsed, posinset: gi + 1, rowIndex });
      }
      rowIndex++;
      if (isCollapsed) return;
      available += group.rows.length;
      group.rows.forEach((row, ri) => {
        if (shown < limit) {
          items.push({ kind: 'row', key: rowKey(row), row, posinset: ri + 1, setsize: group.rows.length, rowIndex });
          shown++;
        }
        rowIndex++;
      });
    });
    return { items, shown, available, rowCount: rowIndex - 1 };
  }, [groups, sortedRows, collapsed, limit, rowKey]);

  const { items } = model;
  const grouped = !!groups;

  // ---- selection ----------------------------------------------------------
  const canSelect = React.useCallback(
    (row: Row) => selectable && (isRowSelectable ? isRowSelectable(row) : true),
    [selectable, isRowSelectable],
  );
  const visibleRows = items.filter((i): i is Extract<Item<Row>, { kind: 'row' }> => i.kind === 'row');
  const visibleSelectable = visibleRows.filter((i) => canSelect(i.row));
  const allVisibleSelected = visibleSelectable.length > 0 && visibleSelectable.every((i) => selected.has(i.key));
  const someSelected = selected.size > 0 && !allVisibleSelected;

  const latest = useLatest({ selected, visibleRows, canSelect, onSelectionChange });

  const setRange = React.useCallback((fromKey: string, toKey: string, on: boolean) => {
    const { selected: sel, visibleRows: list, canSelect: can, onSelectionChange: emit } = latest.current;
    const keys = list.map((i) => i.key);
    const a = keys.indexOf(fromKey);
    const b = keys.indexOf(toKey);
    if (a < 0 || b < 0) return false;
    const next = new Set(sel);
    for (let i = Math.min(a, b); i <= Math.max(a, b); i++) {
      if (!can(list[i].row)) continue;
      if (on) next.add(list[i].key);
      else next.delete(list[i].key);
    }
    emit?.(next);
    return true;
  }, [latest]);

  const onToggle = React.useCallback(
    (key: string, shift: boolean) => {
      const { selected: sel, visibleRows: list, canSelect: can, onSelectionChange: emit } = latest.current;
      const item = list.find((i) => i.key === key);
      if (!item || !can(item.row)) return;
      const on = !sel.has(key);
      if (shift && anchorKey.current && anchorKey.current !== key && setRange(anchorKey.current, key, on)) {
        anchorKey.current = key;
        return;
      }
      const next = new Set(sel);
      if (on) next.add(key);
      else next.delete(key);
      anchorKey.current = key;
      emit?.(next);
    },
    [latest, setRange],
  );

  const toggleAllVisible = () => {
    if (!onSelectionChange) return;
    if (allVisibleSelected) {
      onSelectionChange(new Set());
      return;
    }
    const next = new Set(selected);
    for (const i of visibleSelectable) next.add(i.key);
    onSelectionChange(next);
  };

  // ---- roving focus: one row in the tab order; controls of other rows out --
  // incremental, so it stays cheap with thousands of rows rendered: controls
  // that just appeared leave the tab order once, then only the previous and the
  // current active row change.
  const lastActive = React.useRef<HTMLTableRowElement | null>(null);
  React.useLayoutEffect(() => {
    const body = tbodyRef.current;
    if (!body) return;
    // controls that appeared since the last commit leave the tab order once.
    for (const el of Array.from(body.querySelectorAll<HTMLElement>(UNMANAGED))) {
      el.setAttribute('data-nc-tab', el.getAttribute('tabindex') ?? '');
      el.tabIndex = -1;
    }
    let active: HTMLTableRowElement | null = null;
    let first: HTMLTableRowElement | null = null;
    for (const tr of Array.from(body.children) as HTMLTableRowElement[]) {
      if (!tr.hasAttribute('data-nc-item')) continue;
      if (!first) first = tr;
      if (tr.dataset.key === activeKey.current) {
        active = tr;
        break;
      }
    }
    if (!active) active = first;
    if (!active) return;
    activeKey.current = active.dataset.key ?? null;
    if (lastActive.current && lastActive.current !== active) setRowTabbable(lastActive.current, false);
    setRowTabbable(active, true);
    lastActive.current = active;
  });

  // positions (aria-rowindex, -posinset, -setsize) in one pass after each
  // commit, instead of as row props that would re-render every row.
  React.useLayoutEffect(() => {
    const body = tbodyRef.current;
    if (!body) return;
    let i = 0;
    for (const tr of Array.from(body.children) as HTMLTableRowElement[]) {
      if (!tr.hasAttribute('data-nc-item')) continue;
      const item = items[i++];
      if (!item) break;
      setAttr(tr, 'aria-rowindex', String(item.rowIndex));
      if (grouped && item.kind === 'row') {
        setAttr(tr, 'aria-posinset', String(item.posinset));
        setAttr(tr, 'aria-setsize', String(item.setsize));
      }
    }
  });

  // when the row (or the "show more" button) that has focus leaves the list,
  // focus moves to the table's tab stop instead of falling to the page.
  const focusWithin = React.useRef(false);
  const wrapRefForFocus = React.useRef<HTMLDivElement | null>(null);
  React.useLayoutEffect(() => {
    if (!focusWithin.current) return;
    const active = document.activeElement;
    if (active && active !== document.body) return;
    const target =
      lastActive.current && lastActive.current.isConnected
        ? lastActive.current
        : tbodyRef.current?.querySelector<HTMLTableRowElement>('tr[data-nc-item]');
    target?.focus();
  });
  const trackFocus = {
    onFocusCapture: () => {
      focusWithin.current = true;
    },
    onBlurCapture: (e: React.FocusEvent) => {
      // a null relatedTarget is an element removed under the focus: still "within".
      if (e.relatedTarget && !wrapRefForFocus.current?.contains(e.relatedTarget as Node)) focusWithin.current = false;
    },
  };

  const focusItem = (tr: HTMLElement | null | undefined) => {
    if (!tr) return;
    tr.focus();
  };

  const onFocusIn = (e: React.FocusEvent<HTMLTableSectionElement>) => {
    const tr = (e.target as HTMLElement).closest<HTMLTableRowElement>('tr[data-nc-item]');
    if (!tr || tr === lastActive.current) return;
    // move the tab stop without a re-render.
    if (lastActive.current) setRowTabbable(lastActive.current, false);
    setRowTabbable(tr, true);
    lastActive.current = tr;
    activeKey.current = tr.dataset.key ?? null;
  };

  const itemOf = (tr: HTMLElement) => items.find((i) => i.key === tr.dataset.key);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTableSectionElement>) => {
    const tr = e.target as HTMLElement;
    if (!tr.matches('tr[data-nc-item]')) return; // a control inside the row keeps its own keys
    const trs = Array.from(tbodyRef.current?.querySelectorAll<HTMLTableRowElement>('tr[data-nc-item]') ?? []);
    const idx = trs.indexOf(tr as HTMLTableRowElement);
    const item = itemOf(tr);
    if (!item) return;
    const move = (to: number) => {
      const target = trs[Math.max(0, Math.min(trs.length - 1, to))];
      if (e.shiftKey && selectable && item.kind === 'row' && target?.dataset.kind === 'row') {
        const anchor = anchorKey.current ?? item.key;
        if (!anchorKey.current) anchorKey.current = item.key;
        setRange(anchor, target.dataset.key as string, true);
      }
      focusItem(target);
    };
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        move(idx + 1);
        return;
      case 'ArrowUp':
        e.preventDefault();
        move(idx - 1);
        return;
      case 'Home':
        e.preventDefault();
        focusItem(trs[0]);
        return;
      case 'End':
        e.preventDefault();
        focusItem(trs[trs.length - 1]);
        return;
      case 'PageDown':
        e.preventDefault();
        focusItem(trs[Math.min(trs.length - 1, idx + 10)]);
        return;
      case 'PageUp':
        e.preventDefault();
        focusItem(trs[Math.max(0, idx - 10)]);
        return;
    }
    if (item.kind === 'group') {
      if (e.key === 'ArrowRight' && item.collapsed) {
        e.preventDefault();
        toggleGroup(item.group.key, true);
      } else if (e.key === 'ArrowLeft' && !item.collapsed) {
        e.preventDefault();
        toggleGroup(item.group.key, false);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleGroup(item.group.key);
      }
      return;
    }
    if (e.key === ' ' && selectable) {
      e.preventDefault();
      onToggle(item.key, e.shiftKey);
    } else if (e.key === 'Enter' && onRowPress) {
      e.preventDefault();
      onRowPress(item.row);
    } else if (e.key === 'ArrowLeft' && grouped) {
      e.preventDefault();
      for (let i = idx - 1; i >= 0; i--) {
        if (trs[i].dataset.kind === 'group') {
          focusItem(trs[i]);
          break;
        }
      }
    } else if ((e.key === 'a' || e.key === 'A') && (e.ctrlKey || e.metaKey) && selectable) {
      e.preventDefault();
      if (onSelectionChange) {
        const next = new Set(selected);
        for (const i of visibleSelectable) next.add(i.key);
        onSelectionChange(next);
      }
    }
  };

  const onClick = (e: React.MouseEvent<HTMLTableSectionElement>) => {
    const target = e.target as HTMLElement;
    const tr = target.closest<HTMLTableRowElement>('tr[data-nc-item]');
    if (!tr) return;
    const hit = target.closest(INTERACTIVE);
    if (hit && tr.contains(hit)) return; // the row's own controls
    // selecting text, not the row — unless shift, which extends a selection of rows.
    if (!e.shiftKey && window.getSelection?.()?.toString()) return;
    const item = itemOf(tr);
    if (!item) return;
    if (item.kind === 'group') {
      toggleGroup(item.group.key);
      return;
    }
    if (onRowPress) onRowPress(item.row);
    else if (selectable) onToggle(item.key, e.shiftKey);
  };

  // ---- render -------------------------------------------------------------
  // pop-in by the table's own width (it may sit in a narrow panel on a wide
  // screen). until it is measured, every column shows.
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const width = useElementWidth(wrapRef);
  const hideLow = width != null && width <= LOW_BELOW;
  const hideMedium = width != null && width <= MEDIUM_BELOW;
  const primary = columns.find((c) => c.rowHeader) ?? columns[0];
  const { shownColumns, popins } = React.useMemo(() => {
    const popped = (c: DataTableColumn<Row>) =>
      c !== primary && ((c.importance === 'low' && hideLow) || (c.importance === 'medium' && hideMedium));
    return { shownColumns: columns.filter((c) => !popped(c)), popins: columns.filter(popped) };
  }, [columns, primary, hideLow, hideMedium]);
  const colCount = shownColumns.length + (selectable ? 1 : 0);
  const role = grouped ? 'treegrid' : 'grid';

  const header = (c: DataTableColumn<Row>) => {
    const sortable = !!(onSortChange && (c.sortValue || c.compare || manualSort));
    const isSorted = sort?.columnId === c.id;
    const nextSort = (): DataTableSort => ({
      columnId: c.id,
      direction: isSorted
        ? sort!.direction === 'ascending'
          ? 'descending'
          : 'ascending'
        : (c.firstSortDirection ?? 'ascending'),
    });
    return (
      <th
        key={c.id}
        scope="col"
        aria-sort={isSorted ? sort!.direction : undefined}
        className="nc-dt__th"
        style={{ textAlign: c.align ?? 'left', width: c.width }}
      >
        {sortable ? (
          <button
            type="button"
            className={cx('nc-dt__sort', isSorted && 'nc-dt__sort--active')}
            onClick={() => onSortChange!(nextSort())}
          >
            <span>{c.header}</span>
            <SortGlyph direction={isSorted ? sort!.direction : undefined} />
          </button>
        ) : (
          c.header
        )}
      </th>
    );
  };

  return (
    <div
      ref={(el) => {
        wrapRef.current = el;
        wrapRefForFocus.current = el;
      }}
      {...trackFocus}
      className={cx(
        'nc-dt',
        hideMedium && 'nc-dt--narrow',
        dense && 'nc-dt--dense',
        stickyHeader && 'nc-dt--sticky',
        loading && 'nc-dt--loading',
        className,
      )}
    >
      <table
        role={role}
        aria-label={aria['aria-label']}
        aria-labelledby={aria['aria-labelledby']}
        aria-rowcount={model.rowCount}
        aria-colcount={colCount}
        aria-multiselectable={selectable || undefined}
        aria-busy={loading || undefined}
        className="nc-dt__table"
      >
        <thead className="nc-dt__head">
          <tr aria-rowindex={1}>
            {selectable ? (
              <th scope="col" className="nc-dt__th nc-dt__select">
                <Checkbox
                  aria-label="select every visible row"
                  checked={allVisibleSelected}
                  indeterminate={someSelected}
                  disabled={visibleSelectable.length === 0}
                  onChange={toggleAllVisible}
                />
              </th>
            ) : null}
            {shownColumns.map(header)}
          </tr>
        </thead>
        <tbody
          ref={tbodyRef}
          className="nc-dt__body"
          onKeyDown={onKeyDown}
          onClick={onClick}
          onFocus={onFocusIn}
          onMouseDown={(e) => {
            // shift+click selects a range of rows; keep the browser from selecting text instead.
            if (e.shiftKey && !(e.target as HTMLElement).closest(INTERACTIVE)) e.preventDefault();
          }}
        >
          {items.length === 0 && empty != null ? (
            <tr className="nc-dt__emptyrow">
              <td className="nc-dt__empty" colSpan={colCount}>
                {empty}
              </td>
            </tr>
          ) : null}
          {items.map((item) =>
            item.kind === 'group' ? (
              <tr
                key={item.key}
                data-nc-item=""
                data-kind="group"
                data-key={item.key}
                tabIndex={-1}
                aria-rowindex={item.rowIndex}
                aria-level={1}
                aria-posinset={item.posinset}
                aria-setsize={groups!.length}
                aria-expanded={!item.collapsed}
                className={cx('nc-dt__group', item.collapsed && 'nc-dt__group--collapsed')}
              >
                <td className="nc-dt__groupcell" colSpan={colCount}>
                  <div className="nc-dt__groupbar">
                    <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true" className="nc-dt__caret">
                      <path d="M4 2.5 L7.5 6 L4 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                    </svg>
                    <span className="nc-dt__grouplabel">
                      {groupHeader ? groupHeader(item.group) : `${item.group.key} · ${formatCount(item.group.rows.length)}`}
                    </span>
                    {groupAction ? <span className="nc-dt__groupaction">{groupAction(item.group)}</span> : null}
                  </div>
                </td>
              </tr>
            ) : (
              <DataRow<Row>
                key={item.key}
                row={item.row}
                itemKey={item.key}
                columns={shownColumns}
                primaryId={primary?.id ?? ''}
                popins={popins}
                selectable={selectable}
                isSelected={selected.has(item.key)}
                canSelect={canSelect(item.row)}
                label={rowLabel ? rowLabel(item.row) : 'row'}
                grouped={grouped}
                highlight={rowHighlight?.(item.row)}
                onToggle={onToggle}
              />
            ),
          )}
        </tbody>
      </table>
      {growing && model.available > 0 ? (
        <div className="nc-dt__growing">
          <span className="nc-dt__growing-count" aria-live="polite">
            {formatGrowing(model.shown, rows.length)}
          </span>
          {model.shown < model.available ? (
            <Button size="sm" onClick={() => setLimit((l) => l + pageSize)}>
              {`show ${formatCount(Math.min(pageSize, model.available - model.shown))} more`}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

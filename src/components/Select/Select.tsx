import * as React from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib/cx';
import { useLanguage } from '../../lib/language';
import './Select.css';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  selectSize?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  /** Optional declarative options. Children take precedence when provided. */
  options?: SelectOption[];
}

/** A row of the list a tv draws, read from the native select when the list opens. */
interface ListRow {
  /** The option's place among the native select's options. */
  index: number;
  label: string;
  disabled: boolean;
}

interface OpenList {
  rows: ListRow[];
  /** The option that is set, by its place; -1 when none is. */
  picked: number;
  /** The list's name: the select's own. */
  name: string | undefined;
  labelledBy: string | undefined;
}

/** The screen an element is drawn on: the nearest `data-nc-screen` above it. */
function screenOf(el: Element | null): string | null {
  return el?.closest('[data-nc-screen]')?.getAttribute('data-nc-screen') ?? null;
}

/** The page's text size in px: the sizes below are shares of it, as every size is. */
function textSize(): number {
  return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
}

// the list's place, in px at the usual text size: 4 from the select (the gap
// an action menu leaves under its trigger), and inside a tv's safe area, 48
// from the left and right edges and 27 from the top and bottom.
const GAP = 4;
const SAFE_SIDE = 48;
const SAFE_END = 27;
/** Where neither side of the select has room for the whole list, it keeps at least three rows. */
const LEAST = 3 * 40 + 8;

/**
 * Select — a square native select. Hairline border, mono text, a small blue
 * chevron drawn in the corner. Pass `options` or <option> children.
 *
 * On a tv screen (`data-nc-screen="tv"` on an ancestor) a press opens the
 * system's own list in place of the browser's: a listbox over the dimmed
 * page, with the focus on the value that is set. The arrow keys move, Enter
 * picks, Esc (the remote's back) closes. The native select stays the control:
 * its value, its change event and the ref are what they are off a tv.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { selectSize = 'md', invalid, options, disabled, className, children, onKeyDown, onMouseDown, onFocus, ...rest },
  ref,
) {
  const { words } = useLanguage();
  const selectRef = React.useRef<HTMLSelectElement | null>(null);
  React.useImperativeHandle(ref, () => selectRef.current as HTMLSelectElement);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const shadeRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const listId = React.useId();
  // on a tv the select says that it opens a list; known once it is in the page.
  const [tv, setTv] = React.useState(false);
  const [list, setList] = React.useState<OpenList | null>(null);

  const onTv = () => screenOf(selectRef.current) === 'tv';

  React.useEffect(() => {
    setTv(screenOf(selectRef.current) === 'tv');
  }, []);

  const openList = () => {
    const el = selectRef.current;
    if (!el || el.disabled) return;
    const rows: ListRow[] = Array.from(el.options).map((o, index) => ({
      index,
      label: o.label || o.text,
      disabled: o.disabled || (o.parentElement instanceof HTMLOptGroupElement && o.parentElement.disabled),
    }));
    if (rows.length === 0) return;
    const ownName = el.getAttribute('aria-label');
    const labelledBy = el.getAttribute('aria-labelledby') ?? undefined;
    const name = labelledBy ? undefined : (ownName ?? el.labels?.[0]?.textContent?.trim() ?? words.select.options);
    setTv(true);
    setList({ rows, picked: el.selectedIndex, name: name || words.select.options, labelledBy });
  };

  const closeList = () => {
    setList(null);
    selectRef.current?.focus();
  };

  const rowNodes = () =>
    Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []).filter(
      (el) => el.getAttribute('aria-disabled') !== 'true',
    );

  // the list's place: under the select, above it where there is no room
  // below, inside the safe area and never taller than it. the dimmed page
  // keeps a window on the select.
  const place = React.useCallback(() => {
    const box = boxRef.current;
    const node = listRef.current;
    if (!box || !node) return;
    const unit = textSize() / 16;
    const gap = GAP * unit;
    const side = SAFE_SIDE * unit;
    const end = SAFE_END * unit;
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const r = box.getBoundingClientRect();

    node.style.minWidth = `${Math.max(0, Math.min(r.width, vw - 2 * side))}px`;
    node.style.maxHeight = `${Math.max(0, vh - 2 * end)}px`;
    const h = node.offsetHeight;
    const below = vh - end - (r.bottom + gap);
    const above = r.top - gap - end;
    let top: number;
    if (h <= below) {
      top = r.bottom + gap;
    } else if (h <= above) {
      top = r.top - gap - h;
    } else if (Math.max(below, above) >= LEAST * unit) {
      // neither side holds the whole list: the roomier one, and the list scrolls.
      const room = Math.max(below, above);
      node.style.maxHeight = `${room}px`;
      top = below >= above ? r.bottom + gap : r.top - gap - room;
    } else {
      // a select with no room on either side: the list takes the safe area.
      top = Math.max(end, vh - end - h);
    }
    const w = node.offsetWidth;
    const left = Math.max(side, Math.min(r.left, vw - side - w));
    node.style.top = `${top}px`;
    node.style.left = `${left}px`;
    // shown now, not on the next render: a browser will not focus inside a
    // subtree that is still visibility:hidden, and the focus moves in next.
    node.style.visibility = 'visible';

    const shade = shadeRef.current;
    if (shade) {
      const x1 = r.left;
      const y1 = r.top;
      const x2 = r.right;
      const y2 = r.bottom;
      shade.style.clipPath = `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${x1}px ${y1}px, ${x2}px ${y1}px, ${x2}px ${y2}px, ${x1}px ${y2}px, ${x1}px ${y1}px)`;
    }
  }, []);

  const open = list !== null;

  // first paint of an open list: place it, then the focus goes to the value that is set.
  React.useLayoutEffect(() => {
    if (!open) return;
    place();
    const rows = rowNodes();
    const picked = listRef.current?.querySelector<HTMLElement>('[role="option"][aria-selected="true"]:not([aria-disabled="true"])');
    (picked ?? rows[0] ?? listRef.current)?.focus();
  }, [open, place]);

  // while open: follow the select when the page scrolls or the window changes.
  React.useEffect(() => {
    if (!open) return;
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open, place]);

  const pick = (index: number) => {
    const el = selectRef.current;
    closeList();
    if (!el || index === el.selectedIndex) return;
    // the native select takes the value and says so, as it does off a tv: a
    // controlled select hears its `onChange`, a form reads the value.
    el.selectedIndex = index;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const onListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const rows = rowNodes();
    const at = rows.indexOf(document.activeElement as HTMLElement);
    let next: HTMLElement | undefined;
    switch (e.key) {
      case 'ArrowDown':
        // up and down stop at the first and the last row.
        next = rows[Math.min(at + 1, rows.length - 1)];
        break;
      case 'ArrowUp':
        next = rows[Math.max(at - 1, 0)];
        break;
      case 'Home':
        next = rows[0];
        break;
      case 'End':
        next = rows[rows.length - 1];
        break;
      case 'Enter':
      case ' ':
        if (at >= 0) pick(Number(rows[at].dataset.index));
        break;
      case 'Escape':
        closeList();
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'Tab':
        // the focus stays in the list while it is open.
        break;
      default:
        return;
    }
    // the list took the key: a dialog around the select does not close on
    // this esc, and the app's own focus movement does not move too.
    e.preventDefault();
    e.stopPropagation();
    next?.focus();
  };

  return (
    <div
      ref={boxRef}
      className={cx(
        'nc-select',
        `nc-select--${selectSize}`,
        invalid && 'nc-select--invalid',
        disabled && 'nc-select--disabled',
        className,
      )}
    >
      <select
        ref={selectRef}
        className="nc-select__control"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-haspopup={tv ? 'listbox' : undefined}
        aria-expanded={tv ? open : undefined}
        aria-controls={open ? listId : undefined}
        {...rest}
        onFocus={(e) => {
          onFocus?.(e);
          setTv(onTv());
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.defaultPrevented || !onTv()) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openList();
          } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            // a tv's arrow keys move the focus: here they never step through the values.
            e.preventDefault();
          }
        }}
        onMouseDown={(e) => {
          onMouseDown?.(e);
          if (e.defaultPrevented || e.button !== 0 || !onTv()) return;
          // the browser's own list stays shut; the system's opens.
          e.preventDefault();
          selectRef.current?.focus();
          if (open) closeList();
          else openList();
        }}
      >
        {options
          ? options.map((o) => (
              <option key={o.value} value={o.value} disabled={o.disabled}>
                {o.label}
              </option>
            ))
          : children}
      </select>
      <span className="nc-select__chevron" aria-hidden="true">
        <svg viewBox="0 0 12 12" width="0.75rem" height="0.75rem" fill="none">
          <path d="M3 4.5 L6 7.5 L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {list && typeof document !== 'undefined'
        ? createPortal(
            <div className="nc-select-list">
              <div
                ref={shadeRef}
                className="nc-select-list__shade"
                onMouseDown={(e) => {
                  // a press on the dimmed page closes, and the focus stays with the select.
                  e.preventDefault();
                  closeList();
                }}
              />
              <div
                ref={listRef}
                id={listId}
                role="listbox"
                aria-label={list.name}
                aria-labelledby={list.labelledBy}
                tabIndex={-1}
                className="nc-select-list__box"
                style={{ visibility: 'hidden' }}
                onKeyDown={onListKeyDown}
              >
                {list.rows.map((row) => (
                  <div
                    key={row.index}
                    role="option"
                    data-index={row.index}
                    aria-selected={row.index === list.picked}
                    aria-disabled={row.disabled || undefined}
                    tabIndex={-1}
                    className="nc-select-list__row"
                    onClick={row.disabled ? undefined : () => pick(row.index)}
                  >
                    <svg
                      className="nc-select-list__check"
                      viewBox="0 0 12 12"
                      width="0.75rem"
                      height="0.75rem"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path d="M2 6.5 L5 9.5 L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                    </svg>
                    <span className="nc-select-list__name">{row.label}</span>
                  </div>
                ))}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
});

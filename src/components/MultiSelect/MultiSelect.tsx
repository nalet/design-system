import * as React from 'react';
import { cx } from '../../lib/cx';
import { counted, fill, formatCount, useLanguage } from '../../lib/language';
import { screenOf } from '../../lib/screenOf';
import { Checkbox } from '../Checkbox/Checkbox';
import '../../lib/a11y.css';
import './MultiSelect.css';

export interface MultiSelectOption {
  value: string;
  label: string;
  /** How many items this option would keep, when known. */
  count?: number;
}

/** One action under the options, for options people make themselves. */
export interface MultiSelectAction {
  /** A verb and its object, lowercase: "create a list". A plus is drawn before it. */
  label: React.ReactNode;
  /** Runs once the panel has closed and focus is back on the trigger, so a dialog it opens returns focus there. */
  onSelect: () => void;
}

export interface MultiSelectProps {
  /** The facet's name, shown on the trigger and read as the group's name: "aired". */
  label: string;
  options: MultiSelectOption[];
  /** The chosen values (controlled). Empty means no filter. */
  value: string[];
  onChange: (next: string[]) => void;
  /** The trigger's height: 28, 34 or 42. At `lg` the options are rows 48 high, for a touch screen. */
  size?: 'sm' | 'md' | 'lg';
  /** What the trigger says while nothing is chosen. Default "any", in the page's language. */
  emptyText?: string;
  /**
   * One action in the panel's foot, under the options and before "clear":
   * "create a list". It is there whether or not anything is chosen.
   */
  action?: MultiSelectAction;
  disabled?: boolean;
  className?: string;
}

/** the room the panel keeps from the window's top and bottom edges, as an action menu does. */
const EDGE = 8;
/** under the trigger, and the tallest the options get before they scroll: at the usual text size. */
const GAP = 4;
const LIST_MAX = 320;
/** the least the options keep when the window is very short: one large row. */
const LIST_MIN = 48;

interface Placement {
  /** the panel opens above the trigger. */
  above: boolean;
  /** the options' largest height in px, when the window leaves less than their own. */
  maxHeight: number | null;
}

const PlusGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    width="0.75rem"
    height="0.75rem"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    aria-hidden="true"
    focusable="false"
    className="nc-multiselect__plus"
  >
    <path d="M5 12h14M12 5v14" />
  </svg>
);

/**
 * MultiSelect — a facet that keeps several values: a trigger that says what is
 * chosen ("aired: 2 chosen") and a panel of native checkboxes. A disclosure,
 * not a menu: tab moves through the checkboxes, esc or a press outside closes
 * it, and focus returns to the trigger on esc.
 *
 * The options scroll once they are taller than 320px or the window, and the
 * panel's foot, with an optional action and "clear", stays in view under them.
 */
export function MultiSelect({
  label,
  options,
  value,
  onChange,
  size = 'md',
  emptyText,
  action,
  disabled = false,
  className,
}: MultiSelectProps) {
  const { lang, words } = useLanguage();
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<Placement>({ above: false, maxHeight: null });
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const panelId = React.useId();

  const chosen = options.filter((o) => value.includes(o.value));
  const summary =
    chosen.length === 0
      ? (emptyText ?? words.multiSelect.any)
      : chosen.length === 1
        ? chosen[0].label
        : counted(words.multiSelect.chosen, chosen.length, lang);
  const hasFoot = action != null || chosen.length > 0;

  // where the panel opens, and how tall its options may be: below the trigger
  // while it fits there, above when it doesn't and there is more room above,
  // never closer than 8px to the window's edge.
  const place = React.useCallback(() => {
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    const list = listRef.current;
    if (!trigger || !panel || !list) return;
    const r = trigger.getBoundingClientRect();
    const scale = (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16) / 16;
    // everything in the panel but its options: the foot, the padding, the frame.
    const rest = panel.offsetHeight - list.offsetHeight;
    const wanted = Math.min(list.scrollHeight, LIST_MAX * scale) + rest;
    const below = window.innerHeight - EDGE - (r.bottom + GAP * scale);
    const over = r.top - GAP * scale - EDGE;
    const above = wanted > below && over > below;
    const room = above ? over : below;
    const maxHeight = wanted > room ? Math.max(Math.floor(room - rest), LIST_MIN * scale) : null;
    setPlacement((was) => (was.above === above && was.maxHeight === maxHeight ? was : { above, maxHeight }));
  }, []);

  // measured before the open panel is painted, and again when its content changes.
  React.useLayoutEffect(() => {
    if (open) place();
  }, [open, place, options.length, hasFoot]);

  React.useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    // the options' own scrolling moves nothing; anything else may move the trigger.
    const onMove = (e: Event) => {
      if (e.target instanceof Node && listRef.current?.contains(e.target)) return;
      place();
    };
    document.addEventListener('pointerdown', onPointer, true);
    window.addEventListener('scroll', onMove, true);
    window.addEventListener('resize', onMove);
    return () => {
      document.removeEventListener('pointerdown', onPointer, true);
      window.removeEventListener('scroll', onMove, true);
      window.removeEventListener('resize', onMove);
    };
  }, [open, place]);

  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  const closeToTrigger = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  // a tv's remote has no tab key: up and down go from the trigger through the
  // open panel, in the order it is drawn, and stop at its ends; ok ticks a
  // checkbox, as space does.
  const onRemoteKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const inPanel = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('input, button') ?? []);
      const stops = placement.above ? [...inPanel, trigger] : [trigger, ...inPanel];
      const at = stops.indexOf(document.activeElement as HTMLElement);
      const next = at < 0 ? undefined : stops[at + (e.key === 'ArrowDown' ? 1 : -1)];
      if (next) {
        e.preventDefault();
        next.focus();
      }
    } else if (e.key === 'Enter' && e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      e.preventDefault();
      e.target.click();
    }
  };

  return (
    <div
      ref={wrapRef}
      className={cx('nc-multiselect', `nc-multiselect--${size}`, open && 'nc-multiselect--open', className)}
      onKeyDown={(e) => {
        if (!open) return;
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          closeToTrigger();
        } else if (screenOf(wrapRef.current) === 'tv') {
          onRemoteKey(e);
        }
      }}
      onBlur={(e) => {
        if (open && !wrapRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className={cx('nc-multiselect__trigger', chosen.length > 0 && 'nc-multiselect__trigger--active')}
        aria-expanded={open}
        aria-controls={panelId}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
      >
        {/* real spaces, so the name reads "state 2 chosen", not "state2 chosen". */}
        <span className="nc-multiselect__label">{label}</span>{' '}
        <span className="nc-multiselect__summary">{summary}</span>
        <svg viewBox="0 0 12 12" width="0.75rem" height="0.75rem" fill="none" aria-hidden="true" className="nc-multiselect__chevron">
          <path d="M3 4.5 L6 7.5 L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      </button>
      <div
        ref={panelRef}
        id={panelId}
        className={cx('nc-multiselect__panel', placement.above && 'nc-multiselect__panel--above')}
        hidden={!open}
      >
        {/* the options scroll in a part of their own; the foot stays outside it, in view. */}
        <div
          ref={listRef}
          className="nc-multiselect__list"
          style={placement.maxHeight != null ? { maxHeight: placement.maxHeight } : undefined}
        >
          <fieldset className="nc-multiselect__options">
            <legend className="nc-sr-only">{label}</legend>
            {options.map((o) => (
              <Checkbox
                key={o.value}
                className="nc-multiselect__option"
                checked={value.includes(o.value)}
                onChange={() => toggle(o.value)}
                label={
                  <span className="nc-multiselect__option-label">
                    {o.label}
                    {o.count != null ? ' ' : null}
                    {o.count != null ? (
                      <span className="nc-multiselect__option-count">{formatCount(o.count, lang)}</span>
                    ) : null}
                  </span>
                }
              />
            ))}
          </fieldset>
        </div>
        {hasFoot ? (
          <div className="nc-multiselect__foot">
            {action ? (
              <button
                type="button"
                className="nc-multiselect__action"
                onClick={() => {
                  // close first, as an action menu's item does: what the action
                  // opens gives focus back to the trigger.
                  closeToTrigger();
                  action.onSelect();
                }}
              >
                <PlusGlyph />
                <span>{action.label}</span>
              </button>
            ) : null}
            {chosen.length > 0 ? (
              <button
                type="button"
                className="nc-multiselect__clear"
                onClick={() => {
                  // the button goes once nothing is chosen: focus returns to the trigger.
                  onChange([]);
                  closeToTrigger();
                }}
              >
                {fill(words.multiSelect.clear, { name: label })}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

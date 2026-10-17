import * as React from 'react';
import { cx } from '../../lib/cx';
import { formatCount } from '../../lib/format';
import { Checkbox } from '../Checkbox/Checkbox';
import '../../lib/a11y.css';
import './MultiSelect.css';

export interface MultiSelectOption {
  value: string;
  label: string;
  /** how many items this option would keep, when known. */
  count?: number;
}

export interface MultiSelectProps {
  /** the facet's name, shown on the trigger and read as the group's name: "aired". */
  label: string;
  options: MultiSelectOption[];
  /** the chosen values (controlled). empty means no filter. */
  value: string[];
  onChange: (next: string[]) => void;
  size?: 'sm' | 'md';
  /** what the trigger says while nothing is chosen. default "any". */
  emptyText?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * MultiSelect — a facet that keeps several values: a trigger that says what is
 * chosen ("aired: 2 chosen") and a panel of native checkboxes. a disclosure,
 * not a menu: tab moves through the checkboxes, esc or a press outside closes
 * it, and focus returns to the trigger on esc.
 */
export function MultiSelect({
  label,
  options,
  value,
  onChange,
  size = 'md',
  emptyText = 'any',
  disabled = false,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelId = React.useId();

  const chosen = options.filter((o) => value.includes(o.value));
  const summary =
    chosen.length === 0 ? emptyText : chosen.length === 1 ? chosen[0].label : `${formatCount(chosen.length)} chosen`;

  React.useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer, true);
    return () => document.removeEventListener('pointerdown', onPointer, true);
  }, [open]);

  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  return (
    <div
      ref={wrapRef}
      className={cx('nc-multiselect', `nc-multiselect--${size}`, open && 'nc-multiselect--open', className)}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
          triggerRef.current?.focus();
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
        <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true" className="nc-multiselect__chevron">
          <path d="M3 4.5 L6 7.5 L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      </button>
      <div id={panelId} className="nc-multiselect__panel" hidden={!open}>
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
                  {o.count != null ? <span className="nc-multiselect__option-count">{formatCount(o.count)}</span> : null}
                </span>
              }
            />
          ))}
        </fieldset>
        {chosen.length > 0 ? (
          <button
            type="button"
            className="nc-multiselect__clear"
            onClick={() => {
              // the button goes once nothing is chosen: focus returns to the trigger.
              onChange([]);
              setOpen(false);
              triggerRef.current?.focus();
            }}
          >
            clear {label}
          </button>
        ) : null}
      </div>
    </div>
  );
}

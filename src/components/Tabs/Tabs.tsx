import * as React from 'react';
import { cx } from '../../lib/cx';
import './Tabs.css';

export interface TabItem {
  /** Unique value/id for the tab. */
  value: string;
  /** Label, lowercase. */
  label: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: TabItem[];
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  onChange?: (value: string) => void;
}

/**
 * Tabs — a row of mono tab triggers with a cloud-blue active underline.
 * Controlled via `value`/`onChange` or uncontrolled via `defaultValue`.
 * Roving arrow-key focus, square corners.
 */
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { items, value, defaultValue, onChange, className, ...rest },
  ref,
) {
  const [internal, setInternal] = React.useState<string>(
    defaultValue ?? items[0]?.value ?? '',
  );
  const active = value ?? internal;

  const select = (next: string) => {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const enabled = items.filter((i) => !i.disabled);
    const idx = enabled.findIndex((i) => i.value === active);
    if (idx < 0) return;
    let next: TabItem | undefined;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      next = enabled[(idx + dir + enabled.length) % enabled.length];
    } else if (e.key === 'Home') {
      next = enabled[0];
    } else if (e.key === 'End') {
      next = enabled[enabled.length - 1];
    }
    if (!next) return;
    e.preventDefault();
    select(next.value);
    // selection follows focus: move focus to the tab just selected.
    const list = e.currentTarget.parentElement;
    const target = Array.from(list?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []).find(
      (b) => b.dataset.value === next!.value,
    );
    target?.focus();
  };

  return (
    <div ref={ref} className={cx('nc-tabs', className)} {...rest}>
      <div className="nc-tabs__list" role="tablist">
        {items.map((item) => {
          const selected = item.value === active;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              data-value={item.value}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              className={cx('nc-tabs__tab', selected && 'nc-tabs__tab--active')}
              onClick={() => select(item.value)}
              onKeyDown={onKeyDown}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
});

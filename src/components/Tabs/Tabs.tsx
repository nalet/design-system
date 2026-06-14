import * as React from 'react';
import { cx } from '../../lib/cx';
import './Tabs.css';

export interface TabItem {
  /** unique value/id for the tab. */
  value: string;
  /** label, lowercase. */
  label: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: TabItem[];
  /** controlled selected value. */
  value?: string;
  /** uncontrolled initial value. */
  defaultValue?: string;
  onChange?: (value: string) => void;
}

/**
 * Tabs — a row of mono tab triggers with a cloud-blue active underline.
 * controlled via `value`/`onChange` or uncontrolled via `defaultValue`.
 * roving arrow-key focus, square corners.
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
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const next = enabled[(idx + dir + enabled.length) % enabled.length];
      if (next) select(next.value);
    }
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

import * as React from 'react';
import { cx } from '../../lib/cx';
import './Divider.css';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** axis of the rule. default horizontal. */
  orientation?: 'horizontal' | 'vertical';
  /** use the heavier divider token. default false (hairline). */
  heavy?: boolean;
  /** optional inline label, centered on the rule (horizontal only). */
  label?: React.ReactNode;
}

/**
 * Divider — a hairline rule in var(--border). heavier variant uses --border-2.
 * optionally carries a small mono label split across the line.
 */
export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { orientation = 'horizontal', heavy, label, className, ...rest },
  ref,
) {
  const isVertical = orientation === 'vertical';
  if (label && !isVertical) {
    return (
      <div
        ref={ref}
        className={cx('nc-divider', 'nc-divider--labeled', heavy && 'nc-divider--heavy', className)}
        role="separator"
        {...rest}
      >
        <span className="nc-divider__line" />
        <span className="nc-divider__label">{label}</span>
        <span className="nc-divider__line" />
      </div>
    );
  }
  return (
    <div
      ref={ref}
      className={cx(
        'nc-divider',
        isVertical ? 'nc-divider--vertical' : 'nc-divider--horizontal',
        heavy && 'nc-divider--heavy',
        className,
      )}
      role="separator"
      aria-orientation={orientation}
      {...rest}
    />
  );
});

import * as React from 'react';
import { cx } from '../../lib/cx';
import './Tooltip.css';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** the tooltip text/content, lowercase. */
  content: React.ReactNode;
  /** placement relative to the trigger. default top. */
  side?: TooltipSide;
  /** the trigger element. */
  children: React.ReactNode;
  className?: string;
}

/**
 * Tooltip — a small square label shown on hover/focus. mono, hairline border,
 * shows on pointer hover and keyboard focus-within. css-only visibility.
 */
export function Tooltip({ content, side = 'top', children, className }: TooltipProps) {
  const id = React.useId();
  return (
    <span className={cx('nc-tooltip', className)}>
      <span className="nc-tooltip__trigger" aria-describedby={id} tabIndex={0}>
        {children}
      </span>
      <span role="tooltip" id={id} className={cx('nc-tooltip__bubble', `nc-tooltip__bubble--${side}`)}>
        {content}
      </span>
    </span>
  );
}

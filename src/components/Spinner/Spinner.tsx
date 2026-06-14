import * as React from 'react';
import { cx } from '../../lib/cx';
import './Spinner.css';

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** diameter in px. default 16. */
  size?: number;
  /** stroke color. defaults to currentColor so it inherits. */
  color?: string;
  /** accessible label announced to screen readers. default 'loading'. */
  label?: string;
}

/**
 * Spinner — a square-cornered ring that rotates. inherits currentColor.
 * the one rotating thing in an otherwise still, terminal ui.
 */
export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 16, color, label = 'loading', className, style, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cx('nc-spinner', className)}
      role="status"
      aria-label={label}
      style={{ width: size, height: size, color, ...style }}
      {...rest}
    >
      <svg viewBox="0 0 16 16" width={size} height={size} fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
        <path
          className="nc-spinner__arc"
          d="M8 1.5 A6.5 6.5 0 0 1 14.5 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="butt"
        />
      </svg>
    </span>
  );
});

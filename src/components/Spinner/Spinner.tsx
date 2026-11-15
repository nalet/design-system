import * as React from 'react';
import { cx } from '../../lib/cx';
import { useLanguage } from '../../lib/language';
import './Spinner.css';
import { rem } from '../../lib/rem';

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Width and height in px. Default 16. */
  size?: number;
  /** Stroke color. Defaults to currentColor so it inherits. */
  color?: string;
  /** Accessible label announced to screen readers. Default 'loading', in the page's language. */
  label?: string;
}

/** The share of the frame that is lit; the rest is the gap that travels round. */
const LIT = 0.75;

/**
 * Spinner — a still square frame with three quarters of it lit, the gap
 * running round it at a steady pace, one lap in four seconds. The frame never moves, so the loader
 * stays calm; only the snake says "working". Under reduced motion it stands
 * still and the label carries the state. Inherits currentColor.
 */
export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 16, color, label, className, style, ...rest },
  ref,
) {
  const { words } = useLanguage();
  // the stroke grows with the size: 2px up to 24px, then a pixel per 16px.
  const stroke = Math.max(2, Math.round(size / 16));
  const side = size - stroke;
  const o = stroke / 2;
  // the frame's length in px: the dash pattern and the animation are measured
  // in it, so no browser has to support pathLength.
  const perimeter = 4 * side;
  // the square starts in the middle of its top edge, not at a corner: where the
  // snake crosses the path's start its two ends meet on a straight line, so no
  // corner ever shows a notch.
  const d = `M${o + side / 2} ${o}H${o + side}V${o + side}H${o}V${o}Z`;
  const frame = { d, strokeWidth: stroke };

  return (
    <span
      ref={ref}
      className={cx('nc-spinner', className)}
      role="status"
      aria-label={label ?? words.spinner.loading}
      style={{ width: rem(size), height: rem(size), color, ...style }}
      {...rest}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={rem(size)}
        height={rem(size)}
        fill="none"
        aria-hidden="true"
        style={{ '--nc-spinner-travel': `${-perimeter}px` } as React.CSSProperties}
      >
        <path className="nc-spinner__frame" {...frame} />
        <path
          className="nc-spinner__snake"
          {...frame}
          style={{ strokeDasharray: `${perimeter * LIT}px ${perimeter * (1 - LIT)}px` }}
        />
      </svg>
    </span>
  );
});

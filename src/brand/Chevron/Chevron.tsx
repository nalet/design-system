import * as React from 'react';
import { cx } from '../../lib/cx';
import './Chevron.css';

export interface ChevronProps extends React.SVGProps<SVGSVGElement> {
  /** glyph edge length in px. default 16. */
  size?: number;
  /** stroke weight relative to size. default proportional. */
  strokeWidth?: number;
  /** override the brand blue. defaults to var(--cloud-blue). */
  color?: string;
}

/**
 * Chevron — the brand glyph. a single `>` drawn in cloud-blue.
 * the one mark that says nalet. always blue unless explicitly overridden.
 */
export const Chevron = React.forwardRef<SVGSVGElement, ChevronProps>(function Chevron(
  { size = 16, strokeWidth, color, className, style, ...rest },
  ref,
) {
  const sw = strokeWidth ?? Math.max(1.5, size * 0.14);
  return (
    <svg
      ref={ref}
      className={cx('nc-chevron', className)}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      role="img"
      aria-label="chevron"
      style={{ color: color ?? undefined, ...style }}
      {...rest}
    >
      <path
        d="M5 3 L11 8 L5 13"
        stroke="currentColor"
        strokeWidth={(sw / size) * 16}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

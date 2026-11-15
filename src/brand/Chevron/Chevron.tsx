import * as React from 'react';
import { cx } from '../../lib/cx';
import './Chevron.css';
import { rem } from '../../lib/rem';

export interface ChevronProps extends React.SVGProps<SVGSVGElement> {
  /** Glyph edge length in px at the usual text size; it grows with the reader's. Default 16. */
  size?: number;
  /** Stroke weight relative to size. Default proportional. */
  strokeWidth?: number;
  /** Override the brand blue. Defaults to var(--cloud-blue). */
  color?: string;
}

/**
 * Chevron — the brand glyph. A single `>` drawn in cloud-blue.
 * The one mark that says nalet. Always blue unless explicitly overridden.
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
      width={rem(size)}
      height={rem(size)}
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

import * as React from 'react';
import type { LucideIcon, LucideProps } from 'lucide-react';
import { cx } from '../../lib/cx';
import './Icon.css';

export interface IconProps extends Omit<LucideProps, 'ref' | 'size'> {
  /** the lucide icon component, e.g. `import { Terminal } from 'lucide-react'`. */
  icon: LucideIcon;
  /** edge length in px. default 16 (matches ui type). */
  size?: number;
}

/**
 * Icon — thin wrapper over a lucide icon. enforces a consistent thin stroke
 * and inherits currentColor so it tints with surrounding text.
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(function Icon(
  { icon: LucideGlyph, size = 16, strokeWidth = 1.75, className, ...rest },
  ref,
) {
  return (
    <LucideGlyph
      ref={ref}
      className={cx('nc-icon', className)}
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden={rest['aria-label'] ? undefined : true}
      {...rest}
    />
  );
});

import * as React from 'react';
import { cx } from '../../lib/cx';
import './Badge.css';

export type BadgeTone = 'neutral' | 'green' | 'amber' | 'blue';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color tone. `green`=ok, `amber`=warn, `blue`=info, `neutral`=default. */
  tone?: BadgeTone;
  /** Prefix a small status dot. */
  dot?: boolean;
}

/**
 * Badge — a small square status chip. Mono, lowercase, hairline border.
 * green/amber map to the signal tokens; blue to cloud-blue.
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'neutral', dot, className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cx('nc-badge', `nc-badge--${tone}`, className)} {...rest}>
      {dot ? <span className="nc-badge__dot" aria-hidden="true" /> : null}
      {children != null ? <span className="nc-badge__label">{children}</span> : null}
    </span>
  );
});

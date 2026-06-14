import * as React from 'react';
import { cx } from '../../lib/cx';
import './Heading.css';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** heading level. 1 maps to h1 role, 2 to h2. default 1. */
  level?: 1 | 2;
  /** prefix the heading with the brand chevron mark in cloud-blue. */
  chevron?: boolean;
}

/**
 * Heading — mono display type at the h1/h2 roles. always JetBrains Mono.
 * optionally led by a blue `>` to set the terminal tone.
 */
export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { level = 1, chevron, className, children, ...rest },
  ref,
) {
  const Tag = (level === 1 ? 'h1' : 'h2') as React.ElementType;
  return (
    <Tag ref={ref} className={cx('nc-heading', `nc-heading--h${level}`, className)} {...rest}>
      {chevron ? <span className="nc-heading__chevron" aria-hidden="true">&gt;</span> : null}
      {children}
    </Tag>
  );
});

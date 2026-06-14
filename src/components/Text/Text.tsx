import * as React from 'react';
import { cx } from '../../lib/cx';
import './Text.css';

export type TextVariant = 'body' | 'ui' | 'muted' | 'dim' | 'code';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** type role. body/ui use Inter, code uses mono. muted/dim shift color. */
  variant?: TextVariant;
  /** render a different element. default 'span'. */
  as?: keyof JSX.IntrinsicElements;
  /** truncate to a single line with an ellipsis. */
  truncate?: boolean;
}

/**
 * Text — inline/block copy at one of the documented type roles.
 * body and ui are Inter; code is mono; muted and dim only restyle the color.
 */
export const Text = React.forwardRef<HTMLElement, TextProps>(function Text(
  { variant = 'body', as = 'span', truncate, className, ...rest },
  ref,
) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref}
      className={cx('nc-text', `nc-text--${variant}`, truncate && 'nc-text--truncate', className)}
      {...rest}
    />
  );
});

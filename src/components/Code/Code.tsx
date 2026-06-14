import * as React from 'react';
import { cx } from '../../lib/cx';
import './Code.css';

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  /** render as a block (<pre><code>) instead of inline. */
  block?: boolean;
}

/**
 * Code — mono code text. inline by default; `block` renders a square,
 * scrollable terminal block on the deeper canvas.
 */
export const Code = React.forwardRef<HTMLElement, CodeProps>(function Code(
  { block, className, children, ...rest },
  ref,
) {
  if (block) {
    return (
      <pre
        ref={ref as React.Ref<HTMLPreElement>}
        className={cx('nc-code', 'nc-code--block', className)}
        {...(rest as React.HTMLAttributes<HTMLPreElement>)}
      >
        <code>{children}</code>
      </pre>
    );
  }
  return (
    <code ref={ref} className={cx('nc-code', 'nc-code--inline', className)} {...rest}>
      {children}
    </code>
  );
});

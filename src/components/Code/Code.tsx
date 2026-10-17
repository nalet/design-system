import * as React from 'react';
import { cx } from '../../lib/cx';
import { useOverflowX } from '../../lib/useOverflowX';
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
  const preRef = React.useRef<HTMLPreElement>(null);
  const codeRef = React.useRef<HTMLElement>(null);
  React.useImperativeHandle(ref, () => (block ? preRef.current : codeRef.current) as HTMLElement, [block]);
  // a block whose lines run past its edge scrolls; while it does it is a
  // focusable, named region so the keyboard can scroll it (your own tabIndex,
  // role or aria-label win).
  const overflowing = useOverflowX(preRef);
  if (block) {
    const region = overflowing ? { tabIndex: 0, role: 'region', 'aria-label': 'code' } : {};
    return (
      <pre
        ref={preRef}
        className={cx('nc-code', 'nc-code--block', className)}
        {...region}
        {...(rest as React.HTMLAttributes<HTMLPreElement>)}
      >
        <code>{children}</code>
      </pre>
    );
  }
  return (
    <code ref={codeRef} className={cx('nc-code', 'nc-code--inline', className)} {...rest}>
      {children}
    </code>
  );
});

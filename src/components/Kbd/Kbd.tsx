import * as React from 'react';
import { cx } from '../../lib/cx';
import './Kbd.css';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {}

/**
 * Kbd — a single keycap. square, hairline border, mono. e.g. <Kbd>esc</Kbd>.
 */
export const Kbd = React.forwardRef<HTMLElement, KbdProps>(function Kbd(
  { className, ...rest },
  ref,
) {
  return <kbd ref={ref} className={cx('nc-kbd', className)} {...rest} />;
});

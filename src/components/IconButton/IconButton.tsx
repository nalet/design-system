import * as React from 'react';
import { cx } from '../../lib/cx';
import { Spinner } from '../Spinner/Spinner';
import './IconButton.css';

export type IconButtonVariant = 'primary' | 'default' | 'ghost' | 'danger';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** required for accessibility — icon-only buttons need a name. */
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
}

/**
 * IconButton — a square icon-only button. same variants as Button, equal
 * width and height. `label` is mandatory and becomes aria-label.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, variant = 'default', size = 'md', loading = false, disabled, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cx('nc-iconbtn', `nc-iconbtn--${variant}`, `nc-iconbtn--${size}`, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner size={size === 'sm' ? 12 : 14} /> : children}
    </button>
  );
});

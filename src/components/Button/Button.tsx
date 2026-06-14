import * as React from 'react';
import { cx } from '../../lib/cx';
import { Spinner } from '../Spinner/Spinner';
import './Button.css';

export type ButtonVariant = 'primary' | 'default' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = cloud-blue cta, default = surface+border, ghost = bare, danger = amber/red. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** show a spinner and block clicks. keeps width stable. */
  loading?: boolean;
  /** stretch to the full width of the container. */
  block?: boolean;
  /** optional leading node (icon). hidden while loading. */
  leading?: React.ReactNode;
  /** optional trailing node (icon). */
  trailing?: React.ReactNode;
}

/**
 * Button — square, mono-labeled action. primary is the cloud-blue cta.
 * labels stay lowercase. loading swaps the leading slot for a spinner.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'default',
    size = 'md',
    loading = false,
    block = false,
    leading,
    trailing,
    disabled,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'nc-btn',
        `nc-btn--${variant}`,
        `nc-btn--${size}`,
        block && 'nc-btn--block',
        loading && 'nc-btn--loading',
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span className="nc-btn__slot">
          <Spinner size={size === 'sm' ? 12 : 14} />
        </span>
      ) : leading ? (
        <span className="nc-btn__slot">{leading}</span>
      ) : null}
      <span className="nc-btn__label">{children}</span>
      {trailing && !loading ? <span className="nc-btn__slot">{trailing}</span> : null}
    </button>
  );
});

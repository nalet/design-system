import * as React from 'react';
import { cx } from '../../lib/cx';
import { Spinner } from '../Spinner/Spinner';
import './Button.css';

export type ButtonVariant = 'primary' | 'default' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** `primary` = cloud-blue CTA, `default` = surface+border, `ghost` = bare, `danger` = amber/red. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Show a spinner and block clicks. Keeps width stable. */
  loading?: boolean;
  /** Stretch to the full width of the container. */
  block?: boolean;
  /** Optional leading node (icon). Hidden while loading. */
  leading?: React.ReactNode;
  /** Optional trailing node (icon). */
  trailing?: React.ReactNode;
}

/**
 * Button — square, mono-labeled action. Primary is the cloud-blue CTA.
 * Labels stay lowercase. Loading swaps the leading slot for a spinner.
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

import * as React from 'react';
import { cx } from '../../lib/cx';
import { Spinner } from '../Spinner/Spinner';
import './IconButton.css';

export type IconButtonVariant = 'primary' | 'default' | 'ghost' | 'danger';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required for accessibility — icon-only buttons need a name. */
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
  /**
   * On or off: the button holds a state that one press turns on and the next
   * turns off. Give it in both states (`false` is off) and leave it out for a
   * button that only acts. The `label` stays the same action in both states;
   * the state is told as `aria-pressed`. Only the `default` and the `ghost`
   * variants can be on: `primary` and `danger` ignore it.
   */
  pressed?: boolean;
}

/**
 * IconButton — a square icon-only button. Same variants as Button, equal
 * width and height. `label` is mandatory and becomes aria-label. With
 * `pressed` it is a toggle button: on, it shows a blue bar along its bottom
 * edge over the faint tint of a selected row.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    label,
    variant = 'default',
    size = 'md',
    loading = false,
    pressed,
    'aria-pressed': ariaPressed,
    disabled,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  // the emphasized kind is the next step and the danger kind deletes
  // something: neither holds a state, so neither says one, and a screen
  // reader never hears a state that the screen doesn't show.
  const state = variant === 'default' || variant === 'ghost' ? (pressed ?? ariaPressed) : undefined;
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      aria-pressed={state}
      className={cx('nc-iconbtn', `nc-iconbtn--${variant}`, `nc-iconbtn--${size}`, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner size={size === 'sm' ? 12 : 14} /> : children}
    </button>
  );
});

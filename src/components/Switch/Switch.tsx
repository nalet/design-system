import * as React from 'react';
import { cx } from '../../lib/cx';
import './Switch.css';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** label rendered beside the switch. */
  label?: React.ReactNode;
  size?: 'sm' | 'md';
}

/**
 * Switch — a square on/off toggle. blue track when on, square thumb that
 * slides. honors the no-radius rule: even the thumb is square.
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, size = 'md', disabled, className, id, ...rest },
  ref,
) {
  return (
    <label className={cx('nc-switch', `nc-switch--${size}`, disabled && 'nc-switch--disabled', className)}>
      <span className="nc-switch__track">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          role="switch"
          className="nc-switch__input"
          disabled={disabled}
          {...rest}
        />
        <span className="nc-switch__thumb" aria-hidden="true" />
      </span>
      {label != null ? <span className="nc-switch__label">{label}</span> : null}
    </label>
  );
});

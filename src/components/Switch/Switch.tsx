import * as React from 'react';
import { cx } from '../../lib/cx';
import { pressOnTv } from '../../lib/screen';
import './Switch.css';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label rendered beside the switch. */
  label?: React.ReactNode;
  /** `sm` for dense rows, `md` the usual one, `lg` the size a touch screen and a TV draw. Default md. */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Switch — a square on/off toggle. Blue track when on, square thumb that
 * slides. Honors the no-radius rule: even the thumb is square. On a screen
 * made for touch and on a tv it is drawn large whatever `size` says, and on a
 * tv Enter (the remote's OK) flips it as Space does.
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, size = 'md', disabled, className, id, onKeyDown, ...rest },
  ref,
) {
  return (
    <label
      className={cx(
        'nc-switch',
        `nc-switch--${size}`,
        // with a label the whole row is the target; a screen made for touch or a tv sizes the row by it.
        label != null && 'nc-switch--labelled',
        disabled && 'nc-switch--disabled',
        className,
      )}
    >
      <span className="nc-switch__track">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          role="switch"
          className="nc-switch__input"
          disabled={disabled}
          {...rest}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            // a remote has no space bar: on a tv, ok (enter) flips the switch.
            pressOnTv(e);
          }}
        />
        <span className="nc-switch__thumb" aria-hidden="true" />
      </span>
      {label != null ? <span className="nc-switch__label">{label}</span> : null}
    </label>
  );
});

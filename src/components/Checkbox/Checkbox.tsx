import * as React from 'react';
import { cx } from '../../lib/cx';
import { pressOnTv } from '../../lib/screen';
import './Checkbox.css';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label rendered beside the box. */
  label?: React.ReactNode;
  /** Render the indeterminate dash state. */
  indeterminate?: boolean;
}

/**
 * Checkbox — a square checkbox with a blue fill when on. Supports the
 * indeterminate dash. Label sits to the right in ui type. On a tv Enter (the
 * remote's OK) ticks it as Space does.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, indeterminate = false, disabled, className, id, onKeyDown, ...rest },
  ref,
) {
  const innerRef = React.useRef<HTMLInputElement | null>(null);
  React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);
  React.useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label
      className={cx(
        'nc-checkbox',
        // with a label the whole row is the target; a screen made for touch or a tv sizes the row by it.
        label != null && 'nc-checkbox--labelled',
        disabled && 'nc-checkbox--disabled',
        className,
      )}
    >
      <span className="nc-checkbox__box">
        <input
          ref={innerRef}
          id={id}
          type="checkbox"
          className="nc-checkbox__input"
          disabled={disabled}
          {...rest}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            // a remote has no space bar: on a tv, ok (enter) ticks the box.
            pressOnTv(e);
          }}
        />
        <span className="nc-checkbox__mark" aria-hidden="true">
          {indeterminate ? (
            <svg viewBox="0 0 12 12" width="0.75rem" height="0.75rem" fill="none">
              <path d="M2.5 6 H9.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 12 12" width="0.75rem" height="0.75rem" fill="none">
              <path d="M2.5 6.2 L5 8.7 L9.5 3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </span>
      {label != null ? <span className="nc-checkbox__label">{label}</span> : null}
    </label>
  );
});

import * as React from 'react';
import { cx } from '../../lib/cx';
import './Field.css';

export interface FieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** field label, lowercase. */
  label?: React.ReactNode;
  /** helper text below the control. */
  hint?: React.ReactNode;
  /** error text. when set, replaces the hint and tints amber. */
  error?: React.ReactNode;
  /** mark the field required (adds a subtle marker). */
  required?: boolean;
  /** the control to wrap. receives id / aria-describedby / aria-invalid. */
  children: React.ReactElement;
  /** id for the control. auto-generated when omitted. */
  htmlFor?: string;
}

/**
 * Field — label + control + hint/error in a vertical stack. wires the control's
 * id, aria-describedby and aria-invalid so it stays accessible by default.
 */
export const Field = React.forwardRef<HTMLDivElement, FieldProps>(function Field(
  { label, hint, error, required, children, htmlFor, className, ...rest },
  ref,
) {
  const reactId = React.useId();
  const controlId = htmlFor ?? (children.props.id as string | undefined) ?? `nc-field-${reactId}`;
  const describedById = hint || error ? `${controlId}-desc` : undefined;

  const control = React.cloneElement(children, {
    id: controlId,
    'aria-describedby': cx(children.props['aria-describedby'], describedById) || undefined,
    'aria-invalid': error ? true : children.props['aria-invalid'],
    invalid: error ? true : children.props.invalid,
  });

  return (
    <div ref={ref} className={cx('nc-field', className)} {...rest}>
      {label != null ? (
        <label className="nc-field__label" htmlFor={controlId}>
          {label}
          {required ? <span className="nc-field__req" aria-hidden="true"> *</span> : null}
        </label>
      ) : null}
      {control}
      {error ? (
        <span id={describedById} className="nc-field__msg nc-field__msg--error">
          {error}
        </span>
      ) : hint ? (
        <span id={describedById} className="nc-field__msg nc-field__msg--hint">
          {hint}
        </span>
      ) : null}
    </div>
  );
});

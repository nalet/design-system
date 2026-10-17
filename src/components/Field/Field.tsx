import * as React from 'react';
import { cx } from '../../lib/cx';
import './Field.css';

/** The props Field reads from and passes to its control. */
export interface FieldControlProps {
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  invalid?: boolean;
}

export interface FieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Field label, in sentence case: it is set in the body face and shown as written. */
  label?: React.ReactNode;
  /** Helper text below the control. */
  hint?: React.ReactNode;
  /** Error text. When set, replaces the hint, renders in --state-error and marks the control invalid. */
  error?: React.ReactNode;
  /** Mark the field required (adds a subtle marker). */
  required?: boolean;
  /** The control to wrap. Receives `id` / `aria-describedby` / `aria-invalid`. */
  children: React.ReactElement<FieldControlProps>;
  /** ID for the control. Auto-generated when omitted. */
  htmlFor?: string;
}

/**
 * Field — label + control + hint/error in a vertical stack. Wires the control's
 * `id`, `aria-describedby` and `aria-invalid` so it stays accessible by default.
 */
export const Field = React.forwardRef<HTMLDivElement, FieldProps>(function Field(
  { label, hint, error, required, children, htmlFor, className, ...rest },
  ref,
) {
  const reactId = React.useId();
  const controlId = htmlFor ?? children.props.id ?? `nc-field-${reactId}`;
  const describedById = hint || error ? `${controlId}-desc` : undefined;

  // only an error sets invalid: passing the child's own (often unset) value back
  // would override what the control derives from its `invalid` prop.
  const control = React.cloneElement(children, {
    id: controlId,
    'aria-describedby': cx(children.props['aria-describedby'], describedById) || undefined,
    ...(error ? { 'aria-invalid': true, invalid: true } : {}),
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

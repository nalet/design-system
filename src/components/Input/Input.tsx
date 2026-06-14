import * as React from 'react';
import { cx } from '../../lib/cx';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** size variant. default md. */
  inputSize?: 'sm' | 'md' | 'lg';
  /** paint the error (amber) border. */
  invalid?: boolean;
  /** node rendered inside the field on the left (e.g. an icon or `>`). */
  leading?: React.ReactNode;
  /** node rendered inside the field on the right. */
  trailing?: React.ReactNode;
}

/**
 * Input — a square text field. mono text, hairline border, cyan focus ring.
 * optional in-field prefix/suffix slots for icons or the brand chevron.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { inputSize = 'md', invalid, leading, trailing, disabled, className, ...rest },
  ref,
) {
  return (
    <div
      className={cx(
        'nc-input',
        `nc-input--${inputSize}`,
        invalid && 'nc-input--invalid',
        disabled && 'nc-input--disabled',
        className,
      )}
    >
      {leading ? <span className="nc-input__affix nc-input__affix--prefix">{leading}</span> : null}
      <input
        ref={ref}
        className="nc-input__control"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        {...rest}
      />
      {trailing ? <span className="nc-input__affix nc-input__affix--suffix">{trailing}</span> : null}
    </div>
  );
});

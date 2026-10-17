import * as React from 'react';
import { cx } from '../../lib/cx';
import './Textarea.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Paint the error border (--state-error) and set aria-invalid. */
  invalid?: boolean;
}

/**
 * Textarea — a square multiline field. Mono text, hairline border, cyan focus.
 * Vertical resize only.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, rows = 4, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cx('nc-textarea', invalid && 'nc-textarea--invalid', className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
});

import * as React from 'react';
import { cx } from '../../lib/cx';
import './Select.css';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  selectSize?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  /** optional declarative options. children take precedence when provided. */
  options?: SelectOption[];
}

/**
 * Select — a square native select. hairline border, mono text, a small blue
 * chevron drawn in the corner. pass `options` or <option> children.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { selectSize = 'md', invalid, options, disabled, className, children, ...rest },
  ref,
) {
  return (
    <div
      className={cx(
        'nc-select',
        `nc-select--${selectSize}`,
        invalid && 'nc-select--invalid',
        disabled && 'nc-select--disabled',
        className,
      )}
    >
      <select
        ref={ref}
        className="nc-select__control"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        {...rest}
      >
        {options
          ? options.map((o) => (
              <option key={o.value} value={o.value} disabled={o.disabled}>
                {o.label}
              </option>
            ))
          : children}
      </select>
      <span className="nc-select__chevron" aria-hidden="true">
        <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
          <path d="M3 4.5 L6 7.5 L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
});

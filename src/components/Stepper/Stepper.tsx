import * as React from 'react';
import { cx } from '../../lib/cx';
import { useLanguage } from '../../lib/language';
import { changeInputValue, onTv, startsOnTheRight, useKeysLeftAlone } from '../../lib/nativeStep';
import './Stepper.css';

export interface StepperProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'value' | 'defaultValue' | 'min' | 'max' | 'step'> {
  /** The value, when the app holds it. Use with `onChange`. */
  value?: number | string;
  /** The value to start from, when the stepper holds it. */
  defaultValue?: number;
  /** The lowest value. At it, minus is dimmed and does nothing. */
  min?: number;
  /** The highest value. At it, plus is dimmed and does nothing. */
  max?: number;
  /** The size of one step. Default 1. */
  step?: number;
  /** The height of a field: sm 28, md 34 (the default), lg 42. */
  size?: 'sm' | 'md' | 'lg';
  /** The unit, short, after the value: "s". */
  unit?: string;
  /** The value in full, for a screen reader: "5 seconds". */
  formatValue?: (value: number) => string;
  /** The minus button's name, after the value it changes: "fewer seconds". Default "less". */
  minusLabel?: string;
  /** The plus button's name: "more seconds". Default "more". */
  plusLabel?: string;
  /** Paint the error border and set aria-invalid. A field's `error` sets it. */
  invalid?: boolean;
}

const places = (n: number | undefined) => (n == null || Number.isInteger(n) ? 0 : (String(n).split('.')[1]?.length ?? 0));

/**
 * Stepper — a whole number, a few small steps from end to end: the browser's
 * own number field between a minus and a plus, in one frame. The field is the
 * one tab stop and a spin button for a screen reader; up and down take a step,
 * Home and End go to the two ends, and a value can be typed. Minus and plus are
 * for the pointer and for touch. On a TV it is one row, and left and right
 * change the value.
 */
export const Stepper = React.forwardRef<HTMLInputElement, StepperProps>(function Stepper(
  {
    value,
    defaultValue,
    min,
    max,
    step = 1,
    size = 'md',
    unit,
    formatValue,
    minusLabel,
    plusLabel,
    invalid,
    disabled,
    readOnly,
    className,
    onChange,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const { words } = useLanguage();
  const input = React.useRef<HTMLInputElement | null>(null);
  const [own, setOwn] = React.useState(defaultValue == null ? '' : String(defaultValue));
  const keys = useKeysLeftAlone();

  const text = value === undefined ? own : String(value);
  const parsed = text.trim() === '' ? NaN : Number(text);
  const now = Number.isFinite(parsed) ? parsed : null;
  const lowest = now != null && min != null && now <= min;
  const highest = now != null && max != null && now >= max;
  const locked = disabled || readOnly;

  // the field has the room of its longest value, to type in; what shows of it is centred with the unit
  const digits = Math.max(String(min ?? '').length, String(max ?? '').length, text.length, 2);
  const shown = Math.max(text.length, 1);
  const decimals = Math.max(places(step), places(min));

  const setTo = (next: number) => {
    if (input.current && !locked) changeInputValue(input.current, String(next));
  };

  const stepBy = (direction: 1 | -1) => {
    // from nothing, a step gives the lowest value
    let next = now == null ? (min ?? 0) : now + direction * step;
    if (min != null) next = Math.max(next, min);
    if (max != null) next = Math.min(next, max);
    setTo(Number(next.toFixed(decimals)));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (keys.undone(event.currentTarget)) return;
    if (value === undefined) setOwn(event.currentTarget.value);
    onChange?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const field = event.currentTarget;
    const tv = onTv(field);
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        // on a tv, up and down move to the next row
        if (tv) keys.leave(field);
        else {
          event.preventDefault();
          stepBy(event.key === 'ArrowUp' ? 1 : -1);
        }
        return;
      case 'ArrowLeft':
      case 'ArrowRight':
        // on a tv, left and right change the value: towards the row's end is up. elsewhere they move the caret.
        if (tv) {
          event.preventDefault();
          stepBy((event.key === 'ArrowRight') !== startsOnTheRight(field) ? 1 : -1);
        }
        return;
      case 'Home':
        if (min != null) {
          event.preventDefault();
          setTo(min);
        }
        return;
      case 'End':
        if (max != null) {
          event.preventDefault();
          setTo(max);
        }
        return;
    }
  };

  /** a press on minus or plus leaves the focus where it is: no keyboard opens on a touch screen. */
  const keepFocus = (event: React.MouseEvent) => event.preventDefault();

  /** a press on the value, beside the number, lands in the field. */
  const focusField = (event: React.MouseEvent) => {
    if (event.target === input.current || disabled) return;
    event.preventDefault();
    input.current?.focus();
  };

  const wholeNumbers = decimals === 0;
  const noMinus = min != null && min >= 0;

  return (
    <div
      className={cx(
        'nc-stepper',
        `nc-stepper--${size}`,
        invalid && 'nc-stepper--invalid',
        disabled && 'nc-stepper--disabled',
        className,
      )}
    >
      <button
        type="button"
        className="nc-stepper__step nc-stepper__step--minus"
        tabIndex={-1}
        aria-label={minusLabel ?? words.stepper.minus}
        disabled={locked || lowest}
        onMouseDown={keepFocus}
        onClick={() => stepBy(-1)}
      >
        <svg className="nc-stepper__sign" viewBox="0 0 12 12" width="0.75rem" height="0.75rem" fill="none" aria-hidden="true">
          <path d="M2.5 6 H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
        <svg className="nc-stepper__arrow" viewBox="0 0 12 12" width="0.75rem" height="0.75rem" fill="none" aria-hidden="true">
          <path d="M7.5 2.5 L4 6 L7.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      </button>
      <span className="nc-stepper__value" onMouseDown={focusField}>
        <input
          ref={(node) => {
            input.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          type="number"
          inputMode={noMinus ? (wholeNumbers ? 'numeric' : 'decimal') : undefined}
          autoComplete="off"
          className="nc-stepper__input"
          style={{ '--nc-stepper-digits': digits, '--nc-stepper-shown': shown } as React.CSSProperties}
          min={min}
          max={max}
          step={step}
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={invalid || undefined}
          aria-valuetext={formatValue && now != null ? formatValue(now) : undefined}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          {...rest}
        />
        {unit != null ? (
          // with the value in full for a screen reader, the short unit is for the eye only
          <span className="nc-stepper__unit" aria-hidden={formatValue ? true : undefined}>
            {unit}
          </span>
        ) : null}
      </span>
      <button
        type="button"
        className="nc-stepper__step nc-stepper__step--plus"
        tabIndex={-1}
        aria-label={plusLabel ?? words.stepper.plus}
        disabled={locked || highest}
        onMouseDown={keepFocus}
        onClick={() => stepBy(1)}
      >
        <svg className="nc-stepper__sign" viewBox="0 0 12 12" width="0.75rem" height="0.75rem" fill="none" aria-hidden="true">
          <path d="M2.5 6 H9.5 M6 2.5 V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
        <svg className="nc-stepper__arrow" viewBox="0 0 12 12" width="0.75rem" height="0.75rem" fill="none" aria-hidden="true">
          <path d="M4.5 2.5 L8 6 L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      </button>
    </div>
  );
});

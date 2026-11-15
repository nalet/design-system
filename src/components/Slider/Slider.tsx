import * as React from 'react';
import { cx } from '../../lib/cx';
import { formatCount, useLanguage } from '../../lib/language';
import { onTv, useKeysLeftAlone } from '../../lib/nativeStep';
import './Slider.css';

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'value' | 'defaultValue' | 'min' | 'max' | 'step'> {
  /** The value, when the app holds it. Use with `onChange`. */
  value?: number;
  /** The value to start from, when the slider holds it. */
  defaultValue?: number;
  /** The lowest value, at the start of the track. Default 0. */
  min?: number;
  /** The highest value, at the end of the track. Default 100. */
  max?: number;
  /** The size of one step, which an arrow key takes. Default 1. */
  step?: number;
  /** The height of the controls in its row: sm 28, md 34 (the default), lg 42. */
  size?: 'sm' | 'md' | 'lg';
  /**
   * The value in words: "60%", "42 minutes of 1 hour 52". It is what a screen
   * reader says, and what stands after the track. Default: the number, as the
   * page's language writes it.
   */
  formatValue?: (value: number) => string;
  /** Before the track: an icon that stands in for the label, or a seek bar's time played. */
  before?: React.ReactNode;
  /** After the track, in place of the value in words: a seek bar's length. `null` leaves the place empty. */
  after?: React.ReactNode;
  /** On a seek bar: how far the film has loaded, on the slider's own scale. Drawn after the thumb, in a lighter grey. */
  loaded?: number;
  /**
   * On a TV: this slider shares its row with other controls, so up and down
   * change it, and left and right move on. Without it, a slider has a row of
   * its own: left and right change it, and up and down move on.
   */
  sharesRow?: boolean;
  /** Marks the value as wrong: the thumb turns to the error colour. A field's `error` sets it. */
  invalid?: boolean;
}

const share = (value: number, min: number, max: number) => (max > min ? Math.min(Math.max((value - min) / (max - min), 0), 1) : 0);

/**
 * Slider — a value in a range that people judge by its effect: a track, the
 * part up to the thumb in blue, a square thumb, and the value in words after
 * it. It is the browser's own range input, so the pointer, the finger, the
 * keys and a screen reader work as they do on every slider; the track and its
 * parts are drawn under it.
 */
export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    value,
    defaultValue,
    min = 0,
    max = 100,
    step = 1,
    size = 'md',
    formatValue,
    before,
    after,
    loaded,
    sharesRow = false,
    invalid,
    disabled,
    className,
    style,
    onChange,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const { lang } = useLanguage();
  const input = React.useRef<HTMLInputElement | null>(null);
  // the input is the component's own, to read and to step, and the caller's ref as well
  const setInput = React.useCallback(
    (node: HTMLInputElement | null) => {
      input.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );
  // where the browser puts a range without a value: the middle
  const first = React.useRef(defaultValue ?? min + (max - min) / 2).current;
  const [own, setOwn] = React.useState(first);
  const now = Math.min(Math.max(value ?? own, min), max);
  const keys = useKeysLeftAlone();

  // the browser moves a value that is off the steps onto one: the track follows the thumb
  React.useLayoutEffect(() => {
    const at = Number(input.current?.value);
    if (value === undefined && Number.isFinite(at)) setOwn(at);
  }, [value, min, max, step]);

  const inWords = formatValue ?? ((n: number) => formatCount(n, lang));
  const words = inWords(now);
  // room for the longest value, so the track keeps its length while the value changes
  const room = Math.max(inWords(min).length, inWords(max).length, words.length);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (keys.undone(event.currentTarget)) return;
    if (value === undefined) setOwn(Number(event.currentTarget.value));
    onChange?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !onTv(event.currentTarget)) return;
    // on a tv, two of the four arrows are the slider's; the other two move the focus on.
    const along = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
    const across = event.key === 'ArrowUp' || event.key === 'ArrowDown';
    if (sharesRow ? along : across) keys.leave(event.currentTarget);
  };

  return (
    <div
      className={cx(
        'nc-slider',
        `nc-slider--${size}`,
        invalid && 'nc-slider--invalid',
        disabled && 'nc-slider--disabled',
        className,
      )}
      style={
        {
          '--nc-slider-at': share(now, min, max),
          '--nc-slider-loaded': loaded == null ? undefined : share(loaded, min, max),
          ...style,
        } as React.CSSProperties
      }
    >
      {before != null ? <span className="nc-slider__before">{before}</span> : null}
      <span className="nc-slider__control">
        <span className="nc-slider__track" aria-hidden="true">
          {loaded != null ? <span className="nc-slider__loaded" /> : null}
          <span className="nc-slider__fill" />
        </span>
        <input
          ref={setInput}
          type="range"
          className="nc-slider__input"
          min={min}
          max={max}
          step={step}
          value={value}
          defaultValue={value === undefined ? first : undefined}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-valuetext={words}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          {...rest}
        />
      </span>
      {after === undefined ? (
        // the slider says these words itself, so a screen reader meets them once
        <span className="nc-slider__value" style={{ minInlineSize: `${room}ch` }} aria-hidden="true">
          {words}
        </span>
      ) : after != null && after !== false ? (
        <span className="nc-slider__after">{after}</span>
      ) : null}
    </div>
  );
});

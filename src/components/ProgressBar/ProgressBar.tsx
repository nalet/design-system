import * as React from 'react';
import { cx } from '../../lib/cx';
import { fill, formatCount, useLanguage } from '../../lib/language';
import { StateGlyph } from '../../lib/StateGlyph';
import './ProgressBar.css';

/** The four states of work whose size is known. */
export type ProgressState = 'running' | 'paused' | 'failed' | 'done';

export interface ProgressBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** What is under way, in sentence case: "Copying 3 files". It is the first line, and the bar's name. */
  label?: React.ReactNode;
  /** How much is done, from 0 to `max`. */
  value: number;
  /** The value at which the work is done. Default 100. */
  max?: number;
  /** The amount, in the work's own unit: "1.4 of 2.2 GB". It follows the percentage. */
  amount?: string;
  /** Under way (the default), paused or waiting, failed, or done. */
  state?: ProgressState;
  /**
   * The words under the bar while it is under way or paused, in place of the
   * ones the bar writes: for work that waits, with the reason.
   */
  valueText?: string;
  /**
   * What the end says. Failed: what happened and what to do next, as a
   * sentence. Done: the result in the item's own words, "copied · 2.2 GB".
   */
  message?: React.ReactNode;
  /** Shows "cancel" while the work is under way or paused. For work that is safe to stop. */
  onCancel?: () => void;
  /** Shows "pause" before cancel while the work is under way. For work where stopping would lose what is done. */
  onPause?: () => void;
  /** Shows "resume" in pause's place while the work is paused. */
  onResume?: () => void;
  /** Shows "try again" after the message when the work failed. */
  onRetry?: () => void;
  /** Draws the bar as failed where no `state` is given. A field's `error` sets it. */
  invalid?: boolean;
}

/**
 * ProgressBar — how far work of a known size has come: what is under way, a
 * bar that fills from the start, and the value in words under it. The bar is
 * the browser's own progress element, named by the first line; its colour
 * follows the work, blue under way, grey while paused, red where it failed,
 * and when the work is done the result takes the bar's place. The end, done or
 * failed, is said once to a screen reader.
 */
export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(function ProgressBar(
  {
    label,
    value,
    max = 100,
    amount,
    state,
    valueText,
    message,
    onCancel,
    onPause,
    onResume,
    onRetry,
    invalid,
    className,
    id,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
    'aria-invalid': ariaInvalid,
    ...rest
  },
  ref,
) {
  const { lang, words } = useLanguage();
  const w = words.progressBar;
  const labelId = React.useId();

  const failedByField = invalid || ariaInvalid === true || ariaInvalid === 'true';
  const shown: ProgressState = state ?? (failedByField ? 'failed' : 'running');

  const top = max > 0 ? max : 100;
  const at = Math.min(Math.max(Number.isFinite(value) ? value : 0, 0), top);
  // never "100%" before the work is done: the last percent stays open until it is.
  const share = at >= top ? 100 : Math.min(99, Math.round((at / top) * 100));
  const percent = fill(w.percent, { n: formatCount(share, lang) });

  let written: string;
  let spoken: string;
  if (shown === 'failed') {
    written = spoken = fill(w.failed, { percent });
  } else if (valueText != null) {
    written = spoken = valueText;
  } else if (shown === 'paused') {
    written = fill(w.paused, { percent });
    spoken = fill(w.pausedSpoken, { percent });
  } else if (amount != null) {
    written = fill(w.valueWithAmount, { percent, amount });
    spoken = fill(w.spokenWithAmount, { percent, amount });
  } else {
    written = spoken = percent;
  }

  const moving = shown === 'running' || shown === 'paused';
  const stops = moving && (onCancel || (shown === 'running' ? onPause : onResume));
  const named = ariaLabel == null && ariaLabelledby == null && label != null;

  return (
    <div ref={ref} className={cx('nc-progress', `nc-progress--${shown}`, className)} data-state={shown} {...rest}>
      {label != null || stops ? (
        <div className="nc-progress__head">
          {label != null ? (
            <span id={labelId} className="nc-progress__label">
              {label}
            </span>
          ) : null}
          {stops ? (
            <span className="nc-progress__actions">
              {shown === 'running' && onPause ? (
                <button type="button" className="nc-progress__action" onClick={onPause}>
                  {w.pause}
                </button>
              ) : null}
              {shown === 'paused' && onResume ? (
                <button type="button" className="nc-progress__action" onClick={onResume}>
                  {w.resume}
                </button>
              ) : null}
              {onCancel ? (
                <button type="button" className="nc-progress__action" onClick={onCancel}>
                  {w.cancel}
                </button>
              ) : null}
            </span>
          ) : null}
        </div>
      ) : null}

      {shown !== 'done' ? (
        <span className="nc-progress__track">
          <progress
            id={id}
            className="nc-progress__native"
            value={at}
            max={top}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby ?? (named ? labelId : undefined)}
            aria-describedby={ariaDescribedby}
            aria-valuetext={spoken}
          />
          <span className="nc-progress__fill" style={{ width: `${(at / top) * 100}%` }} aria-hidden="true" />
        </span>
      ) : null}

      <div className="nc-progress__foot">
        {moving ? (
          // the bar says these words itself, so a screen reader meets them once
          <span className="nc-progress__value" aria-hidden="true">
            {shown === 'paused' ? (
              <span className="nc-progress__icon">
                <StateGlyph state="neutral" />
              </span>
            ) : null}
            <span className="nc-progress__words">{written}</span>
          </span>
        ) : null}
        {/* the end: on the page from the start and empty until the work ends, so that its text is said once, when it comes */}
        <div className="nc-progress__end" role="status">
          {shown === 'failed' ? (
            <>
              <span className="nc-progress__icon" aria-hidden="true">
                <StateGlyph state="error" />
              </span>
              <span className="nc-progress__message">{message ?? written}</span>
            </>
          ) : null}
          {shown === 'done' && message != null ? (
            <>
              <span className="nc-progress__icon" aria-hidden="true">
                <StateGlyph state="success" />
              </span>
              <span className="nc-progress__words">{message}</span>
            </>
          ) : null}
        </div>
        {shown === 'failed' && onRetry ? (
          <button type="button" className="nc-progress__action nc-progress__action--framed" onClick={onRetry}>
            {w.tryAgain}
          </button>
        ) : null}
      </div>
    </div>
  );
});

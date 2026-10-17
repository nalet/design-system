import * as React from 'react';
import { cx } from '../../lib/cx';
import { StateGlyph, type ObjectState } from '../../lib/StateGlyph';
import '../../lib/a11y.css';
import './ObjectStatus.css';

export type { ObjectState };

/** a domain value's status: the semantic state and the human text that goes with it. */
export interface StateSpec {
  state: ObjectState;
  /** lowercase, human: "on its way", "needs attention". */
  text: string;
}

/**
 * defineStates — the one place a domain's values map to semantic states.
 *
 * write the whole vocabulary of an object once, as a table, and render every
 * status from it: `<ObjectStatus {...STATES[row.state]} />`. typescript makes
 * the table exhaustive over the keys you give it, and a reviewer sees in one
 * place that "connection firewalled" is a warning, not a success.
 *
 * ```ts
 * const LINK = defineStates({
 *   open: { state: 'success', text: 'open' },
 *   firewalled: { state: 'warning', text: 'connection firewalled' },
 *   down: { state: 'error', text: 'unreachable' },
 * });
 * ```
 */
export function defineStates<K extends string>(map: Record<K, StateSpec>): Readonly<Record<K, StateSpec>> {
  return Object.freeze({ ...map });
}

/**
 * how urgent each state is, for sorting a list by status (highest first):
 * error 4, warning 3, information 2, neutral 1, success 0.
 */
export const STATE_SEVERITY: Readonly<Record<ObjectState, number>> = Object.freeze({
  error: 4,
  warning: 3,
  information: 2,
  neutral: 1,
  success: 0,
});

/** what a screen reader hears before the text, by default, for the states that need acting on. */
const DEFAULT_STATE_LABEL: Partial<Record<ObjectState, string>> = {
  warning: 'warning',
  error: 'error',
};

export interface ObjectStatusProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * the meaning. colour, glyph and the screen-reader prefix all follow from it;
   * there is no colour prop. default neutral.
   */
  state?: ObjectState;
  /** the human text. `children` works too; `text` lets a StateSpec spread in. */
  text?: React.ReactNode;
  children?: React.ReactNode;
  /** show the state's glyph (default), hide it, or pass your own. */
  icon?: boolean | React.ReactNode;
  /** a square chip (default), or text and glyph only — for dense rows and sentences. */
  appearance?: 'chip' | 'text';
  /**
   * the word read before the text: "warning" and "error" by default, nothing
   * for the other states. pass a string to translate it, or false to omit it
   * when the text already says it.
   */
  stateLabel?: string | false;
}

/**
 * ObjectStatus — the state of one object, said once and said truthfully: a
 * semantic state (neutral, information, success, warning, error) and short
 * human text. colours come only from the --state-* tokens, every state has its
 * own glyph shape, and warnings and errors are announced as such.
 */
export const ObjectStatus = React.forwardRef<HTMLSpanElement, ObjectStatusProps>(function ObjectStatus(
  { state = 'neutral', text, children, icon = true, appearance = 'chip', stateLabel, className, ...rest },
  ref,
) {
  const content = text ?? children;
  const srLabel = stateLabel === false ? null : (stateLabel ?? DEFAULT_STATE_LABEL[state] ?? null);
  const glyph =
    icon === true ? <StateGlyph state={state} /> : icon === false || icon == null ? null : icon;
  return (
    <span
      ref={ref}
      className={cx('nc-status', `nc-status--${state}`, `nc-status--${appearance}`, className)}
      data-state={state}
      {...rest}
    >
      {glyph ? (
        <span className="nc-status__icon" aria-hidden="true">
          {glyph}
        </span>
      ) : null}
      {srLabel ? <span className="nc-sr-only">{srLabel}: </span> : null}
      <span className="nc-status__text">{content}</span>
    </span>
  );
});

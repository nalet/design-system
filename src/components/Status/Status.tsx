import * as React from 'react';
import { cx } from '../../lib/cx';
import { fill, useLanguage } from '../../lib/language';
import { StateGlyph, type State } from '../../lib/StateGlyph';
import '../../lib/a11y.css';
import './Status.css';

export type { State };

/** A domain value's status: the semantic state and the human text that goes with it. */
export interface StateSpec {
  state: State;
  /** Lowercase, human: "on its way", "needs attention". */
  text: string;
}

/**
 * defineStates — the one place a domain's values map to semantic states.
 *
 * Write the whole vocabulary of an object once, as a table, and render every
 * status from it: `<Status {...LINK[row.link]} />`. TypeScript makes the table
 * exhaustive over the keys you give it, and a reviewer sees in one place that
 * "connection firewalled" is a warning, not a success.
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
 * How urgent each state is, for sorting a list by status (highest first):
 * error 4, warning 3, information 2, neutral 1, success 0.
 */
export const STATE_SEVERITY: Readonly<Record<State, number>> = Object.freeze({
  error: 4,
  warning: 3,
  information: 2,
  neutral: 1,
  success: 0,
});

export interface StatusProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * The meaning. Colour, glyph and the screen-reader prefix all follow from it;
   * there is no colour prop. Default neutral.
   */
  state?: State;
  /** The human text. `children` works too; `text` lets a StateSpec spread in. */
  text?: React.ReactNode;
  children?: React.ReactNode;
  /** Show the state's glyph (default), hide it, or pass your own. */
  icon?: boolean | React.ReactNode;
  /** A square chip (default), or text and glyph only — for dense rows and sentences. */
  appearance?: 'chip' | 'text';
  /**
   * The word read before the text: "warning" and "error" by default, in the
   * page's language, and nothing for the other states. Pass a string to
   * replace it, or false to omit it when the text already says it.
   */
  stateLabel?: string | false;
}

/**
 * Status — the state of one object, said once and said truthfully: a semantic
 * state (neutral, information, success, warning, error) and short human text.
 * Colours come only from the --state-* tokens, every state has its own glyph
 * shape, and warnings and errors are announced as such.
 */
export const Status = React.forwardRef<HTMLSpanElement, StatusProps>(function Status(
  { state = 'neutral', text, children, icon = true, appearance = 'chip', stateLabel, className, ...rest },
  ref,
) {
  const { words } = useLanguage();
  const content = text ?? children;
  // what a screen reader hears before the text, for the states that need acting on.
  const own = state === 'warning' ? words.status.warning : state === 'error' ? words.status.error : null;
  const stateWord = stateLabel === false ? null : (stateLabel ?? own);
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
      {stateWord ? (
        <span className="nc-sr-only">
          {fill(words.status.stateBefore, { state: stateWord })}{' '}
        </span>
      ) : null}
      <span className="nc-status__text">{content}</span>
    </span>
  );
});

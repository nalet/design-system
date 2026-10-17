import * as React from 'react';
import { cx } from '../../lib/cx';
import './IllustratedMessage.css';

export type Illustration = 'empty' | 'done' | 'search' | 'error' | 'unknown';
export type IllustratedMessageSize = 'sm' | 'md' | 'lg';

export interface IllustratedMessageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * which picture. empty: nothing here yet. done: nothing left to do. search:
   * filters match nothing. error: could not load. unknown: cannot be told.
   */
  illustration?: Illustration;
  /** the headline: what is true, in a few words ("nothing missing"). */
  title: React.ReactNode;
  /** one or two sentences: why, and what the person can do. */
  description?: React.ReactNode;
  /** at most one primary action, plus an optional secondary. */
  actions?: React.ReactNode;
  /** sm inside a panel or table, md for a section (default), lg for a whole page. */
  size?: IllustratedMessageSize;
  /** the title's heading level. default 2. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

/* the frame every illustration shares: a square terminal window, title bar,
   three window marks. 160 × 120. */
function Frame() {
  return (
    <>
      <rect className="nc-illu__frame" x="24.75" y="18.75" width="110.5" height="82.5" />
      <path className="nc-illu__frame" d="M24.75 30.75 H135.25" />
      <path className="nc-illu__soft" d="M31 24.75 H35 M39 24.75 H43 M47 24.75 H51" />
    </>
  );
}

const ART: Record<Illustration, React.ReactNode> = {
  // a prompt with nothing typed after it.
  empty: (
    <>
      <Frame />
      <path className="nc-illu__accent" d="M42 52 L52 60 L42 68" />
      <path className="nc-illu__soft" d="M58 68.25 H72" />
    </>
  ),
  // the prompt, and a check: nothing left to do.
  done: (
    <>
      <Frame />
      <path className="nc-illu__soft" d="M42 52 L52 60 L42 68" />
      <path className="nc-illu__accent" d="M80 61 L92 73 L116 47" />
    </>
  ),
  // rows, and a square lens over them that finds none.
  search: (
    <>
      <Frame />
      <path className="nc-illu__soft" d="M36 44 H96 M36 56 H84 M36 68 H90 M36 80 H72" />
      <rect className="nc-illu__accent" x="88.75" y="50.75" width="26.5" height="26.5" />
      <path className="nc-illu__accent" d="M115.25 77.25 L124 86" />
    </>
  ),
  // a line that does not connect.
  error: (
    <>
      <Frame />
      <path className="nc-illu__frame" d="M36 66 H64 M96 66 H124" />
      <rect className="nc-illu__accent" x="64.75" y="60.75" width="10.5" height="10.5" />
      <rect className="nc-illu__accent" x="84.75" y="60.75" width="10.5" height="10.5" />
      <path className="nc-illu__soft" d="M77 50 L80 56 M83 50 L80 56" />
    </>
  ),
  // a question that cannot be answered yet.
  unknown: (
    <>
      <Frame />
      <path className="nc-illu__accent" d="M70 50 H90 V62 H80 V70" />
      <path className="nc-illu__accent" d="M80 77 V79" />
      <path className="nc-illu__soft" d="M42 86 H58 M102 86 H118" />
    </>
  ),
};

/**
 * IllustratedMessage — an empty, done, no-match, error or unknown state: a
 * line illustration in the identity's style, a title that says what is true,
 * a description that says what to do, and at most one primary action. the
 * illustration is decoration (aria-hidden); the title is a real heading.
 */
export const IllustratedMessage = React.forwardRef<HTMLDivElement, IllustratedMessageProps>(
  function IllustratedMessage(
    { illustration = 'empty', title, description, actions, size = 'md', headingLevel = 2, className, ...rest },
    ref,
  ) {
    const Heading = `h${headingLevel}` as React.ElementType;
    return (
      <div
        ref={ref}
        className={cx('nc-illu', `nc-illu--${size}`, `nc-illu--${illustration}`, className)}
        {...rest}
      >
        <svg
          className="nc-illu__art"
          viewBox="0 0 160 120"
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="square"
          aria-hidden="true"
          focusable="false"
        >
          {ART[illustration]}
        </svg>
        <Heading className="nc-illu__title">{title}</Heading>
        {description != null ? <p className="nc-illu__description">{description}</p> : null}
        {actions != null ? <div className="nc-illu__actions">{actions}</div> : null}
      </div>
    );
  },
);

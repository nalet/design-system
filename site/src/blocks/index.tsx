// building blocks for the guideline pages: a live example, and do / don't
// pairs. they render on the server; the live components inside them are
// static html unless a page hydrates one on purpose. nothing here ships in
// the library.
import type { ReactNode } from 'react';

function Mark({ kind }: { kind: 'do' | 'dont' }) {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true" focusable="false">
      {kind === 'do' ? (
        <path d="M2 6.5 L5 9 L10 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
      ) : (
        <path d="M2.5 2.5 L9.5 9.5 M9.5 2.5 L2.5 9.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
      )}
    </svg>
  );
}

/** a row of do / don't pairs. children are <Do> and <Dont>. */
export function DoDont({ children }: { children: ReactNode }) {
  return <div className="ds-dodont">{children}</div>;
}

interface VerdictProps {
  /** why: one or two short sentences. */
  caption: ReactNode;
  /** stack the live example vertically. */
  column?: boolean;
  children: ReactNode;
}

function Verdict({ kind, caption, column, children }: VerdictProps & { kind: 'do' | 'dont' }) {
  return (
    <figure className={`ds-verdict ds-verdict--${kind}`}>
      <div className="ds-verdict__label">
        <Mark kind={kind} />
        {kind === 'do' ? 'do' : "don't"}
      </div>
      <div className={`ds-live ds-verdict__stage${column ? ' ds-verdict__stage--column' : ''}`}>{children}</div>
      <figcaption className="ds-verdict__caption">{caption}</figcaption>
    </figure>
  );
}

/** a live example of the right way, with the reason. */
export function Do(props: VerdictProps) {
  return <Verdict kind="do" {...props} />;
}

/**
 * a live example of the wrong way, with the reason. it shows an anti-pattern
 * on purpose, so the accessibility run leaves it out (.ds-verdict--dont).
 */
export function Dont(props: VerdictProps) {
  return <Verdict kind="dont" {...props} />;
}

/** a live example in a plain frame. */
export function Example({
  column,
  flush,
  scroll,
  children,
  label,
}: {
  column?: boolean;
  /** no padding: for a full-width page layout. */
  flush?: boolean;
  /** a long list: the frame keeps a height and scrolls, and a sticky header sticks inside it. */
  scroll?: boolean;
  children: ReactNode;
  /** accessible name for the example region. */
  label?: string;
}) {
  return (
    <div
      className={`ds-live ds-example${column ? ' ds-example--column' : ''}${flush ? ' ds-example--flush' : ''}${scroll ? ' ds-example--scroll' : ''}`}
      role={label ? 'group' : undefined}
      aria-label={label}
    >
      {children}
    </div>
  );
}

/**
 * a static mock-up, built from existing components, of something that is
 * planned. the frame says so, so nobody takes it for a component.
 */
export function Mock({ planned, label, children }: { planned: string; label: string; children: ReactNode }) {
  return (
    <figure className="ds-mock">
      <figcaption className="ds-mock__label">
        <span>mock-up · {label}</span>
        <span>planned: {planned}</span>
      </figcaption>
      <div className="ds-live ds-mock__stage">{children}</div>
    </figure>
  );
}

// docs-only building blocks for the guideline pages. import from mdx:
//   import { DoDont, Do, Dont, Example } from '../_blocks';
// nothing here ships in the library.
import * as React from 'react';
import './blocks.css';

function Mark({ kind }: { kind: 'do' | 'dont' }) {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true">
      {kind === 'do' ? (
        <path d="M2 6.5 L5 9 L10 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
      ) : (
        <path d="M2.5 2.5 L9.5 9.5 M9.5 2.5 L2.5 9.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
      )}
    </svg>
  );
}

/** a row of do / don't pairs. children are <Do> and <Dont>. */
export function DoDont({ children }: { children: React.ReactNode }) {
  return <div className="dsdoc-dodont">{children}</div>;
}

interface VerdictProps {
  /** why: one or two short sentences. */
  caption: React.ReactNode;
  /** stack the live example vertically. */
  column?: boolean;
  children: React.ReactNode;
}

function Verdict({ kind, caption, column, children }: VerdictProps & { kind: 'do' | 'dont' }) {
  return (
    <figure className={`dsdoc-verdict dsdoc-verdict--${kind}`}>
      <div className="dsdoc-verdict__label">
        <Mark kind={kind} />
        {kind === 'do' ? 'do' : "don't"}
      </div>
      {/* sb-unstyled: storybook's docs typography must not restyle the live components. */}
      <div className={`sb-unstyled dsdoc-verdict__stage${column ? ' dsdoc-verdict__stage--column' : ''}`}>
        {children}
      </div>
      <figcaption className="dsdoc-verdict__caption">{caption}</figcaption>
    </figure>
  );
}

/** a live example of the right way, with the reason. */
export function Do(props: VerdictProps) {
  return <Verdict kind="do" {...props} />;
}

/** a live example of the wrong way, with the reason. */
export function Dont(props: VerdictProps) {
  return <Verdict kind="dont" {...props} />;
}

/** a live example without the canvas chrome, for inline illustrations. */
export function Example({
  column,
  children,
  label,
}: {
  column?: boolean;
  children: React.ReactNode;
  /** accessible name for the example region. */
  label?: string;
}) {
  return (
    <div
      className={`sb-unstyled dsdoc-example${column ? ' dsdoc-example--column' : ''}`}
      role={label ? 'group' : undefined}
      aria-label={label}
    >
      {children}
    </div>
  );
}

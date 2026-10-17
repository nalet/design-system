// the trigger of the tooltip page's do and don't, as the stories draw it: a
// value or a term with a dotted underline. it takes no focus itself; the
// tooltip's wrapper supplies the tab stop. static: the tooltip is css only.
import type { ReactNode } from 'react';

export function Term({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        borderBottom: '1px dotted var(--fg-dim)',
        cursor: 'help',
        fontFamily: 'var(--ff-mono)',
        fontSize: 13,
        color: 'var(--fg)',
      }}
    >
      {children}
    </span>
  );
}

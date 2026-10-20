import type { CSSProperties } from 'react';

/**
 * a page header as people see it: the monospace title, a description in the
 * body face, and the data line under it. the meaningful-text page shows the
 * same header with two descriptions, so the words are the only difference.
 */

const title: CSSProperties = { fontFamily: 'var(--ff-mono)', fontSize: 18, fontWeight: 600, lineHeight: 1.3, color: 'var(--fg)' };
const description: CSSProperties = { fontFamily: 'var(--ff-ui)', fontSize: 14, lineHeight: 1.5, color: 'var(--fg-2)' };
const data: CSSProperties = { fontFamily: 'var(--ff-mono)', fontSize: 12, lineHeight: 1.6, color: 'var(--fg-muted)' };

export function HeaderSample({ description: text }: { description: string }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--s-1)', justifyItems: 'start' }}>
      <span style={title}>subtitles</span>
      <span style={description}>{text}</span>
      <span style={data}>English 94% · German 40% · Chinese 13%</span>
    </div>
  );
}

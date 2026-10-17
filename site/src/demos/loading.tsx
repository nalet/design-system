// static mock-ups for the loading pattern: the planned square loader, a
// progress bar with its value, skeleton rows. pictures, not components.
import type { CSSProperties } from 'react';
import { Text } from '@nalet/design-system';

/**
 * the planned loader, still: a faint square frame with three quarters of it
 * lit; the gap is the quarter that would travel round.
 */
export function SquareLoaderShape({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
      <rect x="4" y="4" width="40" height="40" stroke="var(--border-2)" strokeWidth="3" />
      {/* three quarters of the frame lit: top, right and bottom; the left edge is the gap. */}
      <path d="M4 4 H44 V44 H4" stroke="var(--cloud-blue)" strokeWidth="3" strokeLinecap="square" />
    </svg>
  );
}

const label: CSSProperties = { fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg-muted)' };

/** the loader at the two sizes the pattern names: inline, and for a region. */
export function LoaderSizes() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 'var(--s-6)' }}>
      <div style={{ display: 'grid', justifyItems: 'center', gap: 'var(--s-2)' }}>
        <SquareLoaderShape size={16} />
        <span style={label}>16px · inline</span>
      </div>
      <div style={{ display: 'grid', justifyItems: 'center', gap: 'var(--s-2)' }}>
        <SquareLoaderShape size={32} />
        <span style={label}>32px · a region</span>
      </div>
      <div style={{ display: 'grid', justifyItems: 'center', gap: 'var(--s-2)' }}>
        <SquareLoaderShape size={48} />
        <span style={label}>48px · a player</span>
      </div>
    </div>
  );
}

/** known progress: a bar and the value in words. */
export function ProgressBarMock({ value = 62, text = '62% · 1.4 of 2.2 gb' }: { value?: number; text?: string }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--s-2)', width: '100%', maxWidth: 360 }}>
      <div style={{ height: 6, background: 'var(--surface-2)', border: '1px solid var(--border-2)' }}>
        <div style={{ width: `${value}%`, height: '100%', background: 'var(--cloud-blue)' }} />
      </div>
      <span style={{ ...label, color: 'var(--fg-2)', fontVariantNumeric: 'tabular-nums' }}>{text}</span>
    </div>
  );
}

/** a region that loads: the loader with one line of text. */
export function RegionLoaderMock() {
  return (
    <div
      style={{
        display: 'grid',
        justifyItems: 'center',
        gap: 'var(--s-3)',
        width: '100%',
        padding: 'var(--s-6) var(--s-4)',
        border: '1px solid var(--border)',
      }}
    >
      <SquareLoaderShape size={32} />
      <Text variant="muted">loading the episode list</Text>
    </div>
  );
}

const block = (width: string, height = 12): CSSProperties => ({ width, height, background: 'var(--surface-2)' });

/** a list that loads: blocks in the shape of its rows, not a loader in empty space. */
export function SkeletonRowsMock({ rows = 4 }: { rows?: number }) {
  return (
    <div style={{ width: '100%', border: '1px solid var(--border)' }}>
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
            gap: 'var(--s-4)',
            alignItems: 'center',
            padding: 'var(--s-3)',
            borderTop: i ? '1px solid var(--border)' : undefined,
          }}
        >
          <div style={{ display: 'grid', gap: 'var(--s-2)' }}>
            <div style={block(`${70 - i * 8}%`)} />
            <div style={block(`${40 + i * 6}%`, 8)} />
          </div>
          <div style={block('60%')} />
        </div>
      ))}
    </div>
  );
}

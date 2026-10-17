// examples for the loading pattern: the loader, which is the real spinner, and
// static mock-ups of what isn't a component yet — a progress bar with its
// value, skeleton rows. pictures, not components.
import type { CSSProperties } from 'react';
import { Spinner, Text } from '@nalet/design-system';

const label: CSSProperties = { fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg-muted)' };

/** the loader at the sizes the pattern names: inline, and for a region or a player. */
export function LoaderSizes() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 'var(--s-6)' }}>
      <div style={{ display: 'grid', justifyItems: 'center', gap: 'var(--s-2)' }}>
        <Spinner size={16} label="loading, inline" />
        <span style={label}>16px · inline</span>
      </div>
      <div style={{ display: 'grid', justifyItems: 'center', gap: 'var(--s-2)' }}>
        <Spinner size={32} label="loading a region" />
        <span style={label}>32px · a region</span>
      </div>
      <div style={{ display: 'grid', justifyItems: 'center', gap: 'var(--s-2)' }}>
        <Spinner size={48} label="loading a player" />
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

/** a region that loads: the loader with one line of text, which speaks for it. */
export function RegionLoader() {
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
      <Spinner size={32} aria-hidden="true" />
      <Text variant="muted">Loading the episode list</Text>
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

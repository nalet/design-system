import type { CSSProperties, ReactNode } from 'react';

/**
 * the 10-foot focus style (patterns/tv-focus), drawn from the colour tokens at
 * a docs page's size: 1 dp of the spec is 1 px here. each kind of focusable
 * item is shown at rest and focused; the projector pair washes both out the
 * way a projector in a lit room does, roughly, with a css filter.
 */

const ringOutside: CSSProperties = { outline: '3px solid var(--focus-ring)', outlineOffset: 2 };
const ringInside: CSSProperties = { boxShadow: 'inset 0 0 0 3px var(--focus-ring)' };
const label: CSSProperties = { fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--fg-muted)' };
const settle: CSSProperties = { transition: 'transform 150ms ease-out' };

function Screen({ children, aria, style }: { children: ReactNode; aria: string; style?: CSSProperties }) {
  return (
    <div
      role="img"
      aria-label={aria}
      style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: 'var(--s-5)', overflow: 'hidden', ...style }}
    >
      {children}
    </div>
  );
}

function Row({ focused, title, meta, slim }: { focused?: boolean; title: string; meta: string; slim?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: slim ? '8px 12px' : '10px 12px',
        background: focused ? 'var(--surface-focus)' : 'transparent',
        transform: focused ? 'scale(1.02)' : undefined,
        ...settle,
        ...(focused ? ringInside : {}),
      }}
    >
      <div style={{ width: 64, aspectRatio: '16 / 9', background: 'var(--surface-2)', flex: 'none' }} />
      <div style={{ display: 'grid', gap: 2, minWidth: 0 }}>
        <span style={{ fontFamily: 'var(--ff-ui)', fontSize: 13, color: focused ? 'var(--fg)' : 'var(--fg-2)' }}>{title}</span>
        <span style={{ fontFamily: 'var(--ff-ui)', fontSize: 12, color: focused ? 'var(--fg-2)' : 'var(--fg-muted)' }}>{meta}</span>
      </div>
    </div>
  );
}

function Card({ focused, hue, title }: { focused?: boolean; hue: number; title: string }) {
  return (
    <div style={{ display: 'grid', gap: 6, width: 72 }}>
      <div
        style={{
          aspectRatio: '2 / 3',
          background: `linear-gradient(160deg, hsl(${hue} 42% 46%), hsl(${hue + 40} 38% 18%))`,
          transform: focused ? 'scale(1.05)' : undefined,
          ...settle,
          ...(focused ? ringOutside : {}),
        }}
      />
      <span style={{ fontFamily: 'var(--ff-ui)', fontSize: 12, color: focused ? 'var(--fg)' : 'var(--fg-muted)' }}>{title}</span>
    </div>
  );
}

function Button({ focused, filled, children }: { focused?: boolean; filled?: boolean; children: ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '8px 14px',
        fontFamily: 'var(--ff-mono)',
        fontSize: 12,
        fontWeight: 600,
        background: filled ? 'var(--cloud-blue)' : focused ? 'var(--surface-focus)' : 'var(--surface-2)',
        color: filled ? 'var(--bg)' : focused ? 'var(--fg)' : 'var(--fg-2)',
        transform: focused ? 'scale(1.05)' : undefined,
        ...settle,
        ...(focused ? ringOutside : {}),
      }}
    >
      {children}
    </span>
  );
}

function Chip({ focused, children }: { focused?: boolean; children: ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 10px',
        fontFamily: 'var(--ff-ui)',
        fontSize: 12,
        border: '1px solid var(--border-2)',
        background: focused ? 'var(--surface-focus)' : 'transparent',
        color: focused ? 'var(--fg)' : 'var(--fg-muted)',
        transform: focused ? 'scale(1.05)' : undefined,
        ...settle,
        ...(focused ? ringOutside : {}),
      }}
    >
      {children}
    </span>
  );
}

function Kind({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--s-3)', alignContent: 'start', minWidth: 0 }}>
      <span style={label}>{name}</span>
      {children}
    </div>
  );
}

/** a row, cards, buttons and chips, each at rest and focused. */
export function FocusKinds() {
  return (
    <Screen aria="The tv focus style on four kinds of item: a focused row, card, button and chip each show a cyan ring, a lighter surface where they have one, a little growth and brighter text, next to the same item at rest.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--s-6)' }}>
        <Kind name="rows">
          <div style={{ display: 'grid', gap: 4 }}>
            <Row title="S01E01 · Arrival" meta="52 min" />
            <Row focused title="S01E02 · The Harbour" meta="48 min" />
            <Row title="S01E03 · Low Tide" meta="50 min" />
          </div>
        </Kind>
        <Kind name="cards">
          <div style={{ display: 'flex', gap: 16, paddingTop: 6 }}>
            <Card hue={205} title="Quiet Orchard" />
            <Card focused hue={20} title="Paper Station" />
          </div>
        </Kind>
        <Kind name="buttons">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, paddingTop: 6 }}>
            <Button filled>play</Button>
            <Button filled focused>
              play
            </Button>
            <Button>add to list</Button>
            <Button focused>add to list</Button>
          </div>
        </Kind>
        <Kind name="chips">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, paddingTop: 6 }}>
            <Chip>English</Chip>
            <Chip focused>German</Chip>
            <Chip>Chinese</Chip>
          </div>
        </Kind>
      </div>
    </Screen>
  );
}

/** an episode list as a projector in a lit room shows it: the full focus style, or the surface alone. */
export function OnAProjector({ focus }: { focus: 'full' | 'surface' }) {
  const rows = [
    ['S01E01 · Arrival', '52 min'],
    ['S01E02 · The Harbour', '48 min'],
    ['S01E03 · Low Tide', '50 min'],
    ['S01E04 · Lanterns', '47 min'],
  ];
  return (
    <Screen
      aria={
        focus === 'full'
          ? 'Four episode rows, washed out as on a projector; the second still stands out with its ring and growth.'
          : 'Four episode rows, washed out as on a projector; the second only has a slightly lighter background and is hard to tell apart.'
      }
      style={{ filter: 'contrast(0.55) brightness(1.3)', padding: 'var(--s-4)', width: '100%' }}
    >
      <div style={{ display: 'grid', gap: 4 }}>
        {rows.map(([title, meta], i) =>
          i === 1 && focus === 'surface' ? (
            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'var(--surface-focus)' }}>
              <div style={{ width: 64, aspectRatio: '16 / 9', background: 'var(--surface-2)', flex: 'none' }} />
              <div style={{ display: 'grid', gap: 2 }}>
                <span style={{ fontFamily: 'var(--ff-ui)', fontSize: 13, color: 'var(--fg-2)' }}>{title}</span>
                <span style={{ fontFamily: 'var(--ff-ui)', fontSize: 12, color: 'var(--fg-muted)' }}>{meta}</span>
              </div>
            </div>
          ) : (
            <Row key={title} slim focused={i === 1} title={title} meta={meta} />
          ),
        )}
      </div>
    </Screen>
  );
}

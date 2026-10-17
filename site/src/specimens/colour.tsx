import { colors } from '@nalet/design-system';

/**
 * colour swatches for the nalet palette. each swatch is painted with the css
 * custom property and labelled with the value from the typed tokens, both
 * generated from tokens/tokens.json, so the page can't drift from the source.
 */

type TokenDef = { varName: string; note: string };
type Group = { title: string; tokens: TokenDef[] };

const GROUPS: Group[] = [
  {
    title: 'canvas',
    tokens: [
      { varName: '--bg', note: 'Primary background, deepest canvas' },
      { varName: '--bg-2', note: 'Deeper recesses, terminal blocks' },
      { varName: '--surface', note: 'Cards, panels, raised areas' },
      { varName: '--surface-2', note: 'Hover state on surface' },
      { varName: '--border', note: 'Hairline borders, dividers' },
      { varName: '--border-2', note: 'Heavier dividers' },
    ],
  },
  {
    title: 'foreground',
    tokens: [
      { varName: '--fg', note: 'Primary text, titles' },
      { varName: '--fg-2', note: 'Body text, the n glyph' },
      { varName: '--fg-muted', note: 'Labels, meta, captions' },
      { varName: '--fg-dim', note: 'Helpers, hints, off; still 4.5:1' },
    ],
  },
  {
    title: 'brand',
    tokens: [
      { varName: '--cloud-blue', note: 'The > chevron, links, primary CTA' },
      { varName: '--cloud-cyan', note: 'Cursor, active stroke' },
    ],
  },
  {
    title: 'signal',
    tokens: [
      { varName: '--signal-green', note: 'The raw green; components use --state-success' },
      { varName: '--signal-amber', note: 'The raw amber; components use --state-warning' },
      { varName: '--signal-red', note: 'The raw red; components use --state-error' },
    ],
  },
  {
    title: 'controls',
    tokens: [
      { varName: '--border-control', note: 'Boundary of an input, select, checkbox; 3:1' },
      { varName: '--focus-ring', note: 'The keyboard focus outline' },
      { varName: '--surface-selected', note: 'A selected row or item' },
    ],
  },
  {
    title: 'semantic state',
    tokens: [
      { varName: '--state-neutral', note: 'A plain fact: missing, queued' },
      { varName: '--state-information', note: 'Under way or worth knowing' },
      { varName: '--state-success', note: 'Done and good; never a problem' },
      { varName: '--state-warning', note: 'Works, but someone should look' },
      { varName: '--state-error', note: 'Failed or blocked; needs action' },
      { varName: '--state-neutral-bg', note: 'Neutral tint' },
      { varName: '--state-information-bg', note: 'Information tint' },
      { varName: '--state-success-bg', note: 'Success tint' },
      { varName: '--state-warning-bg', note: 'Warning tint' },
      { varName: '--state-error-bg', note: 'Error tint' },
    ],
  },
];

const Cell = ({ def }: { def: TokenDef }) => {
  const value = colors[def.varName.slice(2) as keyof typeof colors] ?? 'unset';
  return (
    <div
      style={{
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          height: 72,
          background: `var(${def.varName})`,
          borderBottom: '1px solid var(--border)',
        }}
      />
      <div style={{ padding: 'var(--s-3)' }}>
        <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>
          {def.varName}
        </div>
        <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>
          {value.toUpperCase()}
        </div>
        <div
          style={{
            fontFamily: 'var(--ff-ui)',
            fontSize: 12,
            color: 'var(--fg-dim)',
            marginTop: 'var(--s-1)',
          }}
        >
          {def.note}
        </div>
      </div>
    </div>
  );
};

const GroupBlock = ({ group }: { group: Group }) => (
  <div role="group" aria-label={group.title} style={{ marginBottom: 'var(--s-5)' }}>
    <p
      style={{
        fontFamily: 'var(--ff-mono)',
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--fg)',
        margin: '0 0 var(--s-3)',
      }}
    >
      {group.title}
    </p>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 150px), 1fr))',
        gap: 'var(--s-4)',
      }}
    >
      {group.tokens.map((def) => (
        <Cell key={def.varName} def={def} />
      ))}
    </div>
  </div>
);

/** every colour token, by group. */
export function Palette() {
  return (
    <div style={{ width: '100%' }}>
      {GROUPS.map((g) => (
        <GroupBlock key={g.title} group={g} />
      ))}
    </div>
  );
}

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
      { varName: '--bg', note: 'primary background, deepest canvas' },
      { varName: '--bg-2', note: 'deeper recesses, terminal blocks' },
      { varName: '--surface', note: 'cards, panels, raised areas' },
      { varName: '--surface-2', note: 'hover state on surface' },
      { varName: '--border', note: 'hairline borders, dividers' },
      { varName: '--border-2', note: 'heavier dividers' },
    ],
  },
  {
    title: 'foreground',
    tokens: [
      { varName: '--fg', note: 'primary text, titles' },
      { varName: '--fg-2', note: 'body text, the n glyph' },
      { varName: '--fg-muted', note: 'labels, meta, captions' },
      { varName: '--fg-dim', note: 'helpers, hints, off; still 4.5:1' },
    ],
  },
  {
    title: 'brand',
    tokens: [
      { varName: '--cloud-blue', note: 'the > chevron, links, primary cta' },
      { varName: '--cloud-cyan', note: 'cursor, active stroke' },
    ],
  },
  {
    title: 'signal',
    tokens: [
      { varName: '--signal-green', note: 'the raw green; components use --state-success' },
      { varName: '--signal-amber', note: 'the raw amber; components use --state-warning' },
      { varName: '--signal-red', note: 'the raw red; components use --state-error' },
    ],
  },
  {
    title: 'controls',
    tokens: [
      { varName: '--border-control', note: 'boundary of an input, select, checkbox; 3:1' },
      { varName: '--focus-ring', note: 'the keyboard focus outline' },
      { varName: '--surface-selected', note: 'a selected row or item' },
    ],
  },
  {
    title: 'semantic state',
    tokens: [
      { varName: '--state-neutral', note: 'a plain fact: missing, queued' },
      { varName: '--state-information', note: 'under way or worth knowing' },
      { varName: '--state-success', note: 'done and good; never a problem' },
      { varName: '--state-warning', note: 'works, but someone should look' },
      { varName: '--state-error', note: 'failed or blocked; needs action' },
      { varName: '--state-neutral-bg', note: 'neutral tint' },
      { varName: '--state-information-bg', note: 'information tint' },
      { varName: '--state-success-bg', note: 'success tint' },
      { varName: '--state-warning-bg', note: 'warning tint' },
      { varName: '--state-error-bg', note: 'error tint' },
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

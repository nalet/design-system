import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';

/**
 * color swatches for the canonical nalet palette.
 *
 * the hex values are resolved live from the css custom properties declared by
 * the generated tokens.css (imported in .storybook/preview.tsx), so this story
 * never drifts from tokens/tokens.json — it reads whatever the build emitted.
 * names + descriptions mirror the brand non-negotiables.
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
      { varName: '--fg-dim', note: 'helpers, hints, off' },
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
      { varName: '--signal-green', note: 'ok / running / healthy' },
      { varName: '--signal-amber', note: 'warn / delayed / degraded' },
      { varName: '--signal-red', note: 'error / failed / offline' },
    ],
  },
];

function useCssVar(varName: string): string {
  const [value, setValue] = useState('');
  useEffect(() => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    setValue(v || 'unset');
  }, [varName]);
  return value;
}

const Cell = ({ def }: { def: TokenDef }) => {
  const value = useCssVar(def.varName);
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
  <section style={{ marginBottom: 'var(--s-7)' }}>
    <h2
      style={{
        fontFamily: 'var(--ff-mono)',
        fontSize: 22,
        fontWeight: 600,
        color: 'var(--fg)',
        marginBottom: 'var(--s-4)',
      }}
    >
      {group.title}
    </h2>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 'var(--s-4)',
      }}
    >
      {group.tokens.map((def) => (
        <Cell key={def.varName} def={def} />
      ))}
    </div>
  </section>
);

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Palette: Story = {
  render: () => (
    <div style={{ padding: 'var(--s-6)', background: 'var(--bg)', minHeight: '100vh' }}>
      {GROUPS.map((g) => (
        <GroupBlock key={g.title} group={g} />
      ))}
    </div>
  ),
};

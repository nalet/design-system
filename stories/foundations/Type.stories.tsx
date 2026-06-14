import type { Meta, StoryObj } from '@storybook/react';

/**
 * type scale. roles + exact metrics mirror tokens/tokens.json -> type.role.
 * 'JetBrains Mono' for display / headings / system / code / brand,
 * 'Inter' for body / prose / ui-labels.
 */

type Role = {
  role: string;
  family: 'mono' | 'ui';
  weight: number;
  size: string;
  lineHeight: string;
  letterSpacing: string;
  sample: string;
};

const ROLES: Role[] = [
  { role: 'display', family: 'mono', weight: 800, size: '56px', lineHeight: '1.00', letterSpacing: '-0.030em', sample: '> nalet' },
  { role: 'h1', family: 'mono', weight: 700, size: '32px', lineHeight: '1.15', letterSpacing: '-0.015em', sample: 'design system' },
  { role: 'h2', family: 'mono', weight: 600, size: '22px', lineHeight: '1.20', letterSpacing: '0', sample: 'foundations' },
  { role: 'body', family: 'ui', weight: 400, size: '16px', lineHeight: '1.55', letterSpacing: '0', sample: 'dark canvas, monospace voice, blue chevron, one cursor.' },
  { role: 'ui', family: 'ui', weight: 500, size: '13px', lineHeight: '1.40', letterSpacing: '0', sample: 'ui label / meta' },
  { role: 'code', family: 'mono', weight: 500, size: '13px', lineHeight: '1.50', letterSpacing: '0', sample: 'npm i @nalet/design-system' },
];

const Row = ({ r }: { r: Role }) => (
  <div
    style={{
      borderBottom: '1px solid var(--border)',
      padding: 'var(--s-5) 0',
      display: 'grid',
      gridTemplateColumns: '140px 1fr',
      gap: 'var(--s-5)',
      alignItems: 'baseline',
    }}
  >
    <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg-dim)', lineHeight: 1.6 }}>
      <div style={{ color: 'var(--cloud-blue)', fontWeight: 600 }}>{r.role}</div>
      <div>{r.family === 'mono' ? 'JetBrains Mono' : 'Inter'}</div>
      <div>
        {r.size} / {r.weight}
      </div>
      <div>ls {r.letterSpacing}</div>
    </div>
    <div
      style={{
        fontFamily: r.family === 'mono' ? 'var(--ff-mono)' : 'var(--ff-ui)',
        fontWeight: r.weight,
        fontSize: r.size,
        lineHeight: r.lineHeight,
        letterSpacing: r.letterSpacing,
        color: 'var(--fg)',
      }}
    >
      {r.sample}
    </div>
  </div>
);

const meta: Meta = {
  title: 'Foundations/Type',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Scale: Story = {
  render: () => (
    <div style={{ padding: 'var(--s-6)', background: 'var(--bg)', minHeight: '100vh', maxWidth: 960 }}>
      <h2
        style={{
          fontFamily: 'var(--ff-mono)',
          fontSize: 22,
          fontWeight: 600,
          color: 'var(--fg)',
          marginBottom: 'var(--s-4)',
        }}
      >
        type scale
      </h2>
      {ROLES.map((r) => (
        <Row key={r.role} r={r} />
      ))}
    </div>
  ),
};

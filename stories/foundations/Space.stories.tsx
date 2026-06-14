import type { Meta, StoryObj } from '@storybook/react';

/**
 * space scale. 4-base only: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.
 * resolved live from the --s-* css custom properties.
 */

const STEPS = [
  { name: '--s-1', px: 4 },
  { name: '--s-2', px: 8 },
  { name: '--s-3', px: 12 },
  { name: '--s-4', px: 16 },
  { name: '--s-5', px: 24 },
  { name: '--s-6', px: 32 },
  { name: '--s-7', px: 48 },
  { name: '--s-8', px: 64 },
];

const meta: Meta = {
  title: 'Foundations/Space',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Scale: Story = {
  render: () => (
    <div style={{ padding: 'var(--s-6)', background: 'var(--bg)', minHeight: '100vh', maxWidth: 720 }}>
      <h2
        style={{
          fontFamily: 'var(--ff-mono)',
          fontSize: 22,
          fontWeight: 600,
          color: 'var(--fg)',
          marginBottom: 'var(--s-4)',
        }}
      >
        space (4-base)
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
        {STEPS.map((s) => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-4)' }}>
            <div
              style={{
                fontFamily: 'var(--ff-mono)',
                fontSize: 13,
                color: 'var(--fg-muted)',
                width: 56,
              }}
            >
              {s.name}
            </div>
            <div
              style={{
                width: `var(${s.name})`,
                height: 16,
                background: 'var(--cloud-blue)',
              }}
            />
            <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 13, color: 'var(--fg-dim)' }}>
              {s.px}px
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

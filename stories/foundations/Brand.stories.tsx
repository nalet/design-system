import type { Meta, StoryObj } from '@storybook/react';
import { Terminal, Cloud, GitBranch, Server } from 'lucide-react';
import { Chevron, Lockup, Icon } from '../../src';

/**
 * the brand glyphs, rendered from the shipped components.
 *
 * Chevron — the one mark. always cloud-blue (#58A6FF).
 * Lockup — chevron + mono wordmark + blinking cursor, mirrors
 *   assets/terminal/nalet-cloud-lockup.svg.
 * Icon — thin lucide wrapper; icons are the only rounded shape (baked in).
 */

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2
    style={{
      fontFamily: 'var(--ff-mono)',
      fontSize: 22,
      fontWeight: 600,
      color: 'var(--fg)',
      margin: '0 0 var(--s-4)',
    }}
  >
    {children}
  </h2>
);

const meta: Meta = {
  title: 'Foundations/Brand',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Glyphs: Story = {
  render: () => (
    <div style={{ padding: 'var(--s-6)', background: 'var(--bg)', minHeight: '100vh' }}>
      <SectionTitle>the &gt; chevron</SectionTitle>
      <div style={{ display: 'flex', gap: 'var(--s-6)', alignItems: 'flex-end', marginBottom: 'var(--s-7)' }}>
        {[128, 96, 64, 32, 16].map((s) => (
          <Chevron key={s} size={s} />
        ))}
      </div>

      <SectionTitle>lockup</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-5)', marginBottom: 'var(--s-7)' }}>
        <Lockup height={48} />
        <Lockup height={32} showCursor={false} />
      </div>

      <SectionTitle>icons (the only rounded shape)</SectionTitle>
      <div style={{ display: 'flex', gap: 'var(--s-5)', color: 'var(--fg-2)', alignItems: 'center' }}>
        <Icon icon={Terminal} size={24} />
        <Icon icon={Cloud} size={24} />
        <Icon icon={GitBranch} size={24} />
        <Icon icon={Server} size={24} />
      </div>
    </div>
  ),
};

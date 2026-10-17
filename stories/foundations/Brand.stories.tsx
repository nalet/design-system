import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Terminal, Cloud, GitBranch, Server } from 'lucide-react';
import { Chevron, Lockup, Icon, Input, Tile, TileGroup } from '../../src';

/**
 * the brand marks, rendered from the shipped components.
 *
 * Chevron — the one glyph, always --cloud-blue.
 * Lockup — chevron + mono wordmark + blinking cursor, mirrors the svg in
 *   assets/terminal/.
 * Icon — thin lucide wrapper; icons are the only rounded shape.
 */

const SectionTitle = ({ children }: { children: ReactNode }) => (
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

const Caption = ({ children }: { children: ReactNode }) => (
  <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{children}</span>
);

const meta: Meta = {
  title: 'Foundations/brand',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--s-6)', background: 'var(--bg)' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj;

export const Glyphs: Story = {
  render: () => (
    <div>
      <SectionTitle>the &gt; chevron</SectionTitle>
      <div style={{ display: 'flex', gap: 'var(--s-6)', alignItems: 'flex-end', marginBottom: 'var(--s-7)' }}>
        {[128, 96, 64, 32, 16].map((s) => (
          <Chevron key={s} size={s} aria-hidden />
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

export const ChevronSizes: Story = {
  name: 'chevron sizes',
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-6)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
      {[64, 32, 24, 18, 16, 14].map((s) => (
        <div key={s} style={{ display: 'grid', justifyItems: 'center', gap: 'var(--s-2)' }}>
          <Chevron size={s} aria-hidden />
          <Caption>{s}px</Caption>
        </div>
      ))}
    </div>
  ),
};

export const ChevronInUse: Story = {
  name: 'chevron in use',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-6)', maxWidth: 560 }}>
      <TileGroup legend="operations" columns={2}>
        <Tile icon={Server} title="cluster" description="hover or focus: the chevron follows the title" href="#" />
        <Tile icon={GitBranch} title="pipelines" description="builds and releases" href="#" />
      </TileGroup>
      <Input aria-label="command" placeholder="type a command" leading={<Chevron size={14} aria-hidden />} />
    </div>
  ),
};

export const Lockups: Story = {
  name: 'lockup',
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-6)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
      <div style={{ display: 'grid', gap: 'var(--s-2)' }}>
        <Lockup height={48} />
        <Caption>height 48, cursor</Caption>
      </div>
      <div style={{ display: 'grid', gap: 'var(--s-2)' }}>
        <Lockup height={48} showCursor={false} />
        <Caption>showCursor=false</Caption>
      </div>
      <div style={{ display: 'grid', gap: 'var(--s-2)', padding: 'var(--s-3)', background: 'var(--surface-2)' }}>
        <Lockup height={48} filled />
        <Caption>filled, on --surface-2</Caption>
      </div>
    </div>
  ),
};

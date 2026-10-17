import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { GitBranch, Server } from 'lucide-react';
import { Chevron, type ChevronProps, Input, Tile, TileGroup } from '../../src';

const Caption = ({ children }: { children: ReactNode }) => (
  <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{children}</span>
);

const meta: Meta<ChevronProps> = {
  title: 'Components/brand & icons/chevron',
  component: Chevron,
  args: { size: 32 },
  argTypes: {
    size: { control: { type: 'number', min: 8, max: 128, step: 2 } },
    strokeWidth: { control: { type: 'number', min: 1, max: 12, step: 0.5 } },
    color: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: 'The brand glyph: one `>` in cloud blue. `role="img"`, named "chevron"; pass `aria-hidden` next to a title.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<ChevronProps>;

export const Playground: Story = {};

export const Sizes: Story = {
  name: 'sizes',
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

export const InUse: Story = {
  name: 'in use',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-6)', width: '100%', maxWidth: 560 }}>
      <TileGroup legend="operations" columns="auto" minTileWidth="13rem">
        <Tile icon={Server} title="cluster" description="Hover or focus: the chevron follows the title" href="#" />
        <Tile icon={GitBranch} title="pipelines" description="Builds and releases" href="#" />
      </TileGroup>
      <Input aria-label="command" placeholder="type a command" leading={<Chevron size={14} aria-hidden />} />
    </div>
  ),
};

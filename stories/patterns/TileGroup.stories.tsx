import type { Meta, StoryObj } from '@storybook/react';
import { Server, GitBranch, Database, Terminal, Activity } from 'lucide-react';
import { TileGroup, Tile, Button, type TileGroupProps } from '../../src';

const meta: Meta<TileGroupProps> = {
  title: 'Patterns/tile group',
  component: TileGroup,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'a labelled, square-grid section of Tiles. the legend names a stable, ' +
          'spatially-consistent group; the grid is a responsive css auto-fill grid by ' +
          'default. provides roving-tabindex arrow-key navigation unless a parent Portal ' +
          'owns it.',
      },
    },
  },
  args: {
    legend: 'infra',
    columns: 'auto',
    minTileWidth: '14rem',
    gap: 'md',
    navigation: 'roving',
  },
  argTypes: {
    gap: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
    navigation: { control: 'inline-radio', options: ['roving', 'tab'] },
    columns: { control: 'text' },
  },
  decorators: [(Story) => <div style={{ padding: 'var(--s-6)', maxWidth: 920 }}>{Story()}</div>],
};
export default meta;

type Story = StoryObj<TileGroupProps>;

const tiles = (
  <>
    <Tile icon={GitBranch} title="gitlab" description="ci/cd + registry" href="#" external />
    <Tile icon={Server} title="okd console" description="cluster ops" href="#" />
    <Tile icon={Database} title="postgres" description="primary db" href="#" status="online" />
    <Tile icon={Terminal} title="logs" description="loki tail" href="#" />
    <Tile icon={Activity} title="metrics" description="apm" href="#" badge={3} badgeTone="warning" />
  </>
);

export const Playground: Story = {
  render: (args) => <TileGroup {...args}>{tiles}</TileGroup>,
};

export const FixedColumns: Story = {
  name: 'fixed columns',
  render: () => (
    <TileGroup legend="four up" columns={4} minTileWidth="11rem">
      {tiles}
    </TileGroup>
  ),
};

export const WithAction: Story = {
  name: 'with action',
  render: () => (
    <TileGroup
      legend="observability"
      action={<Button variant="ghost" size="sm">manage</Button>}
    >
      {tiles}
    </TileGroup>
  ),
};

export const WithDescription: Story = {
  name: 'with description',
  render: () => (
    <TileGroup legend="infra" description="core platform services. arrow keys move between tiles.">
      {tiles}
    </TileGroup>
  ),
};

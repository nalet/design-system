import type { Meta, StoryObj } from '@storybook/react-vite';
import { Activity, Database, GitBranch, ScrollText, Server } from 'lucide-react';
import { TileGroup, Tile, Button, type TileGroupProps } from '../../src';

const meta: Meta<TileGroupProps> = {
  title: 'Components/navigation/tile group',
  component: TileGroup,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'a titled section of tiles in a square grid. the legend names a stable group; the ' +
          'grid is a responsive auto-fill grid by default. one tab stop for the group and ' +
          'arrow keys between tiles, unless a parent portal runs that model.',
      },
    },
  },
  args: {
    legend: 'operations',
    columns: 'auto',
    minTileWidth: '14rem',
    gap: 'md',
    navigation: 'roving',
  },
  argTypes: {
    gap: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
    navigation: { control: 'inline-radio', options: ['roving', 'tab'] },
    columns: { control: 'text' },
    description: { control: 'text' },
    action: { control: false },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--s-5)', maxWidth: 920 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<TileGroupProps>;

const tiles = (
  <>
    <Tile icon={GitBranch} title="pipelines" description="builds and releases" href="#" />
    <Tile icon={Server} title="cluster" description="nodes and workloads" href="#" />
    <Tile icon={Database} title="database" description="db-0, the primary" href="#" status="online" />
    <Tile icon={ScrollText} title="logs" description="live tail across workers" href="#" />
    <Tile icon={Activity} title="metrics" description="3 alerts open" href="#" badge={3} badgeTone="warning" />
  </>
);

export const Playground: Story = {
  render: (args) => <TileGroup {...args}>{tiles}</TileGroup>,
};

export const FixedColumns: Story = {
  name: 'fixed columns',
  render: () => (
    <TileGroup legend="deploy" columns={4} minTileWidth="11rem">
      {tiles}
    </TileGroup>
  ),
};

export const WithAction: Story = {
  name: 'with action',
  render: () => (
    <TileGroup
      legend="observability"
      action={
        <Button variant="ghost" size="sm">
          manage
        </Button>
      }
    >
      {tiles}
    </TileGroup>
  ),
};

export const WithDescription: Story = {
  name: 'with description',
  render: () => (
    <TileGroup legend="storage" description="the services every release depends on.">
      {tiles}
    </TileGroup>
  ),
};

export const TabOrder: Story = {
  name: 'tab order',
  render: () => (
    <TileGroup
      legend="monitoring"
      description="every tile is its own tab stop; the arrow keys do nothing."
      navigation="tab"
    >
      {tiles}
    </TileGroup>
  ),
};

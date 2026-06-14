import type { Meta, StoryObj } from '@storybook/react';
import { Server, GitBranch, Database, Activity, Cpu, HardDrive, Timer, Settings } from 'lucide-react';
import { Tile, TileGroup, type TileProps } from '../../src';

const meta: Meta<TileProps> = {
  title: 'Patterns/tile',
  component: Tile,
  parameters: {
    docs: {
      description: {
        component:
          'a square launch tile for the portal. an app tile (icon + title + description) ' +
          'or a kpi tile (value + unit + trend). renders an `<a>` for href, a `<button>` ' +
          'for onClick, or a plain panel when display-only. the whole tile is the target.',
      },
    },
  },
  args: {
    title: 'okd console',
    description: 'cluster ops',
    icon: Server,
    variant: 'app',
    size: 'md',
    href: '#',
    selected: false,
    disabled: false,
    external: false,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['app', 'kpi'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    badgeTone: { control: 'select', options: ['info', 'success', 'warning', 'danger', 'neutral'] },
    status: { control: 'select', options: [undefined, 'online', 'degraded', 'offline', 'unknown'] },
    icon: { table: { disable: true } },
  },
  // tiles size to their grid cell — give the playground a sensible width.
  decorators: [
    (Story) => <div style={{ width: 280 }}>{Story()}</div>,
  ],
};
export default meta;

type Story = StoryObj<TileProps>;

export const Playground: Story = {};

export const App: Story = {
  render: () => (
    <TileGroup legend="infra" columns={3} minTileWidth="14rem">
      <Tile icon={GitBranch} title="gitlab" description="ci/cd + registry" href="#" external />
      <Tile icon={Server} title="okd console" description="cluster ops" href="#" />
      <Tile icon={Database} title="postgres" description="primary db" href="#" status="online" />
    </TileGroup>
  ),
};

export const Kpi: Story = {
  name: 'kpi / metric',
  render: () => (
    <TileGroup legend="health" columns={3} minTileWidth="12rem">
      <Tile variant="kpi" icon={Cpu} title="cpu" value={62} unit="%" delta={{ value: 4, direction: 'up', tone: 'negative' }} />
      <Tile variant="kpi" icon={HardDrive} title="nas001" value="1.8" unit="tb" delta={{ value: 0.2, direction: 'up', tone: 'neutral' }} />
      <Tile variant="kpi" icon={Timer} title="p95" value={142} unit="ms" delta={{ value: 11, direction: 'down', tone: 'positive' }} />
    </TileGroup>
  ),
};

export const Badges: Story = {
  render: () => (
    <TileGroup legend="badges" columns={3} minTileWidth="13rem">
      <Tile icon={Activity} title="metrics" description="count chip" href="#" badge={3} badgeTone="warning" />
      <Tile icon={Server} title="musig" description="status pill" href="#" badge="beta" badgeTone="info" />
      <Tile icon={Database} title="restore" description="danger" href="#" badge="!" badgeTone="danger" />
    </TileGroup>
  ),
};

export const Status: Story = {
  name: 'status dots',
  render: () => (
    <TileGroup legend="services" columns={4} minTileWidth="11rem">
      <Tile icon={Server} title="api" href="#" status="online" />
      <Tile icon={Server} title="stream" href="#" status="degraded" />
      <Tile icon={Server} title="worker" href="#" status="offline" />
      <Tile icon={Server} title="cron" href="#" status="unknown" />
    </TileGroup>
  ),
};

export const States: Story = {
  render: () => (
    <TileGroup legend="states" columns={3} minTileWidth="13rem">
      <Tile icon={Settings} title="settings" description="selected" href="#" selected />
      <Tile icon={Server} title="archive" description="disabled" disabled />
      <Tile icon={GitBranch} title="gitlab" description="external" href="#" external />
    </TileGroup>
  ),
};

export const Sizes: Story = {
  render: () => (
    <TileGroup legend="sizes" columns={3} minTileWidth="13rem">
      <Tile icon={Server} title="sm" description="compact" href="#" size="sm" />
      <Tile icon={Server} title="md" description="default" href="#" size="md" />
      <Tile icon={Server} title="lg" description="roomy" href="#" size="lg" />
    </TileGroup>
  ),
};

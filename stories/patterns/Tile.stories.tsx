import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Activity,
  Archive,
  BookOpen,
  Cpu,
  Database,
  GitBranch,
  Gauge,
  HardDrive,
  ScrollText,
  Server,
  Settings,
  Timer,
} from 'lucide-react';
import { Tile, TileGroup, type TileProps } from '../../src';

const meta: Meta<TileProps> = {
  title: 'Components/navigation/tile',
  component: Tile,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'a square launch tile. an app tile (icon + title + description) or a kpi tile ' +
          '(value + unit + trend). renders an `<a>` for href, a `<button>` for onClick, or a ' +
          'plain panel when it is display-only. the whole tile is the target.',
      },
    },
  },
  args: {
    title: 'pipelines',
    description: 'builds and releases',
    icon: GitBranch,
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
    delta: { control: 'object' },
    icon: { control: false },
    as: { control: false },
    onClick: { control: false },
  },
};
export default meta;

type Story = StoryObj<TileProps>;

// a tile fills its grid cell; on its own it needs a width.
export const Playground: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
};

export const App: Story = {
  render: () => (
    <TileGroup legend="workspace" columns="auto" minTileWidth="13rem">
      <Tile icon={GitBranch} title="pipelines" description="builds and releases" href="#" />
      <Tile icon={Server} title="cluster" description="nodes and workloads" href="#" />
      <Tile icon={Database} title="database" description="db-0, the primary" href="#" status="online" />
    </TileGroup>
  ),
};

export const Kpi: Story = {
  name: 'kpi / metric',
  render: () => (
    <TileGroup legend="health" columns="auto" minTileWidth="12rem">
      <Tile
        variant="kpi"
        icon={Cpu}
        title="cpu"
        value={62}
        unit="%"
        delta={{ value: '+4', direction: 'up', tone: 'negative' }}
      />
      <Tile
        variant="kpi"
        icon={HardDrive}
        title="storage-01"
        value="1.8"
        unit="tb"
        delta={{ value: '+0.2', direction: 'up', tone: 'neutral' }}
      />
      <Tile
        variant="kpi"
        icon={Timer}
        title="p95"
        value={142}
        unit="ms"
        delta={{ value: '−11', direction: 'down', tone: 'positive' }}
      />
    </TileGroup>
  ),
};

export const Badges: Story = {
  render: () => (
    <TileGroup legend="badges" columns="auto" minTileWidth="13rem">
      <Tile icon={Activity} title="metrics" description="3 alerts open" href="#" badge={3} badgeTone="warning" />
      <Tile icon={Gauge} title="reports" description="monthly usage" href="#" badge="new" badgeTone="info" />
      <Tile icon={Archive} title="backups" description="last run at 02:00" href="#" badge="failed" badgeTone="danger" />
      <Tile icon={ScrollText} title="logs" description="live tail" href="#" badge="paused" badgeTone="neutral" />
    </TileGroup>
  ),
};

export const Status: Story = {
  name: 'status dots',
  render: () => (
    <TileGroup legend="services" columns="auto" minTileWidth="11rem">
      <Tile icon={Server} title="api" description="all workers up" href="#" status="online" />
      <Tile icon={Server} title="queue" description="2 of 3 workers down" href="#" status="degraded" />
      <Tile icon={Server} title="worker" description="not responding" href="#" status="offline" />
      <Tile icon={Server} title="scheduler" description="no recent check" href="#" status="unknown" />
    </TileGroup>
  ),
};

export const States: Story = {
  render: () => (
    <TileGroup legend="states" columns="auto" minTileWidth="13rem">
      <Tile
        icon={Settings}
        title="settings"
        description="the current app"
        href="#"
        selected
        aria-current="page"
      />
      <Tile icon={Archive} title="archive" description="read-only during the move" disabled />
      <Tile
        icon={BookOpen}
        title="docs"
        description="opens in a new tab"
        href="https://example.com"
        external
      />
      <Tile icon={Timer} title="uptime" description="display only, no link" />
    </TileGroup>
  ),
};

export const Sizes: Story = {
  render: () => (
    <TileGroup legend="sizes" columns="auto" minTileWidth="13rem">
      <Tile icon={Server} title="sm" description="compact" href="#" size="sm" />
      <Tile icon={Server} title="md" description="default" href="#" size="md" />
      <Tile icon={Server} title="lg" description="roomy" href="#" size="lg" />
    </TileGroup>
  ),
};

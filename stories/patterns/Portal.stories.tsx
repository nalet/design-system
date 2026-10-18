import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  Activity,
  Cpu,
  Database,
  Film,
  GitBranch,
  HardDrive,
  Music,
  Package,
  ScrollText,
  Server,
  Timer,
  Tv,
} from 'lucide-react';
import { Portal, TileGroup, Tile, type PortalProps } from '../../src';

const meta: Meta<PortalProps> = {
  title: 'Patterns/portal',
  component: Portal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The home page layout: grouped square tiles, a favourites slot, a search box and ' +
          'one roving arrow-key model across every group. Groups stay in a stable order; the ' +
          'search filters in place (`/` focuses it, `esc` clears it). Inside a shell, the top ' +
          "bar's search narrows the tiles instead (`searchable={false}` with `query`); the own " +
          'search box is for a launcher that stands on its own.',
      },
    },
  },
  args: {
    title: 'home',
    searchable: true,
    searchPlaceholder: 'search apps…',
    density: 'comfortable',
    navigation: 'roving',
  },
  argTypes: {
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    navigation: { control: 'inline-radio', options: ['roving', 'tab'] },
    // a controlled query without onQueryChange freezes the search box.
    query: { control: false },
    onQueryChange: { control: false },
    favorites: { control: false },
    emptyState: { control: false },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--s-5)', background: 'var(--bg)' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<PortalProps>;

export const Playground: Story = {
  render: (args) => (
    <Portal {...args}>
      <TileGroup legend="build and release" minTileWidth="14rem">
        <Tile icon={GitBranch} title="pipelines" description="Builds and releases" href="#" />
        <Tile icon={Package} title="registry" description="Images and versions" href="#" />
      </TileGroup>
      <TileGroup legend="operations" minTileWidth="14rem">
        <Tile icon={Server} title="cluster" description="Nodes and workloads" href="#" />
        <Tile icon={ScrollText} title="logs" description="Live tail across workers" href="#" />
        <Tile icon={Activity} title="metrics" description="3 alerts open" href="#" badge={3} badgeTone="warning" />
        <Tile icon={Database} title="database" description="db-0, the primary" href="#" status="online" />
      </TileGroup>
    </Portal>
  ),
};

export const WithFavorites: Story = {
  name: 'favourites + controlled search',
  render: function FavouritesLauncher() {
    const [q, setQ] = useState('');
    return (
      <Portal
        title="home"
        searchLabel="search the home page"
        query={q}
        onQueryChange={setQ}
        favorites={
          <TileGroup legend="favourites" minTileWidth="13rem">
            <Tile icon={GitBranch} title="pipelines" description="Builds and releases" href="#" />
            <Tile icon={ScrollText} title="logs" description="Live tail across workers" href="#" />
          </TileGroup>
        }
      >
        <TileGroup legend="media" minTileWidth="13rem">
          <Tile icon={Film} title="video" description="Films and series" href="#" />
          <Tile icon={Music} title="music" description="Albums and playlists" href="#" badge="new" badgeTone="info" />
          <Tile icon={Tv} title="live tv" description="Back after maintenance" disabled />
        </TileGroup>
        <TileGroup legend="services" minTileWidth="13rem">
          <Tile icon={Server} title="cluster" description="Nodes and workloads" href="#" />
          <Tile icon={Database} title="database" description="db-0, the primary" href="#" status="online" />
        </TileGroup>
      </Portal>
    );
  },
};

export const KpiDashboard: Story = {
  name: 'kpi dashboard',
  render: () => (
    <Portal title="health" searchable={false}>
      <TileGroup legend="cluster" minTileWidth="12rem">
        <Tile variant="kpi" icon={Cpu} title="cpu" value={62} unit="%" delta={{ value: '+4', direction: 'up', tone: 'negative' }} />
        <Tile variant="kpi" icon={HardDrive} title="storage-01" value="1.8" unit="tb" delta={{ value: '+0.2', direction: 'up', tone: 'neutral' }} />
        <Tile variant="kpi" icon={Timer} title="p95" value={142} unit="ms" delta={{ value: '−11', direction: 'down', tone: 'positive' }} />
        <Tile variant="kpi" icon={Activity} title="requests" value="2.4k" unit="/s" delta={{ value: '+8', direction: 'up', tone: 'positive' }} />
      </TileGroup>
    </Portal>
  ),
};

export const Compact: Story = {
  render: () => (
    <Portal title="services" density="compact" searchLabel="search services">
      <TileGroup legend="workers" minTileWidth="11rem" gap="sm">
        <Tile icon={Server} title="api" description="All workers up" href="#" status="online" size="sm" />
        <Tile icon={Server} title="queue" description="2 of 3 workers down" href="#" status="degraded" size="sm" />
        <Tile icon={Server} title="worker-2" description="Not responding" href="#" status="offline" size="sm" />
        <Tile icon={Database} title="db-0" description="Primary" href="#" status="online" size="sm" />
      </TileGroup>
    </Portal>
  ),
};

export const NoMatches: Story = {
  name: 'no matches',
  render: function NoMatchesLauncher() {
    const [q, setQ] = useState('backup');
    return (
      <Portal
        title="home"
        searchLabel="search apps, with no match"
        query={q}
        onQueryChange={setQ}
        emptyState={
          <span>
            No apps match “{q}”. Try another word, or press Esc in the search box to clear it.
          </span>
        }
      >
        <TileGroup legend="tools" minTileWidth="13rem">
          <Tile icon={Server} title="cluster" description="Nodes and workloads" href="#" />
          <Tile icon={ScrollText} title="logs" description="Live tail across workers" href="#" />
        </TileGroup>
      </Portal>
    );
  },
};

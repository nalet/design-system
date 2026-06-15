import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Server,
  GitBranch,
  Database,
  Terminal,
  Activity,
  Cpu,
  HardDrive,
  Timer,
  Tv,
  Music,
  Film,
  Star,
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
          'the launchpad home. grouped square tiles, a persistent favourites slot, a search ' +
          'box, and roving-tabindex arrow-key navigation that spans every group. groups stay ' +
          'in a stable order; search filters tiles in place (press `/` to focus search, `esc` ' +
          'to clear). the terminal-aesthetic app launcher that replaces a fiori launchpad.',
      },
    },
  },
  args: {
    title: 'portal',
    searchable: true,
    density: 'comfortable',
    navigation: 'roving',
  },
  argTypes: {
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    navigation: { control: 'inline-radio', options: ['roving', 'tab'] },
  },
  decorators: [(Story) => <div style={{ padding: 'var(--s-6)', minHeight: '100vh', background: 'var(--bg)' }}>{Story()}</div>],
};
export default meta;

type Story = StoryObj<PortalProps>;

export const Playground: Story = {
  render: (args) => (
    <Portal {...args}>
      <TileGroup legend="infra" minTileWidth="14rem">
        <Tile icon={GitBranch} title="gitlab" description="ci/cd + registry" href="#" external />
        <Tile icon={Server} title="okd console" description="cluster ops" href="#" />
        <Tile icon={Database} title="postgres" description="primary db" href="#" status="online" />
      </TileGroup>
      <TileGroup legend="observability">
        <Tile icon={Terminal} title="logs" description="loki tail" href="#" />
        <Tile icon={Activity} title="metrics" description="apm" href="#" badge={3} badgeTone="warning" />
      </TileGroup>
    </Portal>
  ),
};

export const KpiDashboard: Story = {
  name: 'kpi dashboard',
  render: () => (
    <Portal title="health" searchable={false}>
      <TileGroup legend="cluster" minTileWidth="12rem">
        <Tile variant="kpi" icon={Cpu} title="cpu" value={62} unit="%" delta={{ value: 4, direction: 'up', tone: 'negative' }} />
        <Tile variant="kpi" icon={HardDrive} title="nas001" value="1.8" unit="tb" delta={{ value: 0.2, direction: 'up', tone: 'neutral' }} />
        <Tile variant="kpi" icon={Timer} title="p95" value={142} unit="ms" delta={{ value: 11, direction: 'down', tone: 'positive' }} />
        <Tile variant="kpi" icon={Activity} title="rps" value="2.4k" delta={{ value: 8, direction: 'up', tone: 'positive' }} />
      </TileGroup>
    </Portal>
  ),
};

export const WithFavorites: Story = {
  name: 'favourites + controlled search',
  render: function FavLauncher() {
    const [q, setQ] = useState('');
    const [favs, setFavs] = useState<string[]>(['chino']);
    const toggle = (id: string) =>
      setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
    return (
      <Portal
        title="launchpad"
        query={q}
        onQueryChange={setQ}
        favorites={
          <TileGroup legend="favourites" minTileWidth="13rem">
            <Tile icon={Star} title="chino" description="pinned" href="#" selected onClick={() => toggle('chino')} />
          </TileGroup>
        }
      >
        <TileGroup legend="stube">
          <Tile icon={Tv} title="chino" description="video" href="#" />
          <Tile icon={Music} title="musig" description="audio" href="#" badge="beta" badgeTone="info" />
          <Tile icon={Film} title="tv" description="live" href="#" disabled />
        </TileGroup>
        <TileGroup legend="infra">
          <Tile icon={GitBranch} title="gitlab" description="ci/cd" href="#" external />
          <Tile icon={Server} title="okd" description="cluster" href="#" />
        </TileGroup>
      </Portal>
    );
  },
};

export const Compact: Story = {
  render: () => (
    <Portal title="portal" density="compact">
      <TileGroup legend="services" minTileWidth="11rem" gap="sm">
        <Tile icon={Server} title="api" href="#" status="online" />
        <Tile icon={Server} title="stream" href="#" status="degraded" />
        <Tile icon={Server} title="worker" href="#" status="offline" />
        <Tile icon={Database} title="db" href="#" status="online" />
      </TileGroup>
    </Portal>
  ),
};

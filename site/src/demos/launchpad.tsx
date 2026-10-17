// live examples for the launchpad & tiles pattern that compose the portal,
// its groups and tiles, or keep state (a search with its own empty state).
import { useState, type ReactNode } from 'react';
import {
  Activity,
  AlertTriangle,
  Database,
  Download,
  Film,
  FolderSearch,
  GitBranch,
  Music,
  Package,
  Plug,
  ScrollText,
  Search,
  Server,
  SlidersHorizontal,
  Tv,
} from 'lucide-react';
import { Chevron, Portal, Tile, TileGroup } from '@nalet/design-system';

// ---- the floorplan, as a schematic ----------------------------------------

function Zone({
  n,
  name,
  note,
  dashed,
  grow,
  children,
}: {
  n: string;
  name: string;
  note?: string;
  dashed?: boolean;
  grow?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--s-2)',
        alignContent: 'start',
        minWidth: 0,
        flex: grow ? '1 1 12rem' : undefined,
        padding: 'var(--s-3)',
        background: 'var(--bg)',
        border: `1px ${dashed ? 'dashed' : 'solid'} var(--border-2)`,
      }}
    >
      <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg)' }}>
        <span
          style={{
            display: 'inline-block',
            minWidth: 18,
            marginRight: 'var(--s-2)',
            border: '1px solid var(--border-2)',
            color: 'var(--fg-muted)',
            textAlign: 'center',
          }}
        >
          {n}
        </span>
        {name}
        {note ? <span style={{ color: 'var(--fg-muted)' }}> · {note}</span> : null}
      </span>
      {children}
    </div>
  );
}

function Slots({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-2)' }}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} style={{ width: 64, height: 40, background: 'var(--surface)', border: '1px solid var(--border)' }} />
      ))}
    </div>
  );
}

function Legend({ children, action }: { children: ReactNode; action?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 'var(--s-3)',
        fontFamily: 'var(--ff-mono)',
        fontSize: 12,
        color: 'var(--fg-muted)',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--s-1)' }}>
        <Chevron size={12} aria-hidden />
        {children}
      </span>
      {action ? <span>{action}</span> : null}
    </div>
  );
}

/** the launchpad floorplan, zone by zone. */
export function Floorplan() {
  return (
    <div style={{ display: 'grid', gap: 'var(--s-3)', width: '100%' }} role="group" aria-label="the launchpad floorplan, schematic">
      <Zone n="1" name="title bar">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-3)' }}>
          <Zone n="2" name="title" note="h1, led by the chevron" grow />
          <Zone n="3" name="search" note="a search landmark" grow />
        </div>
      </Zone>
      <Zone n="4" name="favourites slot" note="a tile group you render">
        <Slots count={3} />
      </Zone>
      <Zone n="5" name="groups" note="tile groups, in the order you give them">
        <Legend action="action">legend</Legend>
        <Slots count={4} />
        <Legend>legend</Legend>
        <Slots count={2} />
      </Zone>
      <Zone n="6" name="empty state" note="only while a search matches nothing" dashed />
      <Zone n="7" name="live region" note="not visible; announces the match count" dashed />
    </div>
  );
}

// ---- when to use a tile ---------------------------------------------------

/** one tile for the app, one key figure that opens it filtered. */
export function OneTilePerApp() {
  return (
    <TileGroup legend="apps" minTileWidth="11rem" gap="sm">
      <Tile icon={Download} title="downloads" description="What is on its way, and what needs a person" href="#" />
      <Tile variant="kpi" icon={AlertTriangle} title="needs attention" value={3} href="#" />
    </TileGroup>
  );
}

/** six tiles that mirror one app's views: a second navigation. */
export function TilesPerView() {
  return (
    <TileGroup legend="downloads" minTileWidth="9rem" gap="sm">
      <Tile icon={Tv} title="requests" href="#" size="sm" />
      <Tile icon={Download} title="downloads" href="#" size="sm" />
      <Tile icon={Search} title="search" href="#" size="sm" />
      <Tile icon={FolderSearch} title="search sources" href="#" size="sm" />
      <Tile icon={Plug} title="clients" href="#" size="sm" />
      <Tile icon={SlidersHorizontal} title="quality profiles" href="#" size="sm" />
    </TileGroup>
  );
}

// ---- the launchpad's do and don't -----------------------------------------

export function FavouritesFirst() {
  return (
    <Portal
      searchable={false}
      favorites={
        <TileGroup legend="pinned" minTileWidth="8rem" gap="sm">
          <Tile icon={GitBranch} title="pipelines" href="#" size="sm" />
        </TileGroup>
      }
    >
      <TileGroup legend="infrastructure" minTileWidth="8rem" gap="sm">
        <Tile icon={Server} title="cluster" href="#" size="sm" />
        <Tile icon={ScrollText} title="logs" href="#" size="sm" />
      </TileGroup>
      <TileGroup legend="entertainment" minTileWidth="8rem" gap="sm">
        <Tile icon={Film} title="video" href="#" size="sm" />
        <Tile icon={Music} title="music" href="#" size="sm" />
      </TileGroup>
    </Portal>
  );
}

export function OneGroupForEverything() {
  return (
    <Portal searchable={false}>
      <TileGroup legend="apps" minTileWidth="8rem" gap="sm">
        <Tile icon={Music} title="music" href="#" size="sm" />
        <Tile icon={Server} title="cluster" href="#" size="sm" />
        <Tile icon={GitBranch} title="pipelines" href="#" size="sm" />
        <Tile icon={Film} title="video" href="#" size="sm" />
        <Tile icon={ScrollText} title="logs" href="#" size="sm" />
      </TileGroup>
    </Portal>
  );
}

export function TitleNamesThePlace({ greeting = false }: { greeting?: boolean }) {
  return (
    <Portal title={greeting ? 'welcome back, here is everything you can do today' : 'launchpad'} searchable={false}>
      <TileGroup legend={greeting ? 'platform' : 'runtime'} minTileWidth="8rem" gap="sm">
        <Tile icon={Server} title="cluster" href="#" size="sm" />
        <Tile icon={Activity} title="metrics" href="#" size="sm" />
      </TileGroup>
    </Portal>
  );
}

/**
 * a launcher whose search starts with a query that matches nothing, with a
 * helpful or a bare empty state. interactive: hydrate it.
 */
export function Launcher({ helpful }: { helpful: boolean }) {
  const [q, setQ] = useState('backup');
  return (
    <Portal
      title="launchpad"
      searchLabel={helpful ? 'search, a helpful empty state' : 'search, a bare empty state'}
      query={q}
      onQueryChange={setQ}
      emptyState={
        helpful ? (
          <span>No apps match “{q}”. Try another word, or press Esc in the search box to clear it.</span>
        ) : (
          <span>No results</span>
        )
      }
    >
      <TileGroup legend={helpful ? 'backups' : 'storage'} minTileWidth="8rem" gap="sm">
        <Tile icon={Database} title="database" href="#" size="sm" />
        <Tile icon={Package} title="registry" href="#" size="sm" />
      </TileGroup>
    </Portal>
  );
}

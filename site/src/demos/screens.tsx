// live examples of the components on a screen made for touch and on a tv, for
// foundations/layout and patterns/tv-focus. each one is the real components
// inside an element that carries data-nc-screen, as an app's root element
// does; nothing else is styled here. they are composed in react because a
// field wires its label to its control, and because some of them hold state.
import { useState, type CSSProperties, type ReactNode } from 'react';
import { Film, Music, Plus, RotateCw } from 'lucide-react';
import {
  Banner,
  Button,
  Checkbox,
  Field,
  Icon,
  IconButton,
  Input,
  Select,
  Switch,
  Table,
  Tabs,
  Tile,
  TileGroup,
  type TableColumn,
} from '@nalet/design-system';

const column: CSSProperties = { display: 'grid', gap: 'var(--s-4)', width: '100%', minWidth: 0 };
const caption: CSSProperties = { fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg-muted)' };

/** a part of an example with its name over it. */
function Part({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--s-3)', minWidth: 0, justifyItems: 'start', alignContent: 'start' }}>
      <span style={caption}>{name}</span>
      {children}
    </div>
  );
}

/**
 * a screen made for touch: controls asked for at the small size are drawn
 * large, a banner's details and dismiss keep their look, and a switch and a
 * checkbox take a row of 48 with their label.
 */
export function TouchControls() {
  const [shown, setShown] = useState(true);
  return (
    <div data-nc-screen="touch" style={column}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--s-2)' }}>
        <Button size="sm">try again</Button>
        <IconButton size="sm" label="check again">
          <Icon icon={RotateCw} />
        </IconButton>
        <IconButton size="sm" label="add a volume">
          <Icon icon={Plus} />
        </IconButton>
      </div>
      {shown ? (
        <Banner state="warning" details="storage-02 · disk 3 · 14 read errors since 09:12" onDismiss={() => setShown(false)}>
          One disk in storage-02 is slow.
        </Banner>
      ) : (
        <div>
          <Button variant="ghost" onClick={() => setShown(true)}>
            show the message again
          </Button>
        </div>
      )}
      <div style={{ display: 'grid', justifyItems: 'start' }}>
        <Switch size="sm" label="Email alerts" defaultChecked />
        <Checkbox label="Include archived volumes" />
      </div>
    </div>
  );
}

interface Episode {
  episode: string;
  length: string;
}

const EPISODES: Episode[] = [
  { episode: 'S01E01 · Arrival', length: '52 min' },
  { episode: 'S01E02 · The Harbour', length: '48 min' },
  { episode: 'S01E03 · Low Tide', length: '50 min' },
];

const EPISODE_COLUMNS: TableColumn<Episode>[] = [
  { key: 'episode', header: 'episode' },
  { key: 'length', header: 'length', align: 'right' },
];

/** a tv: large controls 12 apart, rows of 48, and the text at its tv sizes. */
export function TvScreen() {
  return (
    <div data-nc-screen="tv" style={{ ...column, padding: 'var(--s-3)', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--s-3)' }}>
        <Button size="sm" variant="primary">
          play
        </Button>
        <Button size="sm">add to list</Button>
        <IconButton size="sm" label="play from the start">
          <Icon icon={RotateCw} />
        </IconButton>
      </div>
      <Table aria-label="season 1" columns={EPISODE_COLUMNS} rows={EPISODES} />
    </div>
  );
}

const VIEWS = [
  { value: 'episodes', label: 'episodes' },
  { value: 'extras', label: 'extras' },
];

const SUBTITLES = [
  { label: 'off', value: 'off' },
  { label: 'English', value: 'en' },
  { label: 'German', value: 'de' },
  { label: 'French', value: 'fr' },
  { label: 'Spanish', value: 'es' },
];

/** the tv focus on the real components, one group for each kind of item. */
export function TvFocus() {
  return (
    <div
      data-nc-screen="tv"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 17rem), 1fr))',
        gap: 'var(--s-6)',
        width: '100%',
        padding: 'var(--s-3)',
        boxSizing: 'border-box',
      }}
    >
      <Part name="buttons">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--s-3)' }}>
          <Button variant="primary">play</Button>
          <Button>add to list</Button>
          <IconButton label="play from the start">
            <Icon icon={RotateCw} />
          </IconButton>
        </div>
      </Part>
      <Part name="rows">
        <div style={{ display: 'grid', justifyItems: 'stretch', width: '100%' }}>
          <Tabs defaultValue="episodes" items={VIEWS} />
          <Switch label="Play the next episode" defaultChecked />
          <Checkbox label="Skip the opening credits" />
        </div>
      </Part>
      <Part name="cards">
        <TileGroup legend="library" minTileWidth="8.5rem" gap="sm" style={{ width: '100%' }}>
          <Tile title="films" icon={Film} description="212 titles" onClick={() => undefined} />
          <Tile title="music" icon={Music} description="48 albums" onClick={() => undefined} />
        </TileGroup>
      </Part>
      <Part name="fields and selects">
        <TvFields bare />
      </Part>
    </div>
  );
}

/** a text field and a select on a tv: press on the select and it opens its own list. */
export function TvFields({ bare = false }: { bare?: boolean }) {
  const [subtitles, setSubtitles] = useState('en');
  const fields = (
    <div style={{ display: 'grid', gap: 'var(--s-4)', width: '100%', maxWidth: '21rem' }}>
      <Field label="Server address">
        <Input defaultValue="media.example.com" />
      </Field>
      <Field label="Subtitles">
        <Select options={SUBTITLES} value={subtitles} onChange={(e) => setSubtitles(e.target.value)} />
      </Field>
    </div>
  );
  if (bare) return fields;
  return (
    <div data-nc-screen="tv" style={{ width: '100%', padding: 'var(--s-3)', boxSizing: 'border-box' }}>
      {fields}
    </div>
  );
}

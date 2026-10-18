// storyboard drawings for the home page: one page of tiles in a few fixed
// groups, the search in the shell bar that narrows them in place, when
// something gets a tile, and the tile and the tile group close up.
import type { ComponentProps, ReactNode } from 'react';
import {
  Arrow,
  Bell,
  Button,
  Callout,
  Chevron,
  Cross,
  FocusRing,
  GroupTitle,
  Line,
  Pointer,
  Screen,
  SearchField,
  Sketch,
  Tile,
  Word,
} from './kit';

type TileProps = Partial<ComponentProps<typeof Tile>>;

/** the shell bar across the top: the product's name, the search, the bell and the avatar. */
function Top() {
  return (
    <g>
      <Chevron x={8} y={5} />
      <Line x={20} y={7} w={36} strong />
      <SearchField x={176} y={3} w={92} h={11} />
      <Bell x={278} y={3.5} />
      <rect className="sk-avatar" x={296} y={3} width={13} height={11} />
    </g>
  );
}

/** the home page's title, led by the chevron. the search isn't here: it is in the shell bar. */
function Head({ y = 22 }: { y?: number }) {
  return (
    <g>
      <Chevron x={12} y={y + 2} s={7} />
      <Word x={24} y={y + 9} size="md" tone="strong">
        home
      </Word>
    </g>
  );
}

const NAME_W = [34, 26, 40, 30];

/** a row of tiles. */
function Row({ y, n, x = 12, w = 70, h = 38, gap = 4, props = {} }: { y: number; n: number; x?: number; w?: number; h?: number; gap?: number; props?: Record<number, TileProps> }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <Tile key={i} x={x + i * (w + gap)} y={y} w={w} h={h} nameW={NAME_W[i % NAME_W.length]} {...props[i]} />
      ))}
    </g>
  );
}

/** a tile drawn small, for a home page seen from afar. */
function TinyTile({ x, y, w = 30, h = 18, accent }: { x: number; y: number; w?: number; h?: number; accent?: boolean }) {
  return (
    <g>
      <rect className={accent ? 'sk-card sk-card--new' : 'sk-card'} x={x} y={y} width={w} height={h} />
      <rect className="sk-icon sk-icon--accent" x={x + 4} y={y + 4} width={5} height={5} />
      <Line x={x + 4} y={y + h - 7} w={w - 10} />
    </g>
  );
}

/* ---- the home page as a whole --------------------------------------------- */

export function LaunchpadOverview() {
  return (
    <Sketch h={224} label="The home page: the shell bar at the top with the search in it, then the title, home, and three groups of tiles in a fixed order, apps, manage and settings. One tile in apps is a number tile showing 3 in amber.">
      <Screen h={222} />
      <Top />
      <Head />
      <GroupTitle x={12} y={54}>apps</GroupTitle>
      <Row y={59} n={4} props={{ 1: { figure: '3', figureTone: 'warn', icon: false, nameW: 40 } }} />
      <GroupTitle x={12} y={114}>manage</GroupTitle>
      <Row y={119} n={2} />
      <GroupTitle x={12} y={174}>settings</GroupTitle>
      <Row y={179} n={2} />
    </Sketch>
  );
}

export function OnePage() {
  return (
    <Sketch label="One home page with every group in view: apps, manage and settings, always in this order.">
      <Screen />
      <Top />
      <Head />
      <GroupTitle x={12} y={50}>apps</GroupTitle>
      <Row y={55} n={4} h={30} />
      <GroupTitle x={12} y={102}>manage</GroupTitle>
      <Row y={107} n={2} h={30} />
      <GroupTitle x={12} y={154}>settings</GroupTitle>
      <Row y={159} n={2} h={30} />
    </Sketch>
  );
}

export function ManyPages() {
  const tabs = ['work', 'tools', 'admin'];
  return (
    <Sketch label="A home page split into three pages, work, tools and admin. The page that is open shows only three tiles.">
      <Screen />
      <Top />
      <Head />
      {tabs.map((t, i) => (
        <g key={t}>
          <Word x={12 + i * 40} y={50} size="xs" tone={i === 0 ? 'accent' : 'strong'}>
            {t}
          </Word>
          {i === 0 ? <rect className="sk-fill-info" x={12} y={53} width={22} height={2} /> : null}
        </g>
      ))}
      <line className="sk-rule" x1={1} x2={319} y1={57} y2={57} />
      <Row y={68} n={3} h={30} />
    </Sketch>
  );
}

/* ---- search ----------------------------------------------------------------- */

/** the home page drawn small, with the search in its shell bar; with a query, someone is typing there. */
function MiniLaunchpad({ x, query }: { x: number; query?: string }) {
  return (
    <g>
      <Screen x={x} w={146} h={160} />
      <Chevron x={x + 7} y={5} />
      <Line x={x + 19} y={7} w={26} strong />
      <SearchField x={x + 52} y={4} w={60} h={9} text={query} />
      {query ? <FocusRing x={x + 52} y={4} w={60} h={9} /> : null}
      <Bell x={x + 118} y={4} />
      <rect className="sk-avatar" x={x + 132} y={4} width={9} height={9} />
      <Chevron x={x + 8} y={24} s={5} />
      <Word x={x + 16} y={30} size="sm" tone="strong">
        home
      </Word>
      <GroupTitle x={x + 7} y={48}>apps</GroupTitle>
      {query ? (
        <Tile x={x + 7} y={53} w={78} h={38} name="downloads" />
      ) : (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <TinyTile key={i} x={x + 7 + i * 33} y={53} />
          ))}
          <GroupTitle x={x + 7} y={90}>manage</GroupTitle>
          <TinyTile x={x + 7} y={95} />
          <TinyTile x={x + 40} y={95} />
          <GroupTitle x={x + 7} y={132}>settings</GroupTitle>
          <TinyTile x={x + 7} y={137} />
          <TinyTile x={x + 40} y={137} />
        </g>
      )}
    </g>
  );
}

export function SearchNarrows() {
  return (
    <Sketch h={164} label="Before and after typing down in the search in the shell bar. Before: the home page with every group and tile. After: only the downloads tile, in the apps group.">
      <MiniLaunchpad x={1} />
      <Arrow x1={151} y1={82} x2={169} y2={82} />
      <MiniLaunchpad x={173} query="down" />
    </Sketch>
  );
}

export function OneSearch() {
  return (
    <Sketch h={112} label="The home page with one search, in the shell bar. Under the title, the apps group and its tiles.">
      <Screen h={110} />
      <Top />
      <Head />
      <GroupTitle x={12} y={54}>apps</GroupTitle>
      <Row y={59} n={4} />
    </Sketch>
  );
}

export function TwoSearches() {
  return (
    <Sketch h={112} label="The home page with two search boxes: one in the shell bar, and a second one on the page, at the end of the title's row. Under them, the apps group and its tiles.">
      <Screen h={110} />
      <Top />
      <Head />
      <SearchField x={206} y={22} w={100} />
      <GroupTitle x={12} y={54}>apps</GroupTitle>
      <Row y={59} n={4} />
    </Sketch>
  );
}

export function MyAppsPlanned() {
  return (
    <Sketch h={160} label="Planned: a my apps group at the top of the home page, drawn dashed, holding the tiles one person pinned. The apps group follows below it.">
      <Screen h={158} />
      <Top />
      <Head />
      <GroupTitle x={12} y={50}>my apps</GroupTitle>
      <Row y={55} n={2} h={34} props={{ 0: { planned: true }, 1: { planned: true } }} />
      <GroupTitle x={12} y={106}>apps</GroupTitle>
      <Row y={111} n={4} h={34} />
    </Sketch>
  );
}

/* ---- when something gets a tile -------------------------------------------- */

export function WhatGetsATile() {
  const lanes: { a: string; b: string; tile: TileProps; note: string[]; none?: boolean }[] = [
    { a: 'An app with', b: 'its own job', tile: { name: 'downloads' }, note: ['one tile'] },
    { a: 'A number someone', b: 'must act on', tile: { name: 'needs attention', icon: false, figure: '3', figureTone: 'warn' }, note: ['one per app,', 'at most'] },
    { a: 'A frequent task with', b: 'its own way in', tile: { name: 'request a title' }, note: ['rarely'] },
    { a: "An app's views, its", b: 'setup, outside links', tile: { state: 'disabled', nameW: 40 }, note: ['no tile'], none: true },
  ];
  return (
    <Sketch h={236} label="A decision storyboard in four rows. An app with its own job gets one tile. A number someone must act on may get one number tile per app, at most. A frequent task with its own way in rarely gets a task tile. An app's views, its setup and outside links get no tile.">
      {lanes.map((l, i) => {
        const y = 2 + i * 58;
        return (
          <g key={l.a}>
            {i > 0 ? <line className="sk-rule" x1={4} x2={316} y1={y - 1} y2={y - 1} /> : null}
            <Word x={8} y={y + 26} size="xs" tone="strong" mono={false}>
              {l.a}
            </Word>
            <Word x={8} y={y + 37} size="xs" tone="strong" mono={false}>
              {l.b}
            </Word>
            <Arrow x1={112} y1={y + 29} x2={140} y2={y + 29} />
            <Tile x={148} y={y + 7} w={100} h={44} {...l.tile} />
            {l.none ? <Cross x={188} y={y + 19} s={20} /> : null}
            {l.note.map((n, j) => (
              <Word key={n} x={258} y={y + 27 + j * 11} size="xs" tone={l.none ? 'err' : 'dim'} mono={false}>
                {n}
              </Word>
            ))}
          </g>
        );
      })}
    </Sketch>
  );
}

export function AppAndNumber() {
  return (
    <Sketch h={112} label="An apps group with three tiles: the downloads app, a number tile showing 3 that need attention in amber, and the catalog.">
      <Screen h={110} />
      <Top />
      <GroupTitle x={12} y={34}>apps</GroupTitle>
      <Tile x={12} y={40} w={96} h={58} name="downloads" desc={2} />
      <Tile x={116} y={40} w={96} h={58} name="needs attention" icon={false} figure="3" figureTone="warn" />
      <Tile x={220} y={40} w={88} h={58} name="catalog" desc={2} />
    </Sketch>
  );
}

export function TilePerView() {
  const names = ['requests', 'downloads', 'search', 'sources', 'clients', 'settings'];
  return (
    <Sketch h={160} label="A group called downloads with six tiles, one for each of the app's views: requests, downloads, search, sources, clients and settings.">
      <Screen h={158} />
      <Top />
      <GroupTitle x={12} y={34}>downloads</GroupTitle>
      {names.map((n, i) => (
        <Tile key={n} x={12 + (i % 3) * 104} y={40 + Math.floor(i / 3) * 58} w={96} h={50} name={n} />
      ))}
    </Sketch>
  );
}

/* ---- groups ----------------------------------------------------------------- */

function Groups({ groups }: { groups: { title: string; n: number }[] }) {
  return (
    <g>
      {groups.map((g, i) => (
        <g key={g.title}>
          <GroupTitle x={12} y={34 + i * 52}>
            {g.title}
          </GroupTitle>
          <Row y={39 + i * 52} n={g.n} h={28} />
        </g>
      ))}
    </g>
  );
}

export function GroupsByPeople() {
  return (
    <Sketch h={178} label="Three groups named after the people who use them, apps, manage and settings, with four, two and two tiles.">
      <Screen h={176} />
      <Top />
      <Groups
        groups={[
          { title: 'apps', n: 4 },
          { title: 'manage', n: 2 },
          { title: 'settings', n: 2 },
        ]}
      />
    </Sketch>
  );
}

export function GroupsByAddon() {
  return (
    <Sketch h={178} label="Groups named after the addons the apps came from: downloads addon, catalog addon and vendor tools, each with one or two tiles.">
      <Screen h={176} />
      <Top />
      <Groups
        groups={[
          { title: 'downloads addon', n: 1 },
          { title: 'catalog addon', n: 2 },
          { title: 'vendor tools', n: 1 },
        ]}
      />
    </Sketch>
  );
}

export function AddonJoins() {
  return (
    <Sketch h={172} label="A new addon, drawn on the right, brings one app tile and one number tile. An arrow shows both joining the end of the home page's apps group; the addon brings no group of its own.">
      <Screen w={180} h={170} />
      <Chevron x={8} y={5} />
      <Line x={20} y={7} w={30} strong />
      <GroupTitle x={9} y={36}>apps</GroupTitle>
      <TinyTile x={9} y={41} w={34} h={22} />
      <TinyTile x={47} y={41} w={34} h={22} />
      <TinyTile x={85} y={41} w={34} h={22} accent />
      <TinyTile x={123} y={41} w={34} h={22} accent />
      <GroupTitle x={9} y={86}>manage</GroupTitle>
      <TinyTile x={9} y={91} w={34} h={22} />
      <TinyTile x={47} y={91} w={34} h={22} />
      <GroupTitle x={9} y={136}>settings</GroupTitle>
      <TinyTile x={9} y={141} w={34} h={22} />
      <TinyTile x={47} y={141} w={34} h={22} />
      <rect className="sk-planned" x={200} y={22} width={114} height={146} />
      <Word x={208} y={37} size="xs" tone="dim" mono={false}>
        A new addon
      </Word>
      <Tile x={208} y={45} w={98} h={44} nameW={36} fresh />
      <Tile x={208} y={99} w={98} h={56} icon={false} nameW={44} figure="2" fresh />
      <Arrow x1={196} y1={66} x2={161} y2={52} />
    </Sketch>
  );
}

/* ---- the tile, close up ----------------------------------------------------- */

export function TileAnatomy() {
  return (
    <Sketch h={128} label="An app tile and a number tile, close up: 1 the icon, 2 the name, 3 the description, 4 a badge with a count, 5 the status dot, 6 the number and how it changed.">
      <rect className="sk-screen" x={1} y={1} width={318} height={126} />
      <Tile x={26} y={34} w={128} h={66} name="downloads" desc={2} badge="3" badgeTone="warn" dot="ok" />
      <Tile x={172} y={34} w={128} h={66} name="needs attention" icon={false} figure="3" figureTone="warn" />
      <Word x={192} y={93} size="xs" tone="dim">
        +2
      </Word>
      <Callout x={14} y={45} n={1} />
      <Pointer x1={20} y1={45} x2={33} y2={45} />
      <Callout x={66} y={18} n={2} />
      <Pointer x1={66} y1={24} x2={66} y2={39} />
      <Callout x={14} y={64} n={3} />
      <Pointer x1={20} y1={63} x2={33} y2={59} />
      <Callout x={143} y={18} n={4} />
      <Pointer x1={143} y1={24} x2={143} y2={39} />
      <Callout x={120} y={18} n={5} />
      <Pointer x1={121} y1={24} x2={130} y2={41} />
      <Callout x={214} y={114} n={6} />
      <Pointer x1={208} y1={113} x2={192} y2={98} />
    </Sketch>
  );
}

export function TileStates() {
  const states: { s?: TileProps['state']; label: string }[] = [
    { label: 'at rest' },
    { s: 'focus', label: 'focused' },
    { s: 'current', label: 'current app' },
    { s: 'disabled', label: "can't be opened" },
  ];
  return (
    <Sketch h={80} label="Four tiles, from left: at rest; with the keyboard focus, a blue frame and a chevron after the name; the current app, with a blue bar on its left edge; and one that can't be opened, faded.">
      {states.map((t, i) => (
        <g key={t.label}>
          <Tile x={10 + i * 78} y={10} w={68} h={42} state={t.s} />
          <Word x={10 + i * 78} y={68} size="xs" tone="dim" mono={false}>
            {t.label}
          </Word>
        </g>
      ))}
    </Sketch>
  );
}

function WordyTile({ x, y, w, name, lines, badge, badgeTone, dot }: { x: number; y: number; w: number; name: string; lines: string[]; badge?: string; badgeTone?: TileProps['badgeTone']; dot?: TileProps['dot'] }) {
  return (
    <g>
      <Tile x={x} y={y} w={w} h={50} name={name} desc={0} badge={badge} badgeTone={badgeTone} dot={dot} />
      {lines.map((l, i) => (
        <Word key={l} x={x + 7} y={y + 31 + i * 11} size="xs" tone="dim" mono={false}>
          {l}
        </Word>
      ))}
    </g>
  );
}

export function TileWordsDo() {
  return (
    <Sketch w={180} h={80} label="A tile named downloads, with the description: What is on its way.">
      <WordyTile x={25} y={15} w={130} name="downloads" lines={['What is on its way']} />
    </Sketch>
  );
}

export function TileWordsDont() {
  return (
    <Sketch w={180} h={80} label="A tile whose name, open the downloads app, is cut short, and whose description is a long sentence cut off after two lines.">
      <WordyTile x={25} y={15} w={130} name="open the downloads…" lines={['Click here to see every', 'download that is on its…']} />
    </Sketch>
  );
}

export function SignalsDo() {
  return (
    <Sketch w={180} h={136} label="Two tiles. Downloads has an amber badge with 3 and the description 3 downloads failed. Catalog has an amber dot and the description 1 of 2 sources down.">
      <WordyTile x={20} y={10} w={140} name="downloads" badge="3" badgeTone="warn" lines={['3 downloads failed']} />
      <WordyTile x={20} y={72} w={140} name="catalog" dot="warn" lines={['1 of 2 sources down']} />
    </Sketch>
  );
}

export function SignalsDont() {
  return (
    <Sketch w={180} h={136} label="Two tiles. Downloads has a red badge with an exclamation mark and an unrelated description. Catalog has an amber dot and no words.">
      <WordyTile x={20} y={10} w={140} name="downloads" badge="!" badgeTone="err" lines={['What is on its way']} />
      <WordyTile x={20} y={72} w={140} name="catalog" dot="warn" lines={[]} />
    </Sketch>
  );
}

/* ---- the tile group, close up ----------------------------------------------- */

export function GroupAnatomy() {
  return (
    <Sketch h={146} label="A tile group, close up: 1 its title, led by a chevron, 2 one quiet action at the end of the title row, 3 a line of description, 4 the tiles in a grid.">
      <rect className="sk-screen" x={1} y={1} width={318} height={144} />
      <GroupTitle x={40} y={26}>apps</GroupTitle>
      <Button x={242} y={18} w={36} />
      <Line x={40} y={34} w={120} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Tile key={i} x={40 + (i % 3) * 82} y={46 + Math.floor(i / 3) * 46} w={74} h={38} nameW={NAME_W[i % 4]} />
      ))}
      <Callout x={22} y={24} n={1} />
      <Pointer x1={28} y1={24} x2={38} y2={24} />
      <Callout x={300} y={24} n={2} />
      <Pointer x1={294} y1={24} x2={280} y2={24} />
      <Callout x={22} y={39} n={3} />
      <Pointer x1={28} y1={38} x2={38} y2={36} />
      <Callout x={300} y={92} n={4} />
      <Pointer x1={294} y1={92} x2={279} y2={92} />
    </Sketch>
  );
}

function Phone({ children, label }: { children: ReactNode; label: string }) {
  return (
    <Sketch w={200} h={230} label={label}>
      <rect className="sk-screen" x={50} y={1} width={110} height={226} />
      <rect className="sk-bar" x={50} y={1} width={110} height={16} />
      <Chevron x={56} y={5} />
      <GroupTitle x={58} y={32}>apps</GroupTitle>
      {children}
    </Sketch>
  );
}

export function GridReflows() {
  return (
    <Phone label="On a phone, the apps group shows its tiles in two columns, each wide enough for its name.">
      {Array.from({ length: 8 }, (_, i) => (
        <Tile key={i} x={57 + (i % 2) * 49} y={38 + Math.floor(i / 2) * 44} w={45} h={38} nameW={16} />
      ))}
    </Phone>
  );
}

export function GridSqueezed() {
  const names = ['do…', 'ca…', 're…', 'se…', 'cl…', 'pl…', 'li…', 'he…'];
  return (
    <Phone label="On a phone, the apps group keeps four columns, so every tile is too narrow and each name is cut to two letters.">
      {names.map((n, i) => (
        <g key={n}>
          <rect className="sk-card" x={56 + (i % 4) * 25} y={38 + Math.floor(i / 4) * 34} width={22} height={30} />
          <rect className="sk-icon sk-icon--accent" x={59 + (i % 4) * 25} y={41 + Math.floor(i / 4) * 34} width={5} height={5} />
          <Word x={58 + (i % 4) * 25} y={60 + Math.floor(i / 4) * 34} size="xs" tone="strong">
            {n}
          </Word>
        </g>
      ))}
    </Phone>
  );
}

/* ---- the keyboard ----------------------------------------------------------- */

export function ArrowKeys() {
  return (
    <Sketch h={150} label="Tab enters the tiles once, on the first tile of apps, which has the focus. An arrow to the right leads to the next tile; an arrow down leads into the manage group.">
      <rect className="sk-screen" x={1} y={1} width={318} height={148} />
      <GroupTitle x={50} y={24}>apps</GroupTitle>
      {[0, 1, 2].map((i) => (
        <Tile key={i} x={50 + i * 86} y={30} w={64} h={38} nameW={[24, 20, 28][i]} state={i === 0 ? 'focus' : undefined} />
      ))}
      <GroupTitle x={50} y={98}>manage</GroupTitle>
      {[0, 1].map((i) => (
        <Tile key={i} x={50 + i * 86} y={104} w={64} h={38} nameW={[22, 26][i]} />
      ))}
      <Word x={10} y={42} size="xs" tone="dim">
        tab
      </Word>
      <Arrow x1={10} y1={49} x2={45} y2={49} />
      <Arrow x1={118} y1={49} x2={133} y2={49} />
      <Word x={120} y={42} size="xs" tone="dim">
        →
      </Word>
      <Arrow x1={100} y1={72} x2={100} y2={101} />
      <Word x={104} y={90} size="xs" tone="dim">
        ↓
      </Word>
    </Sketch>
  );
}

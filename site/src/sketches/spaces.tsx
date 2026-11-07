// storyboard drawings for spaces: the portal's home page in a few spaces,
// listed as words in a bar under the top bar; a space's page with its tiles, in
// tile groups when it has several kinds; an address for each space; the spaces
// a person may not open left out; the search in the top bar finding tiles in
// every space; the bar on a phone held upright and sideways; and how the bar
// sits next to an app's own navigation.
import type { ComponentProps, ReactNode } from 'react';
import {
  Arrow,
  Bell,
  Callout,
  Chevron,
  Cursor,
  FocusRing,
  GroupTitle,
  Input,
  Line,
  Marker,
  Pointer,
  SearchField,
  SearchIcon,
  Sketch,
  Tile,
  Word,
} from './kit';

type TileProps = Partial<ComponentProps<typeof Tile>>;

/** the spaces of the drawings, in their order: the daily work first, the platform's settings last. */
const SPACES = ['apps', 'manage', 'settings'];
/** five spaces, the most a bar holds, each one word of eight letters at most. */
const FIVE = ['apps', 'reports', 'manage', 'people', 'settings'];
/** the width of a letter in the kit's smallest words: 8.5 units of a monospace face, 0.6 of its size. */
const CH = 5.1;
const NAME_W = [34, 26, 40, 30, 22, 36];

const r2 = (v: number) => Math.round(v * 100) / 100;

/* ---- the parts ---------------------------------------------------------------- */

/**
 * the portal's top bar: the product's name led by the chevron, an app's name when
 * one is open, the search (a field, or an icon on a phone), the bell and the avatar.
 */
function TopBar({
  x,
  y,
  w,
  h = 18,
  search = 'field',
  query,
  field = 96,
  app,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  search?: 'field' | 'icon';
  query?: string;
  /** the search field's width. */
  field?: number;
  app?: string;
}) {
  const right = x + w;
  const mid = y + h / 2;
  return (
    <g>
      <rect className="sk-bar" x={x} y={y} width={w} height={h} />
      <line className="sk-rule" x1={x} x2={right} y1={y + h} y2={y + h} />
      <Chevron x={x + 8} y={r2(mid - 3.5)} s={7} />
      <Line x={x + 19} y={r2(mid - 2)} w={30} strong />
      {app ? (
        <g>
          <Word x={x + 55} y={r2(mid + 3)} size="xs" tone="dim">
            /
          </Word>
          <Word x={x + 63} y={r2(mid + 3)} size="xs" tone="strong">
            {app}
          </Word>
        </g>
      ) : null}
      {search === 'field' ? <SearchField x={right - 44 - field} y={r2(mid - 5.5)} w={field} h={11} text={query} /> : null}
      {search === 'field' && query ? <FocusRing x={right - 44 - field} y={r2(mid - 5.5)} w={field} h={11} /> : null}
      {search === 'icon' ? <SearchIcon x={right - 50} y={r2(mid - 3.5)} /> : null}
      <Bell x={right - 34} y={r2(mid - 4.5)} />
      <rect className="sk-avatar" x={right - 18} y={r2(mid - 5.5)} width={11} height={11} />
    </g>
  );
}

/**
 * the bar of spaces: the spaces as words, with a thin line under the bar; the
 * current one brighter, with a blue line under it. `start` is where the first
 * name begins, in line with the page's title and tiles. with `share`, each space
 * gets an equal part of the width, as on a phone held upright.
 */
function SpacesBar({
  x,
  y,
  w,
  h = 16,
  spaces = SPACES,
  current,
  share,
  start,
  pad = 8,
  colour = true,
  line = true,
  faded,
  focus,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  spaces?: string[];
  current?: number;
  share?: boolean;
  start?: number;
  /** the room on each side of a name. */
  pad?: number;
  /** false: as someone sees it who can't tell the blue from the grey. */
  colour?: boolean;
  /** false: the current space is marked by its blue alone, without the line. */
  line?: boolean;
  /** a space drawn faded, with a lock: one the person may not open. */
  faded?: number;
  /** the space that has the keyboard focus. */
  focus?: number;
}) {
  const each = w / spaces.length;
  let at = (start ?? x + 12) - pad;
  return (
    <g>
      <line className="sk-rule" x1={x} x2={x + w} y1={y + h} y2={y + h} />
      {spaces.map((s, i) => {
        const tw = s.length * CH;
        const lw = share ? Math.min(tw + 2 * pad, each - 2) : tw + 2 * pad;
        const lx = share ? x + i * each + (each - lw) / 2 : at;
        at += lw;
        const on = i === current;
        const tone = on ? (line ? 'strong' : colour ? 'accent' : undefined) : undefined;
        return (
          <g key={`${s}-${i}`} className={i === faded ? 'sk-faded' : undefined}>
            <Word x={r2(share ? lx + lw / 2 : lx + pad)} y={r2(y + h / 2 + 3)} size="xs" tone={tone} anchor={share ? 'middle' : undefined}>
              {s}
            </Word>
            {on && line ? (
              <rect className={colour ? 'sk-fill-info' : 'sk-text sk-text--strong'} x={r2(lx)} y={y + h - 2} width={r2(lw)} height={2} />
            ) : null}
            {i === focus ? <rect className="sk-focus" x={r2(lx + 1)} y={y + 1.5} width={r2(lw - 2)} height={h - 3} /> : null}
            {i === faded ? <Lock x={r2(lx + pad + tw + 5)} y={r2(y + h / 2 - 3.5)} /> : null}
          </g>
        );
      })}
    </g>
  );
}

/** a small padlock: a space someone may not open, shown anyway. */
function Lock({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect className="sk-icon" x={x} y={y + 3} width={6} height={4.5} />
      <path className="sk-icon" d={`M${x + 1.2} ${y + 3} V${y + 1.6} C${x + 1.2} ${y - 0.6} ${x + 4.8} ${y - 0.6} ${x + 4.8} ${y + 1.6} V${y + 3}`} />
    </g>
  );
}

/** a space's title, the page's main heading: its name, led by the chevron. */
function Title({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <g>
      <Chevron x={x} y={r2(y - 8)} s={7} />
      <Word x={x + 12} y={y} size="md" tone="strong">
        {children}
      </Word>
    </g>
  );
}

/** tiles in a grid of the given columns. */
function Grid({
  x,
  y,
  n,
  cols,
  w,
  h,
  gap = 6,
  props = {},
}: {
  x: number;
  y: number;
  n: number;
  cols: number;
  w: number;
  h: number;
  gap?: number;
  props?: Record<number, TileProps>;
}) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <Tile
          key={i}
          x={r2(x + (i % cols) * (w + gap))}
          y={r2(y + Math.floor(i / cols) * (h + gap))}
          w={w}
          h={h}
          nameW={NAME_W[i % NAME_W.length]}
          {...props[i]}
        />
      ))}
    </g>
  );
}

/** a tile drawn small, for a home page seen from afar. */
function MiniTile({ x, y, w = 30, h = 18 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <rect className="sk-card" x={x} y={y} width={w} height={h} />
      <rect className="sk-icon sk-icon--accent" x={x + 4} y={y + 4} width={5} height={5} />
      <Line x={x + 4} y={y + h - 7} w={w - 10} />
    </g>
  );
}

/** a row of small tiles. */
function MiniRow({ x, y, n, w = 30, h = 18, gap = 4 }: { x: number; y: number; n: number; w?: number; h?: number; gap?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <MiniTile key={i} x={r2(x + i * (w + gap))} y={y} w={w} h={h} />
      ))}
    </g>
  );
}

/**
 * a home page in spaces, on a computer or on a phone held upright (`phone`): the
 * screen, the top bar, and the bar of spaces under it unless `bar` is false. the
 * page's content comes as children, drawn first.
 */
function Home({
  x,
  y,
  w,
  h,
  spaces = SPACES,
  current,
  bar = true,
  query,
  field = 70,
  topH = 16,
  barH = 16,
  phone,
  pad,
  faded,
  focus,
  clip,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  spaces?: string[];
  current?: number;
  bar?: boolean;
  query?: string;
  field?: number;
  topH?: number;
  barH?: number;
  phone?: boolean;
  pad?: number;
  faded?: number;
  focus?: number;
  /** an id: the page is cut at the screen's edge. */
  clip?: string;
  children?: ReactNode;
}) {
  return (
    <g>
      <rect className="sk-screen" x={x} y={y} width={w} height={h} />
      {clip ? (
        <defs>
          <clipPath id={clip}>
            <rect x={x} y={y} width={w} height={h} />
          </clipPath>
        </defs>
      ) : null}
      <g clipPath={clip ? `url(#${clip})` : undefined}>{children}</g>
      <TopBar x={x} y={y} w={w} h={topH} search={phone ? 'icon' : 'field'} query={query} field={field} />
      {bar ? (
        <SpacesBar x={x} y={y + topH} w={w} h={barH} spaces={spaces} current={current} share={phone} start={x + 12} pad={pad} faded={faded} focus={focus} />
      ) : null}
    </g>
  );
}

/** a caption over a drawing's part, in the body face. */
function Label({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <Word x={x} y={y} size="xs" tone="dim" mono={false}>
      {children}
    </Word>
  );
}

/* ---- the home page in spaces ------------------------------------------------------- */

export function SpacesOverview() {
  return (
    <Sketch
      w={480}
      h={208}
      label="A home page in three spaces on a computer. Under the top bar, with the product's name, the search, the bell and the avatar, a bar across the whole width lists the spaces as words: apps, manage and settings. Apps is the current space, brighter than the others, with a blue line under it. Under the bar come the space's title, apps, and its tiles; one of them is a number tile showing 3 in amber."
    >
      <Home x={1} y={1} w={478} h={206} current={0} field={120} topH={18} barH={18}>
        <Title x={13} y={60}>
          apps
        </Title>
        <Grid x={13} y={72} n={6} cols={4} w={108} h={58} gap={8} props={{ 1: { icon: false, figure: '3', figureTone: 'warn', nameW: 40 } }} />
      </Home>
    </Sketch>
  );
}

export function SpacesAnatomy() {
  const x = 40;
  const y = 16;
  return (
    <Sketch
      w={480}
      h={134}
      label="The top of a home page in spaces, close up: 1 the top bar, as on every screen; 2 the bar of spaces, under it, across the whole width; 3 a space, apps, its name a link; 4 the current space, manage, brighter, with a blue line under it; 5 the space's page, with its title, manage, and its tiles."
    >
      <Home x={x} y={y} w={400} h={117} current={1} field={110} topH={18} barH={18} clip="sp-anatomy">
        <Title x={x + 12} y={y + 58}>
          manage
        </Title>
        <Grid x={x + 12} y={y + 70} n={4} cols={4} w={88} h={44} gap={8} />
      </Home>
      <Callout x={20} y={y + 9} n={1} />
      <Pointer x1={26} y1={y + 9} x2={x} y2={y + 9} />
      <Callout x={20} y={y + 27} n={3} />
      <Pointer x1={26} y1={y + 27} x2={x + 10} y2={y + 27} />
      <Callout x={460} y={y + 27} n={2} />
      <Pointer x1={454} y1={y + 27} x2={x + 400} y2={y + 27} />
      <Callout x={168} y={y + 48} n={4} />
      <Pointer x1={162} y1={y + 46} x2={x + 90} y2={y + 36} />
      <Callout x={460} y={y + 92} n={5} />
      <Pointer x1={454} y1={y + 92} x2={x + 400} y2={y + 92} />
    </Sketch>
  );
}

/* ---- what a space is ------------------------------------------------------------------ */

export function OneKindOrSeveral() {
  return (
    <Sketch
      w={480}
      h={200}
      label="Two spaces of the same home page. On the left, apps, whose tiles are all of one kind: six tiles under its title, with no group titles. On the right, settings, whose tiles are of two kinds: under its title, a group called platform with three tiles and a group called diagnostics with two."
    >
      <Label x={1} y={9}>
        One kind of tiles
      </Label>
      <Home x={1} y={16} w={234} h={182} current={0}>
        <Title x={13} y={68}>
          apps
        </Title>
        <Grid x={13} y={78} n={6} cols={3} w={66} h={44} gap={6} />
      </Home>
      <Label x={245} y={9}>
        Several kinds, in groups
      </Label>
      <Home x={245} y={16} w={234} h={182} current={2}>
        <Title x={257} y={68}>
          settings
        </Title>
        <GroupTitle x={257} y={88}>
          platform
        </GroupTitle>
        <Grid x={257} y={93} n={3} cols={3} w={66} h={36} gap={6} />
        <GroupTitle x={257} y={146}>
          diagnostics
        </GroupTitle>
        <Grid x={257} y={151} n={2} cols={3} w={66} h={36} gap={6} />
      </Home>
    </Sketch>
  );
}

/* ---- the spaces: an addon joins one ------------------------------------------------------------ */

export function AddonJoinsSpaceDo() {
  return (
    <Sketch w={240} h={150} label="The manage space, with a new addon's tile, downloads, outlined in blue at the end of its tiles. The bar still lists apps, manage and settings.">
      <Home x={1} y={1} w={238} h={148} current={1} field={64}>
        <Title x={13} y={53}>
          manage
        </Title>
        <Grid x={13} y={62} n={4} cols={3} w={68} h={36} gap={6} props={{ 3: { name: 'downloads', fresh: true, desc: 1 } }} />
      </Home>
    </Sketch>
  );
}

export function AddonOwnSpaceDont() {
  return (
    <Sketch w={240} h={150} label="The bar lists a fourth space, downloads, named after an addon. It is the current space, and holds the addon's one tile.">
      <Home x={1} y={1} w={238} h={148} current={3} spaces={[...SPACES, 'downloads']} field={64}>
        <Title x={13} y={53}>
          downloads
        </Title>
        <Grid x={13} y={62} n={1} cols={3} w={68} h={36} gap={6} props={{ 0: { name: 'downloads', fresh: true } }} />
      </Home>
    </Sketch>
  );
}

/* ---- the bar: the current space ------------------------------------------------------------------ */

/** the bar shown twice: in colour, and as someone sees it who can't tell the blue from the grey. */
function TwoWays({ line, label }: { line: boolean; label: string }) {
  return (
    <Sketch w={240} h={100} label={label}>
      <Label x={8} y={11}>
        In colour
      </Label>
      <rect className="sk-screen" x={8} y={16} width={224} height={22} />
      <SpacesBar x={8} y={16} w={224} h={22} current={1} line={line} start={20} />
      <Label x={8} y={61}>
        Without colour
      </Label>
      <rect className="sk-screen" x={8} y={66} width={224} height={22} />
      <SpacesBar x={8} y={66} w={224} h={22} current={1} line={line} colour={false} start={20} />
    </Sketch>
  );
}

export function CurrentLineDo() {
  return (
    <TwoWays
      line
      label="The same bar of spaces twice. In colour, manage is brighter than apps and settings, with a blue line under it. Without colour, the line is grey, but it still shows that manage is the current space."
    />
  );
}

export function ColourOnlyDont() {
  return (
    <TwoWays
      line={false}
      label="The same bar of spaces twice. In colour, manage is marked by its blue alone. Without colour, all three names are the same grey, and nothing shows which space is current."
    />
  );
}

/* ---- an address for each space -------------------------------------------------------------------- */

/** a small browser window: the address, then the home page in spaces. */
function Browser({ x, address, current, cursor }: { x: number; address: string; current: number; cursor?: boolean }) {
  const y = 6;
  const w = 140;
  return (
    <g>
      <rect className="sk-side" x={x} y={y} width={w} height={18} />
      <Input x={x + 5} y={y + 4} w={w - 10} h={10} />
      <Word x={x + 10} y={y + 11.6} size="xs" tone="strong">
        {address}
      </Word>
      <Home x={x} y={y + 18} w={w} h={118} current={current} field={34} topH={14} barH={16} pad={6}>
        <Title x={x + 10} y={y + 70}>
          {SPACES[current]}
        </Title>
        <MiniRow x={x + 10} y={y + 80} n={3} w={38} h={22} gap={4} />
        <MiniRow x={x + 10} y={y + 106} n={2} w={38} h={22} gap={4} />
      </Home>
      {cursor ? <Cursor x={x + 64} y={y + 44} /> : null}
    </g>
  );
}

export function AddressPerSpace() {
  return (
    <Sketch
      w={480}
      h={146}
      label="Three browser windows in a row. In the first, the home page's own address opens apps, the first space, and the pointer presses manage. In the second, the address ends in manage, and manage is the current space. After a reload, in the third, the address still ends in manage, and manage is still current."
    >
      <Browser x={1} address="…/" current={0} cursor />
      <Arrow x1={145} y1={84} x2={166} y2={84} />
      <Browser x={170} address="…/manage" current={1} />
      <Arrow x1={314} y1={84} x2={335} y2={84} />
      <Word x={325} y={76} size="xs" tone="dim" anchor="middle" mono={false}>
        reload
      </Word>
      <Browser x={339} address="…/manage" current={1} />
    </Sketch>
  );
}

/* ---- hidden spaces, and no bar for one ------------------------------------------------------------- */

function Person({ x, label, spaces }: { x: number; label: string; spaces: string[] }) {
  const y = 16;
  const bar = spaces.length > 1;
  const top = y + 14 + (bar ? 16 : 0);
  return (
    <g>
      <Label x={x} y={9}>
        {label}
      </Label>
      <Home x={x} y={y} w={150} h={124} spaces={spaces} current={0} bar={bar} field={40} topH={14} barH={16} pad={6}>
        <Title x={x + 10} y={top + 20}>
          apps
        </Title>
        <MiniRow x={x + 10} y={top + 30} n={3} w={40} h={24} gap={5} />
        <MiniRow x={x + 10} y={top + 59} n={2} w={40} h={24} gap={5} />
      </Home>
    </g>
  );
}

export function WhoSeesWhich() {
  return (
    <Sketch
      w={480}
      h={142}
      label="The same home page for three people, each opening on apps. Someone who may change the platform sees a bar with apps, manage and settings. Someone who looks after the content sees a bar with apps and manage. Someone who only uses the apps sees no bar: under the top bar come the title, apps, and its tiles."
    >
      <Person x={1} label="May change the platform" spaces={SPACES} />
      <Person x={165} label="Looks after the content" spaces={['apps', 'manage']} />
      <Person x={329} label="Only uses the apps" spaces={['apps']} />
    </Sketch>
  );
}

export function HiddenDo() {
  return (
    <Sketch w={240} h={120} label="A bar with the two spaces this person may open, apps and manage. Apps is current.">
      <Home x={1} y={1} w={238} h={118} spaces={['apps', 'manage']} current={0} field={64}>
        <Title x={13} y={53}>
          apps
        </Title>
        <Grid x={13} y={62} n={3} cols={3} w={68} h={40} gap={6} />
      </Home>
    </Sketch>
  );
}

export function FadedDont() {
  return (
    <Sketch w={240} h={120} label="A bar with apps, manage and settings, where settings is faded, with a padlock beside it: a space this person may not open.">
      <Home x={1} y={1} w={238} h={118} current={0} faded={2} field={64}>
        <Title x={13} y={53}>
          apps
        </Title>
        <Grid x={13} y={62} n={3} cols={3} w={68} h={40} gap={6} />
      </Home>
    </Sketch>
  );
}

/* ---- the search finds tiles in every space ---------------------------------------------------------- */

/** the page while the search holds “log”: the matching tiles of every space, under the spaces' names. */
function Results({ x, y, w = 96 }: { x: number; y: number; w?: number }) {
  return (
    <g>
      <GroupTitle x={x} y={y}>
        manage
      </GroupTitle>
      <Tile x={x} y={y + 6} w={w} h={40} name="catalog" />
      <GroupTitle x={x} y={y + 64}>
        settings
      </GroupTitle>
      <Tile x={x} y={y + 70} w={w} h={40} name="logs" />
    </g>
  );
}

export function SearchAcrossSpaces() {
  return (
    <Sketch
      w={480}
      h={194}
      label="Before and while typing log in the search in the top bar. Before: the manage space is current, with its title and tiles, catalog among them. While typing: no space in the bar is current, and the page shows the matching tiles of every space under the spaces' names: catalog under manage, and logs under settings. Apps has nothing that matches, so it steps aside."
    >
      <Label x={1} y={9}>
        In the manage space
      </Label>
      <Home x={1} y={16} w={226} h={176} current={1} field={80}>
        <Title x={13} y={68}>
          manage
        </Title>
        <Grid x={13} y={78} n={4} cols={2} w={96} h={40} gap={8} props={{ 0: { name: 'catalog' } }} />
      </Home>
      <Arrow x1={233} y1={104} x2={247} y2={104} />
      <Label x={253} y={9}>
        Typing “log”
      </Label>
      <Home x={253} y={16} w={226} h={176} field={80} query="log">
        <Results x={265} y={64} />
      </Home>
    </Sketch>
  );
}

export function SearchEverySpaceDo() {
  return (
    <Sketch w={240} h={170} label="While the search holds log, no space is current, and the page shows catalog under manage and logs under settings.">
      <Home x={1} y={1} w={238} h={168} field={70} query="log">
        <Results x={13} y={48} w={110} />
      </Home>
    </Sketch>
  );
}

export function SearchOneSpaceDont() {
  return (
    <Sketch w={240} h={170} label="While the search holds log, manage stays current, and the page shows only catalog, the one match in manage. Logs, in settings, isn't found.">
      <Home x={1} y={1} w={238} h={168} current={1} field={70} query="log">
        <Title x={13} y={53}>
          manage
        </Title>
        <Tile x={13} y={62} w={110} h={40} name="catalog" />
      </Home>
    </Sketch>
  );
}

/* ---- up to five, so a phone fits them ------------------------------------------------------------- */

/** the top of a phone held upright: its bar, the bar of spaces, the start of the page. */
function PhoneTop({ spaces, share = true, children, label, clipId }: { spaces: string[]; share?: boolean; children?: ReactNode; label: string; clipId: string }) {
  // as wide as a name of eight letters needs, to keep the room a phone of 390 pixels leaves beside it.
  const x = 8;
  const w = 255;
  return (
    <Sketch w={290} h={120} label={label}>
      <rect className="sk-screen" x={x} y={4} width={w} height={130} />
      <defs>
        <clipPath id={clipId}>
          <rect x={x} y={4} width={w} height={130} />
        </clipPath>
      </defs>
      <TopBar x={x} y={4} w={w} h={20} search="icon" />
      <g clipPath={`url(#${clipId})`}>
        <SpacesBar x={x} y={24} w={w} h={22} spaces={spaces} current={0} share={share} start={x + 8} pad={share ? 6 : 8} />
      </g>
      <Title x={x + 8} y={66}>
        apps
      </Title>
      <Tile x={x + 8} y={76} w={w - 16} h={40} nameW={40} />
      {children}
    </Sketch>
  );
}

export function FiveFitDo() {
  return (
    <PhoneTop
      spaces={FIVE}
      clipId="sp-five"
      label="The top of a phone held upright. Under its bar, five spaces, apps, reports, manage, people and settings, share the width, each name whole; apps is current."
    />
  );
}

export function SixScrollDont() {
  return (
    <PhoneTop
      spaces={[...FIVE, 'monitoring']}
      share={false}
      clipId="sp-six"
      label="The top of a phone held upright with six spaces, the last one a long name, monitoring. The row runs past the right edge under a fade, and arrows beside it say it scrolls sideways."
    >
      <rect className="sk-fade" x={239} y={25} width={24} height={20} />
      <Word x={277} y={38} size="xs" tone="dim" anchor="middle">
        ← →
      </Word>
    </PhoneTop>
  );
}

/* ---- on a phone ------------------------------------------------------------------------------------ */

export function PhoneUprightAndSideways() {
  const sx = 174;
  const sy = 92;
  const sw = 300;
  const sh = 142;
  return (
    <Sketch
      w={480}
      h={322}
      label="The same home page on a phone held upright and held sideways, with apps current. Upright: the bar with the search as an icon, then the bar of spaces, the three names sharing the width, and the tiles in one column. Sideways: the same two bars, the spaces at their own width from the left, and the tiles in three columns."
    >
      <Label x={8} y={9}>
        Held upright
      </Label>
      <Home x={8} y={16} w={150} h={302} current={0} phone topH={20} barH={22} pad={4} clip="sp-upright">
        <Title x={16} y={80}>
          apps
        </Title>
        <Grid x={16} y={90} n={5} cols={1} w={134} h={46} gap={8} />
      </Home>
      <Label x={sx} y={sy - 7}>
        Held sideways
      </Label>
      <rect className="sk-screen" x={sx} y={sy} width={sw} height={sh} />
      <defs>
        <clipPath id="sp-sideways">
          <rect x={sx} y={sy} width={sw} height={sh} />
        </clipPath>
      </defs>
      <g clipPath="url(#sp-sideways)">
        <Title x={sx + 14} y={sy + 58}>
          apps
        </Title>
        <Grid x={sx + 14} y={sy + 68} n={6} cols={3} w={86} h={44} gap={8} />
      </g>
      <TopBar x={sx} y={sy} w={sw} h={18} search="icon" />
      <SpacesBar x={sx} y={sy + 18} w={sw} h={20} current={0} start={sx + 14} />
    </Sketch>
  );
}

/** an icon for a space in the tab bar that shouldn't be: a grid, a wrench, a gear. */
function SpaceIcon({ kind, x, y, s = 10, current }: { kind: 'apps' | 'manage' | 'settings'; x: number; y: number; s?: number; current?: boolean }) {
  const cls = current ? 'sk-icon sk-icon--accent' : 'sk-icon';
  const p = (fx: number, fy: number) => `${r2(x + fx * s)} ${r2(y + fy * s)}`;
  if (kind === 'apps') {
    const q = s * 0.42;
    return (
      <g className={cls}>
        <rect x={x} y={y} width={r2(q)} height={r2(q)} />
        <rect x={r2(x + s - q)} y={y} width={r2(q)} height={r2(q)} />
        <rect x={x} y={r2(y + s - q)} width={r2(q)} height={r2(q)} />
        <rect x={r2(x + s - q)} y={r2(y + s - q)} width={r2(q)} height={r2(q)} />
      </g>
    );
  }
  if (kind === 'manage') {
    return <path className={cls} d={`M${p(0.08, 0.92)} L${p(0.52, 0.48)} M${p(0.52, 0.48)} C${p(0.38, 0.2)} ${p(0.62, -0.02)} ${p(0.86, 0.1)} L${p(0.7, 0.3)} L${p(0.76, 0.36)} L${p(0.92, 0.16)} C${p(1.02, 0.42)} ${p(0.8, 0.64)} ${p(0.52, 0.48)}`} />;
  }
  const cx = x + s / 2;
  const cy = y + s / 2;
  const pts: string[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    for (const [da, rr] of [
      [-0.27, 0.36],
      [-0.16, 0.5],
      [0.16, 0.5],
      [0.27, 0.36],
    ]) {
      pts.push(`${r2(cx + rr * s * Math.cos(a + da))} ${r2(cy + rr * s * Math.sin(a + da))}`);
    }
  }
  return (
    <g className={cls}>
      <path d={`M${pts.join(' L')} Z`} />
      <circle cx={r2(cx)} cy={r2(cy)} r={r2(0.15 * s)} />
    </g>
  );
}

/** a phone held upright, with the home page's first space. */
function PhoneFrame({ children, label, bar = true }: { children?: ReactNode; label: string; bar?: boolean }) {
  const x = 25;
  return (
    <Sketch w={200} h={310} label={label}>
      <Home x={x} y={4} w={150} h={302} current={0} phone topH={20} barH={22} pad={4} bar={bar}>
        <Title x={x + 8} y={bar ? 68 : 46}>
          apps
        </Title>
        <Grid x={x + 8} y={bar ? 78 : 56} n={4} cols={1} w={134} h={40} gap={8} />
      </Home>
      {children}
    </Sketch>
  );
}

export function WordsAtTheTopDo() {
  return (
    <PhoneFrame label="A phone held upright: under its bar, the bar of spaces in words, apps, manage and settings, sharing the width; apps current. Then the title, apps, and its tiles." />
  );
}

export function IconTabsDont() {
  const x = 25;
  const y = 282;
  const w = 150;
  const each = w / 3;
  const kinds = ['apps', 'manage', 'settings'] as const;
  return (
    <PhoneFrame
      bar={false}
      label="A phone held upright with the spaces as a tab bar of icons at the foot: a grid, a wrench and a gear. The grid is blue, with a bar on its top edge."
    >
      <rect className="sk-bar" x={x} y={y} width={w} height={24} />
      <line className="sk-rule" x1={x} x2={x + w} y1={y} y2={y} />
      {kinds.map((k, i) => (
        <g key={k}>
          {i === 0 ? <rect className="sk-fill-info" x={r2(x + each * i + 6)} y={y} width={r2(each - 12)} height={2} /> : null}
          <SpaceIcon kind={k} x={r2(x + each * i + each / 2 - 5)} y={y + 8} current={i === 0} />
        </g>
      ))}
    </PhoneFrame>
  );
}

/* ---- a part of the shell ----------------------------------------------------------------------------- */

export function HomeAndApp() {
  const ax = 253;
  const ay = 16;
  return (
    <Sketch
      w={480}
      h={180}
      label="On the left, the home page with the manage space current, and the pointer on its catalog tile. An arrow leads to the right: the catalog app, opened from that tile. Its top bar shows the product's name and catalog; under it, the app's own views run down the left side, and there is no bar of spaces."
    >
      <Label x={1} y={9}>
        The home page
      </Label>
      <Home x={1} y={ay} w={226} h={162} current={1} field={80}>
        <Title x={13} y={68}>
          manage
        </Title>
        <Grid x={13} y={78} n={3} cols={2} w={96} h={40} gap={8} props={{ 0: { name: 'catalog', state: 'hover' } }} />
      </Home>
      <Cursor x={70} y={98} />
      <Arrow x1={233} y1={98} x2={247} y2={98} />
      <Label x={ax} y={9}>
        An app, opened from its tile
      </Label>
      <rect className="sk-screen" x={ax} y={ay} width={226} height={162} />
      <TopBar x={ax} y={ay} w={226} h={16} field={60} app="catalog" />
      <rect className="sk-side" x={ax} y={ay + 16} width={62} height={146} />
      {[0, 1, 2, 3, 4].map((i) => {
        const iy = ay + 28 + i * 14 + (i > 2 ? 10 : 0);
        return (
          <g key={i}>
            {i === 0 ? <rect className="sk-current" x={ax + 1} y={iy - 3} width={60} height={11} /> : null}
            {i === 0 ? <Marker x={ax + 1} y={iy - 3} h={11} /> : null}
            <rect className="sk-icon" x={ax + 8} y={iy} width={5} height={5} />
            <Line x={ax + 17} y={iy + 0.5} w={[32, 26, 30, 24, 28][i]} strong={i === 0} />
          </g>
        );
      })}
      <Line x={ax + 74} y={ay + 30} w={70} strong />
      {[42, 62, 82, 102, 122].map((dy) => (
        <rect key={dy} className="sk-card" x={ax + 74} y={ay + dy} width={140} height={14} />
      ))}
    </Sketch>
  );
}

/* ---- the keyboard ------------------------------------------------------------------------------------- */

export function KeysThroughTheBar() {
  const x = 60;
  const y = 8;
  return (
    <Sketch
      w={480}
      h={140}
      label="The order Tab takes on a home page in spaces: after the top bar, 1 apps, 2 manage, which has the focus here, 3 settings, then 4 the tiles, which are one stop together. Between two tiles, an arrow to the right shows that the arrow keys move from tile to tile."
    >
      <Home x={x} y={y} w={360} h={128} current={0} focus={1} field={100} topH={18} barH={18} clip="sp-keys">
        <Title x={x + 12} y={y + 68}>
          apps
        </Title>
        <Grid x={x + 12} y={y + 80} n={3} cols={3} w={90} h={44} gap={24} />
      </Home>
      <Callout x={x + 22} y={y + 46} n={1} />
      <Callout x={x + 64} y={y + 46} n={2} />
      <Callout x={x + 115} y={y + 46} n={3} />
      <Callout x={40} y={y + 102} n={4} />
      <Pointer x1={46} y1={y + 102} x2={x + 10} y2={y + 102} />
      <Arrow x1={x + 105} y1={y + 102} x2={x + 123} y2={y + 102} />
      <Word x={x + 114} y={y + 96} size="xs" tone="dim" anchor="middle">
        →
      </Word>
    </Sketch>
  );
}

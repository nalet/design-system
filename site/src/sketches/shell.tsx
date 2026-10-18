// storyboard drawings for the top bar: one bar across the top of every
// screen, with the product's name, the app's name, the one search,
// notifications and one user menu.
import type { ReactNode } from 'react';
import {
  Arrow,
  Bell,
  Callout,
  Chevron,
  Chip,
  FocusRing,
  GroupTitle,
  LabelButton,
  Line,
  Pointer,
  SearchField,
  SearchIcon,
  Sketch,
  Tile,
  Word,
} from './kit';

/** the avatar: a square with the person's initials. */
function Avatar({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect className="sk-avatar" x={x} y={y} width={16} height={14} />
      <Word x={x + 8} y={y + 10} size="xs" tone="strong" anchor="middle">
        au
      </Word>
    </g>
  );
}

/**
 * the top bar, w wide, with its top edge at y. its search is a field on a
 * wide screen and an icon on a phone; `query` is what someone typed into it.
 */
function Bar({
  x = 1,
  y = 1,
  w = 318,
  app = 'downloads',
  search = 'field',
  query,
  count = '2',
}: {
  x?: number;
  y?: number;
  w?: number;
  app?: string;
  search?: 'field' | 'icon' | false;
  query?: string;
  count?: string;
}) {
  const right = x + w;
  return (
    <g>
      <rect className="sk-bar" x={x} y={y} width={w} height={22} />
      <line className="sk-rule" x1={x} x2={right} y1={y + 22} y2={y + 22} />
      <Chevron x={x + 8} y={y + 7.5} s={7} />
      <Line x={x + 20} y={y + 9} w={34} strong />
      {app ? (
        <g>
          <Word x={x + 60} y={y + 14.5} size="xs" tone="dim">
            /
          </Word>
          <Word x={x + 68} y={y + 14.5} size="xs" tone="strong">
            {app}
          </Word>
        </g>
      ) : null}
      {search === 'field' ? <SearchField x={right - 152} y={y + 5} w={90} text={query} /> : null}
      {search === 'field' && query ? <FocusRing x={right - 152} y={y + 5} w={90} h={12} /> : null}
      {search === 'icon' ? <SearchIcon x={right - 72} y={y + 7.5} /> : null}
      <Bell x={right - 54} y={y + 6} />
      {count ? <Chip x={right - 42} y={y + 6} text={count} tone="info" /> : null}
      <Avatar x={right - 22} y={y + 4} />
    </g>
  );
}

export function TopBarOverview() {
  return (
    <Sketch h={150} label="An app inside the shell, under the top bar: the chevron and the product's name, a slash and the app's name, downloads; on the right the search field, a bell with 2 unread, and a square with the initials au.">
      <rect className="sk-screen" x={1} y={1} width={318} height={148} />
      <Bar />
      <rect className="sk-side" x={1} y={24} width={80} height={125} />
      {[36, 48, 60, 72, 92, 104].map((y, i) => (
        <g key={y}>
          <rect className="sk-icon" x={10} y={y} width={6} height={6} />
          <Line x={22} y={y + 1} w={[40, 32, 36, 28, 34, 30][i]} />
        </g>
      ))}
      <Line x={96} y={38} w={90} strong />
      {[52, 74, 96, 118].map((y) => (
        <rect key={y} className="sk-card" x={96} y={y} width={208} height={16} />
      ))}
    </Sketch>
  );
}

export function TopBarAnatomy() {
  return (
    <Sketch h={84} label="The top bar, close up: 1 the product's name, led by the chevron; 2 the app's name; 3 the search; 4 notifications, with 2 unread; 5 the user menu.">
      <Bar x={8} y={28} w={304} />
      <Callout x={36} y={12} n={1} />
      <Pointer x1={36} y1={18} x2={36} y2={34} />
      <Callout x={90} y={12} n={2} />
      <Pointer x1={90} y1={18} x2={90} y2={36} />
      <Callout x={205} y={70} n={3} />
      <Pointer x1={205} y1={64} x2={205} y2={46} />
      <Callout x={268} y={70} n={4} />
      <Pointer x1={268} y1={64} x2={268} y2={44} />
      <Callout x={298} y={70} n={5} />
      <Pointer x1={298} y1={64} x2={298} y2={47} />
    </Sketch>
  );
}

export function UserMenuOpen() {
  const items = ['account', 'settings', 'help'];
  return (
    <Sketch h={156} label="The user menu, open below the avatar: at the top, the person's name and email address; then account, settings and help; and, set apart at the bottom, sign out.">
      <rect className="sk-screen" x={1} y={1} width={318} height={154} />
      <Bar app="" search={false} count="" />
      <rect className="sk-sheet" x={176} y={26} width={138} height={122} />
      <Line x={186} y={36} w={70} strong />
      <Line x={186} y={45} w={100} />
      <line className="sk-rule" x1={176} x2={314} y1={55} y2={55} />
      {items.map((t, i) => (
        <g key={t}>
          <rect className="sk-icon" x={186} y={63 + i * 18} width={7} height={7} />
          <Word x={200} y={70 + i * 18} size="xs" tone="strong">
            {t}
          </Word>
        </g>
      ))}
      <line className="sk-rule" x1={176} x2={314} y1={118} y2={118} />
      <rect className="sk-icon" x={186} y={128} width={7} height={7} />
      <Word x={200} y={135} size="xs" tone="strong">
        sign out
      </Word>
    </Sketch>
  );
}

/* ---- search ----------------------------------------------------------------- */

/** a phone and its top bar: the search folded into an icon, or, once pressed, a field across the bar. */
function Phone({ x, open }: { x: number; open?: boolean }) {
  const y = 66;
  const w = 96;
  return (
    <g>
      <rect className="sk-screen" x={x} y={y} width={w} height={82} />
      <rect className="sk-bar" x={x} y={y} width={w} height={20} />
      <line className="sk-rule" x1={x} x2={x + w} y1={y + 20} y2={y + 20} />
      {open ? (
        <g>
          <SearchField x={x + 6} y={y + 4} w={w - 12} h={12} text="down" />
          <FocusRing x={x + 6} y={y + 4} w={w - 12} h={12} />
        </g>
      ) : (
        <g>
          <Chevron x={x + 7} y={y + 6.5} s={7} />
          <Line x={x + 18} y={y + 8} w={24} strong />
          <SearchIcon x={x + w - 46} y={y + 6.5} />
          <Bell x={x + w - 32} y={y + 5.5} />
          <rect className="sk-avatar" x={x + w - 17} y={y + 4} width={12} height={12} />
        </g>
      )}
      {[30, 46, 62].map((dy) => (
        <rect key={dy} className="sk-card" x={x + 6} y={y + dy} width={w - 12} height={12} />
      ))}
    </g>
  );
}

export function SearchInTheBar() {
  return (
    <Sketch h={152} label="The same search on two kinds of screen. On a wide screen, it is a field in the top bar, between the app's name and the bell. On a phone, the bar has room for an icon only; pressing it opens a field across the whole bar, here with down typed into it.">
      <Word x={2} y={9} size="xs" tone="dim" mono={false}>
        On a wide screen
      </Word>
      <Bar y={15} />
      <Word x={2} y={60} size="xs" tone="dim" mono={false}>
        On a phone
      </Word>
      <Phone x={40} />
      <Arrow x1={142} y1={76} x2={178} y2={76} />
      <Phone x={184} open />
    </Sketch>
  );
}

/** a small screen whose top bar has down typed into its search. */
function Typing({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  const w = 152;
  return (
    <g>
      <rect className="sk-screen" x={x} y={y} width={w} height={120} />
      {children}
      <rect className="sk-bar" x={x} y={y} width={w} height={16} />
      <line className="sk-rule" x1={x} x2={x + w} y1={y + 16} y2={y + 16} />
      <Chevron x={x + 7} y={y + 4.5} />
      <Line x={x + 19} y={y + 6.5} w={26} strong />
      <SearchField x={x + 54} y={y + 3.5} w={64} h={9} text="down" />
      <FocusRing x={x + 54} y={y + 3.5} w={64} h={9} />
      <Bell x={x + 124} y={y + 3.5} />
      <rect className="sk-avatar" x={x + 138} y={y + 3.5} width={9} height={9} />
    </g>
  );
}

export function SearchTwoWays() {
  return (
    <Sketch h={138} label="The same search, in the same place, on two screens. On the home page, typing down narrows the tiles to the one that matches: downloads, in the apps group. In an app, typing down opens a short list under the field: the downloads app first, then, drawn dashed because they come later, things found inside the apps.">
      <Word x={2} y={9} size="xs" tone="dim" mono={false}>
        On the home page
      </Word>
      <Typing x={1} y={15}>
        <Chevron x={9} y={39} s={5} />
        <Word x={17} y={45} size="sm" tone="strong">
          home
        </Word>
        <GroupTitle x={8} y={63}>apps</GroupTitle>
        <Tile x={8} y={68} w={78} h={38} name="downloads" />
      </Typing>
      <Word x={168} y={9} size="xs" tone="dim" mono={false}>
        In an app
      </Word>
      <Typing x={167} y={15}>
        <rect className="sk-side" x={167} y={31} width={40} height={104} />
        {[40, 52, 64, 76].map((y, i) => (
          <g key={y}>
            <rect className="sk-icon" x={173} y={y} width={5} height={5} />
            <Line x={182} y={y + 0.5} w={[18, 14, 20, 16][i]} />
          </g>
        ))}
        {[40, 58, 76, 94, 112].map((y) => (
          <rect key={y} className="sk-card" x={213} y={y} width={96} height={12} />
        ))}
        <rect className="sk-sheet" x={221} y={32} width={92} height={66} />
        <Word x={227} y={43} size="xs" tone="dim">
          apps
        </Word>
        <rect className="sk-icon sk-icon--accent" x={227} y={48} width={6} height={6} />
        <Word x={237} y={54} size="xs" tone="strong">
          downloads
        </Word>
        <line className="sk-rule" x1={221} x2={313} y1={61} y2={61} />
        <rect className="sk-planned" x={227} y={67} width={80} height={9} />
        <rect className="sk-planned" x={227} y={81} width={80} height={9} />
      </Typing>
    </Sketch>
  );
}

/* ---- the same everywhere ------------------------------------------------------ */

export function ConsumerBar() {
  const nav = ['home', 'films', 'series'];
  return (
    <Sketch h={40} label="A top bar in a product for consumers: the product's name on the left, its own navigation, home, films and series, in the middle, and the same bell and user menu on the right.">
      <rect className="sk-bar" x={1} y={9} width={318} height={22} />
      <Chevron x={9} y={16.5} s={7} />
      <Line x={21} y={18} w={34} strong />
      {nav.map((t, i) => (
        <g key={t}>
          <Word x={96 + i * 46} y={23.5} size="xs" tone={i === 0 ? 'accent' : 'strong'}>
            {t}
          </Word>
          {i === 0 ? <rect className="sk-fill-info" x={96} y={27} width={20} height={2} /> : null}
        </g>
      ))}
      <Bell x={265} y={15} />
      <Avatar x={297} y={13} />
    </Sketch>
  );
}

export function TopBarDo() {
  return (
    <Sketch w={240} h={40} label="A top bar with the product's name, the app's name, a bell with 2 unread and a square avatar with initials.">
      <Bar x={4} y={9} w={232} search={false} />
    </Sketch>
  );
}

export function TopBarDont() {
  return (
    <Sketch w={240} h={40} label="A top bar with an email address shown as a badge, a separate sign out button, and a round avatar.">
      <rect className="sk-bar" x={4} y={9} width={232} height={22} />
      <Chevron x={11} y={16.5} s={7} />
      <Line x={23} y={18} w={34} strong />
      <rect className="sk-chip" x={90} y={14} width={62} height={12} />
      <Line x={95} y={18} w={52} />
      <LabelButton x={158} y={14.5} text="sign out" />
      <circle className="sk-avatar" cx={225} cy={20} r={7} />
    </Sketch>
  );
}

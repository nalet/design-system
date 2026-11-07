// storyboard drawings for consumer navigation: a product's few views as icons
// alone, in one rail down the left edge on a wide screen, on a phone held
// sideways and on a TV, where it shows the names once the focus moves into it,
// and in a tab bar at the foot of a phone held upright. the views' icons are
// drawn plainly, because this page is about icons people name the same way.
import type { ReactNode } from 'react';
import { Arrow, Bell, Callout, Chevron, Cursor, Line, Marker, Pointer, SearchField, SearchIcon, Sketch, Word } from './kit';

type IconKind = 'home' | 'films' | 'series' | 'watchlist' | 'downloads' | 'settings' | 'sparkle' | 'compass';

/** the product's views on a wide screen and a TV. */
const VIEWS = ['home', 'films', 'series', 'watchlist'] as const;
/** the phone's tabs: the same views, and downloads, which only a phone offers, last. */
const TABS: IconKind[] = ['home', 'films', 'series', 'watchlist', 'downloads'];

const r2 = (v: number) => Math.round(v * 100) / 100;

/* ---- the parts ---------------------------------------------------------------- */

/**
 * a view's icon on a square of side s: a house, a film strip, a television, a bookmark, an arrow into a tray, a gear;
 * and a sparkle and a compass, which people name in different ways. `bright`: under the pointer, in the brightest text colour.
 */
function ViewIcon({ kind, x, y, s = 9, current, bright }: { kind: IconKind; x: number; y: number; s?: number; current?: boolean; bright?: boolean }) {
  const p = (fx: number, fy: number) => `${r2(x + fx * s)} ${r2(y + fy * s)}`;
  const cls = current ? 'sk-icon sk-icon--accent' : 'sk-icon';
  const style = bright && !current ? { stroke: 'var(--fg)' } : undefined;
  switch (kind) {
    case 'home':
      return <path className={cls} style={style} d={`M${p(0, 0.46)} L${p(0.5, 0)} L${p(1, 0.46)} M${p(0.14, 0.33)} L${p(0.14, 1)} L${p(0.86, 1)} L${p(0.86, 0.33)} M${p(0.4, 1)} L${p(0.4, 0.64)} L${p(0.6, 0.64)} L${p(0.6, 1)}`} />;
    case 'films':
      return (
        <path
          className={cls}
          style={style}
          d={`M${p(0, 0)} L${p(1, 0)} L${p(1, 1)} L${p(0, 1)} Z M${p(0.27, 0)} L${p(0.27, 1)} M${p(0.73, 0)} L${p(0.73, 1)} M${p(0, 0.5)} L${p(1, 0.5)} M${p(0, 0.25)} L${p(0.27, 0.25)} M${p(0, 0.75)} L${p(0.27, 0.75)} M${p(0.73, 0.25)} L${p(1, 0.25)} M${p(0.73, 0.75)} L${p(1, 0.75)}`}
        />
      );
    case 'series':
      return <path className={cls} style={style} d={`M${p(0, 0.3)} L${p(1, 0.3)} L${p(1, 1)} L${p(0, 1)} Z M${p(0.28, 0)} L${p(0.5, 0.28)} L${p(0.72, 0)}`} />;
    case 'watchlist':
      return <path className={cls} style={style} d={`M${p(0.2, 0)} L${p(0.8, 0)} L${p(0.8, 1)} L${p(0.5, 0.72)} L${p(0.2, 1)} Z`} />;
    case 'downloads':
      return <path className={cls} style={style} d={`M${p(0.5, 0)} L${p(0.5, 0.66)} M${p(0.22, 0.4)} L${p(0.5, 0.68)} L${p(0.78, 0.4)} M${p(0, 0.6)} L${p(0, 1)} L${p(1, 1)} L${p(1, 0.6)}`} />;
    case 'settings': {
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
        <g className={cls} style={style}>
          <path d={`M${pts.join(' L')} Z`} />
          {s >= 7 ? <circle cx={r2(cx)} cy={r2(cy)} r={r2(0.15 * s)} /> : null}
        </g>
      );
    }
    case 'sparkle': {
      const cx = x + 0.42 * s;
      const cy = y + 0.58 * s;
      const big = 0.42 * s;
      const pinch = 0.1 * s;
      const q = (dx: number, dy: number) => `${r2(cx + dx)} ${r2(cy + dy)}`;
      return (
        <path
          className={cls}
          d={`M${q(0, -big)} L${q(pinch, -pinch)} L${q(big, 0)} L${q(pinch, pinch)} L${q(0, big)} L${q(-pinch, pinch)} L${q(-big, 0)} L${q(-pinch, -pinch)} Z M${p(0.86, 0)} L${p(0.86, 0.32)} M${p(0.7, 0.16)} L${p(1, 0.16)}`}
        />
      );
    }
    case 'compass': {
      const c = (fx: number, fy: number) => p(0.5 + fx, 0.5 + fy);
      return (
        <g className={cls}>
          <circle cx={r2(x + s / 2)} cy={r2(y + s / 2)} r={r2(s / 2)} />
          <path d={`M${c(0.22, -0.22)} L${c(0.08, 0.08)} L${c(-0.22, 0.22)} L${c(-0.08, -0.08)} Z`} />
        </g>
      );
    }
  }
}

/** the back arrow, at the start of the bar on a screen opened from a view. */
function BackArrow({ x, y, s = 8 }: { x: number; y: number; s?: number }) {
  const p = (fx: number, fy: number) => `${r2(x + fx * s)} ${r2(y + fy * s)}`;
  return <path className="sk-icon" d={`M${p(1, 0.5)} L${p(0.04, 0.5)} M${p(0.44, 0.1)} L${p(0.04, 0.5)} L${p(0.44, 0.9)}`} />;
}

/** the avatar: a square with the person's initials, or a plain square where it is small. */
function Avatar({ x, y, s = 12 }: { x: number; y: number; s?: number }) {
  return (
    <g>
      <rect className="sk-avatar" x={x} y={y} width={s} height={s} />
      {s >= 12 ? (
        <Word x={x + s / 2} y={y + s / 2 + 3} size="xs" tone="strong" anchor="middle">
          au
        </Word>
      ) : null}
    </g>
  );
}

/** the kit's bell, drawn at a size of k (1 is the bar's own size). */
function SmallBell({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <Bell x={0} y={0} />
    </g>
  );
}

/** the tab bar: one icon per view, each an equal share of the width; the current one blue, with a bar on its top edge. */
function TabBar({
  x,
  y,
  w,
  h = 22,
  tabs = TABS,
  current,
  s = 9,
  mark = true,
  colour = true,
  share,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  tabs?: IconKind[];
  current?: number;
  s?: number;
  /** the bar on the current tab's top edge. */
  mark?: boolean;
  /** false: as someone sees it who can't tell the blue from the grey. */
  colour?: boolean;
  /** each tab's width, when the tabs don't share the bar's width. */
  share?: number;
}) {
  const each = share ?? w / tabs.length;
  return (
    <g>
      <rect className="sk-bar" x={x} y={y} width={w} height={h} />
      <line className="sk-rule" x1={x} x2={x + w} y1={y} y2={y} />
      {tabs.map((t, i) => {
        const on = i === current;
        return (
          <g key={`${t}-${i}`}>
            {on && mark ? (
              <rect className={colour ? 'sk-fill-info' : 'sk-text sk-text--strong'} x={r2(x + each * i + 2)} y={y} width={r2(each - 4)} height={2} />
            ) : null}
            <ViewIcon kind={t} x={r2(x + each * i + (each - s) / 2)} y={r2(y + (h - s) / 2 + 1)} s={s} current={on && colour} />
          </g>
        );
      })}
    </g>
  );
}

/** the rail held sideways: the same tabs down the left edge, the current one blue with a bar on its edge. */
function SideRail({ x, y, w, h, current, s = 9, top = 8 }: { x: number; y: number; w: number; h: number; current?: number; s?: number; top?: number }) {
  const step = (h - top * 2 - s) / (TABS.length - 1);
  return (
    <g>
      <rect className="sk-side" x={x} y={y} width={w} height={h} />
      {TABS.map((t, i) => {
        const iy = y + top + i * step;
        return (
          <g key={t}>
            {i === current ? <Marker x={x + 1} y={r2(iy - 3)} h={s + 6} /> : null}
            <ViewIcon kind={t} x={r2(x + (w - s) / 2)} y={r2(iy)} s={s} current={i === current} />
          </g>
        );
      })}
    </g>
  );
}

/**
 * the rail on a wide screen, under the bar: the views as icons alone, each in a square, and settings at the foot.
 * drawn to the rail's own proportions, k units a pixel: squares of 48 in a rail 80 wide, 8 apart, 16 from the bar
 * and from the foot, icons of 24 (or `icon`, where a small drawing needs them larger). the current view is blue on
 * a lighter square, with a bar on its left edge; `hover` rests the pointer on a view, whose square lightens and whose
 * icon brightens. `colour={false}`: as someone sees it who can't tell the blue from the grey.
 */
function WideRail({
  x,
  y,
  h,
  k,
  current,
  hover,
  icon,
  bar = 2,
  colour = true,
}: {
  x: number;
  y: number;
  h: number;
  k: number;
  current?: number | 'settings';
  hover?: number;
  icon?: number;
  bar?: number;
  colour?: boolean;
}) {
  const w = 80 * k;
  const sq = 48 * k;
  const s = icon ?? 24 * k;
  const step = 56 * k;
  const top = 16 * k;
  const sx = x + (w - sq) / 2;
  const item = (kind: IconKind, iy: number, on: boolean, under: boolean) => (
    <g key={kind}>
      {on || under ? <rect className="sk-card--hover" x={r2(sx)} y={r2(iy)} width={r2(sq)} height={r2(sq)} /> : null}
      {on ? <rect className={colour ? 'sk-fill-info' : 'sk-text sk-text--strong'} x={r2(sx)} y={r2(iy)} width={bar} height={r2(sq)} /> : null}
      <ViewIcon kind={kind} x={r2(sx + (sq - s) / 2)} y={r2(iy + (sq - s) / 2)} s={r2(s)} current={on && colour} bright={under} />
    </g>
  );
  return (
    <g>
      <rect className="sk-side" x={x} y={y} width={r2(w)} height={r2(h)} />
      {VIEWS.map((v, i) => item(v, y + top + i * step, current === i, hover === i))}
      {item('settings', y + h - top - sq, current === 'settings', false)}
    </g>
  );
}

/** the product's mark: the chevron and the first letter of the product's name, the letter drawn as a short bar, centred on (cx, cy). */
function Mark({ cx, cy, s = 7 }: { cx: number; cy: number; s?: number }) {
  const lw = s * 0.75;
  const gap = s * 0.3;
  const x0 = cx - (s / 2 + gap + lw) / 2;
  return (
    <g>
      <Chevron x={r2(x0)} y={r2(cy - s / 2)} s={s} />
      <rect className="sk-text sk-text--strong" x={r2(x0 + s / 2 + gap)} y={r2(cy - s * 0.3)} width={r2(lw)} height={r2(s * 0.6)} />
    </g>
  );
}

/**
 * a wide screen's top bar over the rail: the product's mark in the first cell, as wide as the rail, then, at the
 * end, the search field just before the bell, and the avatar, where the shell puts them.
 */
function RailBar({
  x,
  y,
  w,
  h,
  rail,
  field,
  fieldH,
  mark = 7,
  bell = 1,
  avatar = 12,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  rail: number;
  field: number;
  fieldH?: number;
  mark?: number;
  bell?: number;
  avatar?: number;
}) {
  const right = x + w;
  const ax = right - 6 - avatar;
  const bx = ax - 6 - 10 * bell;
  const fx = bx - 8 - field;
  const fh = fieldH ?? Math.min(12, h - 5);
  return (
    <g>
      <rect className="sk-bar" x={x} y={y} width={w} height={h} />
      <line className="sk-rule" x1={x} x2={right} y1={y + h} y2={y + h} />
      <line className="sk-rule" x1={x + rail} x2={x + rail} y1={y} y2={y + h} />
      <Mark cx={r2(x + rail / 2)} cy={r2(y + h / 2)} s={mark} />
      <SearchField x={r2(fx)} y={r2(y + (h - fh) / 2)} w={field} h={fh} />
      <SmallBell x={r2(bx)} y={r2(y + (h - 9 * bell) / 2)} k={bell} />
      <Avatar x={r2(ax)} y={r2(y + (h - avatar) / 2)} s={avatar} />
    </g>
  );
}

/** the views as words in a wide top bar, after the name; the current one brighter, with a blue line under it. */
function ViewWords({ x, y, current, gap = 12, barBottom }: { x: number; y: number; current?: number; gap?: number; barBottom: number }) {
  let at = x;
  return (
    <g>
      {VIEWS.map((v, i) => {
        const vx = at;
        const w = v.length * 5.1;
        at += w + gap;
        return (
          <g key={v}>
            <Word x={vx} y={y} size="xs" tone={i === current ? 'strong' : undefined}>
              {v}
            </Word>
            {i === current ? <rect className="sk-fill-info" x={vx} y={barBottom - 2} width={r2(w)} height={2} /> : null}
          </g>
        );
      })}
    </g>
  );
}

/** posters in a row: the page of a product for watching films. `fresh` outlines one in blue: the one people were looking at. */
function Posters({ x, y, n, w = 16, gap = 5, fresh }: { x: number; y: number; n: number; w?: number; gap?: number; fresh?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} className={i === fresh ? 'sk-card sk-card--new' : 'sk-card'} x={r2(x + i * (w + gap))} y={y} width={w} height={r2(w * 1.5)} />
      ))}
    </g>
  );
}

/* ---- the overview ---------------------------------------------------------------- */

function TinyWide({ x, y }: { x: number; y: number }) {
  const w = 128;
  const h = 82;
  const bar = 11;
  const rail = 14;
  const page = x + rail + 5;
  return (
    <g>
      <rect className="sk-screen" x={x} y={y} width={w} height={h} />
      <rect className="sk-box" x={page} y={y + bar + 5} width={x + w - 5 - page} height={22} />
      <Line x={page} y={y + bar + 32} w={22} strong />
      <Posters x={page} y={y + bar + 40} n={5} w={14} gap={r2((x + w - 5 - page - 70) / 4)} />
      <RailBar x={x} y={y} w={w} h={bar} rail={rail} field={28} fieldH={6} mark={4.4} bell={0.6} avatar={7} />
      <WideRail x={x} y={y + bar} h={h - bar} k={rail / 80} current={1} icon={4.6} bar={1.2} />
    </g>
  );
}

function TinyPhone({ x, y }: { x: number; y: number }) {
  const w = 56;
  const h = 120;
  return (
    <g>
      <rect className="sk-screen" x={x} y={y} width={w} height={h} />
      <rect className="sk-bar" x={x} y={y} width={w} height={12} />
      <line className="sk-rule" x1={x} x2={x + w} y1={y + 12} y2={y + 12} />
      <Chevron x={x + 4} y={y + 3.5} s={5} />
      <Line x={x + 10} y={y + 4} w={12} strong />
      <SearchIcon x={x + 30} y={y + 3.5} s={3.6} />
      <SmallBell x={x + 37} y={y + 3} k={0.6} />
      <Avatar x={x + 46} y={y + 2.5} s={7} />
      <rect className="sk-box" x={x + 4} y={y + 16} width={w - 8} height={26} />
      <Line x={x + 4} y={y + 46} w={20} strong />
      <Posters x={x + 4} y={y + 53} n={3} w={14} gap={3} />
      <Posters x={x + 4} y={y + 78} n={3} w={14} gap={3} />
      <TabBar x={x} y={y + h - 13} w={w} h={13} current={1} s={5.4} />
    </g>
  );
}

function TinySideways({ x, y }: { x: number; y: number }) {
  const w = 112;
  const h = 52;
  return (
    <g>
      <rect className="sk-screen" x={x} y={y} width={w} height={h} />
      <SideRail x={x} y={y} w={13} h={h} current={1} s={5} top={5} />
      <rect className="sk-bar" x={x + 13} y={y} width={w - 13} height={9} />
      <line className="sk-rule" x1={x + 13} x2={x + w} y1={y + 9} y2={y + 9} />
      <Chevron x={x + 17} y={y + 2.5} s={4} />
      <Line x={x + 23} y={y + 2.5} w={12} strong />
      <SearchIcon x={x + 79} y={y + 2.6} s={3.4} />
      <SmallBell x={x + 88} y={y + 1.9} k={0.6} />
      <Avatar x={x + 100} y={y + 1.8} s={5.5} />
      <Line x={x + 18} y={y + 14} w={20} strong />
      <Posters x={x + 18} y={y + 21} n={6} w={12} gap={3} />
    </g>
  );
}

export function ConsumerNavOverview() {
  return (
    <Sketch
      w={480}
      h={140}
      label="One product for watching films on four screens, with films as the current view. On a wide screen, the views are a rail of icons down the left edge, under the product's mark in the top bar's first cell, films blue on a lighter square with a bar on its edge, and a gear at the rail's foot; the bar holds the search, the bell and the avatar. On a phone held upright, the views are a tab bar of five icons at the foot, films blue with a bar on its edge. Held sideways, the same icons run down the left edge as a rail. On a TV, a rail down the left edge holds the avatar, the search, the views, the bell and settings, inside a dashed safe area."
    >
      <Word x={1} y={9} size="xs" tone="dim" mono={false}>
        On a wide screen
      </Word>
      <TinyWide x={1} y={16} />
      <Word x={141} y={9} size="xs" tone="dim" mono={false}>
        On a phone
      </Word>
      <TinyPhone x={141} y={16} />
      <Word x={209} y={9} size="xs" tone="dim" mono={false}>
        Held sideways
      </Word>
      <TinySideways x={209} y={16} />
      <Word x={333} y={9} size="xs" tone="dim" mono={false}>
        On a TV
      </Word>
      <Tv x={333} y={16} w={146} />
    </Sketch>
  );
}

/* ---- when it applies ---------------------------------------------------------------- */

export function TwoKinds() {
  const groups = [
    { y: 40, items: 3 },
    { y: 84, items: 2 },
    { y: 116, items: 2 },
  ];
  return (
    <Sketch
      w={480}
      h={170}
      label="Two screens under the same top bar, with the search, the bell and the avatar in the same places. On the left, an app inside the portal: its name, downloads, after the product's name, and its views listed down the left side with their names, in three groups, the first one current. On the right, a product for consumers: the product's mark in the bar's first cell, over a rail of four icons, home, films, series and watchlist, with films current, blue on a lighter square with a bar on its edge, and a gear at the rail's foot; the page with its posters takes the rest of the width."
    >
      <Word x={1} y={9} size="xs" tone="dim" mono={false}>
        An app inside the portal
      </Word>
      <rect className="sk-screen" x={1} y={16} width={234} height={152} />
      <rect className="sk-bar" x={1} y={16} width={234} height={16} />
      <line className="sk-rule" x1={1} x2={235} y1={32} y2={32} />
      <Chevron x={8} y={20.5} s={7} />
      <Line x={19} y={22} w={26} strong />
      <Word x={51} y={27.5} size="xs" tone="dim">
        /
      </Word>
      <Word x={58} y={27.5} size="xs" tone="strong">
        downloads
      </Word>
      <SearchField x={146} y={19.5} w={50} h={9} />
      <SmallBell x={202} y={19.5} k={0.85} />
      <Avatar x={218} y={18} />
      <rect className="sk-side" x={1} y={32} width={62} height={136} />
      {groups.map((g, gi) => (
        <g key={g.y}>
          <Line x={8} y={g.y} w={18} />
          {Array.from({ length: g.items }, (_, i) => {
            const iy = g.y + 9 + i * 11;
            const current = gi === 0 && i === 0;
            return (
              <g key={i}>
                {current ? <rect className="sk-current" x={2} y={iy - 3} width={60} height={10} /> : null}
                {current ? <Marker x={2} y={iy - 3} h={10} /> : null}
                <rect className="sk-icon" x={8} y={iy} width={4.5} height={4.5} />
                <Line x={16} y={iy + 0.5} w={[30, 24, 28, 22, 26, 20, 24][gi * 2 + i] ?? 24} strong={current} />
              </g>
            );
          })}
        </g>
      ))}
      {[42, 66, 90, 114, 138].map((y) => (
        <rect key={y} className="sk-card" x={72} y={y} width={154} height={16} />
      ))}

      <Word x={245} y={9} size="xs" tone="dim" mono={false}>
        A product for consumers
      </Word>
      <rect className="sk-screen" x={245} y={16} width={234} height={152} />
      <rect className="sk-box" x={276} y={40} width={194} height={50} />
      <Line x={276} y={98} w={46} strong />
      <Posters x={276} y={108} n={8} w={20} gap={4.86} />
      <RailBar x={245} y={16} w={234} h={16} rail={22} field={50} fieldH={9} mark={7} bell={0.85} avatar={12} />
      <WideRail x={245} y={32} h={136} k={22 / 80} current={1} />
    </Sketch>
  );
}

/* ---- on a wide screen ---------------------------------------------------------------- */

export function WideAnatomy() {
  // a screen of 1280 × 800, drawn at 0.3 units a pixel: the rail 80 wide, its squares 48, its icons 24.
  const k = 0.3;
  const x = 56;
  const y = 26;
  const w = 1280 * k;
  const h = 800 * k;
  const bar = 17;
  const rail = 80 * k;
  const page = x + rail + 8;
  const pw = x + w - 8 - page;
  // where the rail puts its items: 16 under the bar, then one every 56.
  const at = (i: number) => y + bar + 16 * k + i * 56 * k;
  const sq = 48 * k;
  const sqx = x + (rail - sq) / 2;
  const tipX = 69;
  const tipY = r2(at(3) + 8);
  return (
    <Sketch
      w={480}
      h={272}
      label="A wide screen, close up, with films as the current view: 1 the product's mark, the chevron and the first letter of its name, in the top bar's first cell, over the rail and as wide as it; 2 the rail down the left edge, the views as icons alone, a house, a film strip, a television and a bookmark; 3 films, the current view, blue on a lighter square with a blue bar on its left edge; 4 the pointer resting on watchlist, whose square lightens while the browser shows its name, watchlist, in a small box under the pointer; 5 settings, a gear, at the rail's foot; 6 the search, the bell and the avatar at the end of the bar, as the shell has them. The page takes the rest, beside the rail and under the bar."
    >
      <rect className="sk-screen" x={x} y={y} width={w} height={h} />
      <rect className="sk-box" x={page} y={y + bar + 8} width={r2(pw)} height={78} />
      <Line x={page} y={y + bar + 94} w={60} strong />
      <Posters x={page} y={y + bar + 104} n={9} w={30} gap={r2((pw - 270) / 8)} />
      <Line x={page} y={y + bar + 159} w={50} strong />
      <Posters x={page} y={y + bar + 169} n={9} w={30} gap={r2((pw - 270) / 8)} />
      <RailBar x={x} y={y} w={w} h={bar} rail={rail} field={116} mark={7} bell={1} avatar={12} />
      <WideRail x={x} y={y + bar} h={h - bar} k={k} current={1} hover={3} />
      <Cursor x={tipX} y={tipY} />
      <rect className="sk-sheet" x={tipX + 3} y={r2(tipY + 12)} width={54} height={11} />
      <Word x={tipX + 7} y={r2(tipY + 20)} size="xs" tone="strong">
        watchlist
      </Word>
      <Callout x={x + rail / 2} y={12} n={1} />
      <Pointer x1={x + rail / 2} y1={18} x2={x + rail / 2} y2={y + 4} />
      <Callout x={34} y={r2(at(0) + sq / 2)} n={2} />
      <Pointer x1={40} y1={r2(at(0) + sq / 2)} x2={r2(sqx)} y2={r2(at(0) + sq / 2)} />
      <Callout x={34} y={r2(at(1) + sq / 2)} n={3} />
      <Pointer x1={40} y1={r2(at(1) + sq / 2)} x2={r2(sqx)} y2={r2(at(1) + sq / 2)} />
      <Callout x={34} y={r2(tipY + 17.5)} n={4} />
      <Pointer x1={40} y1={r2(tipY + 17.5)} x2={tipX + 3} y2={r2(tipY + 17.5)} />
      <Callout x={34} y={r2(y + h - 16 * k - sq / 2)} n={5} />
      <Pointer x1={40} y1={r2(y + h - 16 * k - sq / 2)} x2={r2(sqx)} y2={r2(y + h - 16 * k - sq / 2)} />
      <Callout x={411} y={12} n={6} />
      <Pointer x1={411} y1={18} x2={411} y2={y + 4} />
    </Sketch>
  );
}

/** a wide screen, small, with films as the current view: its views in the rail, or as words in the bar. */
function SmallWide({ rail, label }: { rail: boolean; label: string }) {
  const x = 10;
  const y = 5;
  const w = 280;
  const h = 140;
  const bar = 14;
  const railW = 22;
  const page = rail ? x + railW + 8 : x + 8;
  const pw = x + w - 8 - page;
  const n = rail ? 8 : 9;
  const gap = 6;
  const each = r2((pw - (n - 1) * gap) / n);
  const right = x + w;
  return (
    <Sketch w={300} h={150} label={label}>
      <rect className="sk-screen" x={x} y={y} width={w} height={h} />
      <rect className="sk-box" x={page} y={y + bar + 7} width={r2(pw)} height={46} />
      <Line x={page} y={y + bar + 61} w={40} strong />
      <Posters x={page} y={y + bar + 71} n={n} w={each} gap={gap} />
      {rail ? (
        <g>
          <RailBar x={x} y={y} w={w} h={bar} rail={railW} field={84} fieldH={9} mark={6} bell={0.8} avatar={10} />
          <WideRail x={x} y={y + bar} h={h - bar} k={railW / 80} current={1} />
        </g>
      ) : (
        <g>
          <rect className="sk-bar" x={x} y={y} width={w} height={bar} />
          <line className="sk-rule" x1={x} x2={right} y1={y + bar} y2={y + bar} />
          <Chevron x={x + 7} y={y + 3.5} s={7} />
          <Line x={x + 17} y={y + 5} w={26} strong />
          <ViewWords x={x + 52} y={y + 10} current={1} gap={8} barBottom={y + bar} />
          <SearchIcon x={right - 46} y={y + 4} s={5.4} />
          <SmallBell x={right - 30} y={y + 3.4} k={0.8} />
          <Avatar x={right - 16} y={y + 2} s={10} />
        </g>
      )}
    </Sketch>
  );
}

export function RailDo() {
  return (
    <SmallWide
      rail
      label="A wide screen with the views as icons in a rail down the left edge, films current, blue on a lighter square with a bar on its edge, and a gear at the rail's foot. The bar holds the product's mark over the rail, then the search field, the bell and the avatar at its end."
    />
  );
}

export function WordsInBarDont() {
  return (
    <SmallWide
      rail={false}
      label="The same screen with the views as words in the bar, home, films, series and watchlist, films underlined in blue, and no rail. The words fill the bar, and the search has folded into an icon beside the bell."
    />
  );
}

/* ---- on a phone held upright -------------------------------------------------------------- */

/** a phone held upright: the bar, or a back arrow and a screen's name; the page; the tab bar at the foot. */
function PhoneUpright({
  x,
  y,
  w = 120,
  h = 244,
  current,
  back,
  tabs = true,
  children,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  current?: number;
  /** the name of a screen opened from a view: the bar shows a back arrow and it. */
  back?: string;
  tabs?: boolean;
  children: ReactNode;
}) {
  return (
    <g>
      <rect className="sk-screen" x={x} y={y} width={w} height={h} />
      {children}
      <rect className="sk-bar" x={x} y={y} width={w} height={20} />
      <line className="sk-rule" x1={x} x2={x + w} y1={y + 20} y2={y + 20} />
      {back ? (
        <g>
          <BackArrow x={x + 8} y={y + 6} />
          <Word x={x + 22} y={y + 13} size="xs" tone="strong">
            {back}
          </Word>
        </g>
      ) : (
        <g>
          <Chevron x={x + 8} y={y + 6.5} s={7} />
          <Line x={x + 19} y={y + 8} w={28} strong />
          <SearchIcon x={x + w - 49} y={y + 6.5} s={6} />
          <Bell x={x + w - 35} y={y + 5.5} />
          <Avatar x={x + w - 19} y={y + 4} />
        </g>
      )}
      {tabs ? <TabBar x={x} y={y + h - 24} w={w} h={24} current={current} s={10} /> : null}
    </g>
  );
}

/** the page of a view: a picture across the top, then rows of posters under their titles. */
function ViewPage({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g>
      <rect className="sk-box" x={x + 8} y={y + 28} width={w - 16} height={58} />
      <Line x={x + 8} y={y + 94} w={44} strong />
      <Posters x={x + 8} y={y + 104} n={3} w={30} gap={7} />
      <Line x={x + 8} y={y + 158} w={36} strong />
      <Posters x={x + 8} y={y + 168} n={3} w={30} gap={7} />
    </g>
  );
}

export function PhoneAnatomy() {
  const x = 100;
  const y = 4;
  return (
    <Sketch
      w={320}
      h={252}
      label="A phone held upright: 1 the bar, with the product's name, the search as an icon, the bell and the avatar; 2 the tab bar at the foot, five icons alone, a house, a film strip, a television, a bookmark and an arrow into a tray; 3 the current tab, films, blue, with a blue bar on its top edge."
    >
      <PhoneUpright x={x} y={y} current={1}>
        <ViewPage x={x} y={y} w={120} />
      </PhoneUpright>
      <Callout x={76} y={14} n={1} />
      <Pointer x1={82} y1={14} x2={x + 6} y2={14} />
      <Callout x={76} y={236} n={2} />
      <Pointer x1={82} y1={236} x2={x + 6} y2={236} />
      <Callout x={250} y={214} n={3} />
      <Pointer x1={244} y1={214} x2={x + 38} y2={y + 221} />
    </Sketch>
  );
}

/* ---- icons alone ---------------------------------------------------------------- */

/** a strip of tabs with what people call each icon written under it. */
function NamedStrip({ tabs, said, label }: { tabs: IconKind[]; said: string[][]; label: string }) {
  const x = 10;
  const w = 280;
  const each = w / tabs.length;
  return (
    <Sketch w={300} h={84} label={label}>
      <TabBar x={x} y={8} w={w} h={28} tabs={tabs} s={12} />
      {said.map((words, i) =>
        words.map((word, j) => (
          <Word key={`${i}-${j}`} x={r2(x + each * i + each / 2)} y={54 + j * 11} size="xs" tone={word.endsWith('?') ? 'warn' : 'dim'} anchor="middle">
            {word}
          </Word>
        )),
      )}
    </Sketch>
  );
}

export function PlainIconsDo() {
  return (
    <NamedStrip
      tabs={TABS}
      said={[['home'], ['films'], ['series'], ['watchlist'], ['downloads']]}
      label="Five tabs, icons alone: a house, a film strip, a television, a bookmark and an arrow into a tray. Under each, the word people use for it: home, films, series, watchlist, downloads."
    />
  );
}

export function UnclearIconsDont() {
  return (
    <NamedStrip
      tabs={['home', 'films', 'sparkle', 'compass', 'downloads']}
      said={[['home'], ['films'], ['new?', 'for you?'], ['discover?', 'a map?'], ['downloads']]}
      label="Five tabs, icons alone, two of them a sparkle and a compass. Under the sparkle, people guess new or for you; under the compass, discover or a map."
    />
  );
}

/* ---- the tab bar: how many, and the current tab ---------------------------------- */

/** the lower part of a phone held upright: posters, then the tab bar. */
function PhoneFoot({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Sketch w={200} h={132} label={label}>
      <rect className="sk-screen" x={40} y={1} width={120} height={130} />
      <Line x={48} y={10} w={40} strong />
      <Posters x={48} y={20} n={3} w={30} gap={7} />
      <Line x={48} y={74} w={34} strong />
      <Posters x={48} y={84} n={3} w={30} gap={7} />
      {children}
    </Sketch>
  );
}

export function FiveTabsDo() {
  return (
    <PhoneFoot label="The foot of a phone: a tab bar with five icons alone, each an equal share of the width, films current in blue with a bar on its top edge.">
      <TabBar x={40} y={107} w={120} h={24} current={1} s={10} />
    </PhoneFoot>
  );
}

export function SixTabsDont() {
  const tabs: IconKind[] = ['home', 'films', 'series', 'watchlist', 'downloads', 'settings', 'compass'];
  return (
    <PhoneFoot label="The foot of a phone: a tab bar with settings as a sixth tab and a seventh cut off at the edge, under a fade; arrows beside it say the row scrolls sideways.">
      <defs>
        <clipPath id="cn-six-tabs">
          <rect x={40} y={106} width={120} height={25} />
        </clipPath>
      </defs>
      <g clipPath="url(#cn-six-tabs)">
        <TabBar x={40} y={107} w={130} h={24} tabs={tabs} current={1} s={9} share={18.5} />
      </g>
      <rect className="sk-fade" x={142} y={108} width={18} height={23} />
      <Word x={180} y={122} size="xs" tone="dim" anchor="middle">
        ← →
      </Word>
    </PhoneFoot>
  );
}

/** a tab bar shown twice: in colour, and as someone sees it who can't tell the blue from the grey. */
function TwoWays({ mark, label }: { mark: boolean; label: string }) {
  return (
    <Sketch w={200} h={108} label={label}>
      <Word x={40} y={11} size="xs" tone="dim" mono={false}>
        In colour
      </Word>
      <TabBar x={40} y={17} w={120} h={24} current={1} s={10} mark={mark} />
      <Word x={40} y={65} size="xs" tone="dim" mono={false}>
        Without colour
      </Word>
      <TabBar x={40} y={71} w={120} h={24} current={1} s={10} mark={mark} colour={false} />
    </Sketch>
  );
}

export function CurrentBarDo() {
  return (
    <TwoWays
      mark
      label="The same tab bar twice. In colour, films is blue with a bar on its top edge. Without colour, films is grey like the others, but its bar still shows that it is the current tab."
    />
  );
}

export function ColourOnlyDont() {
  return (
    <TwoWays
      mark={false}
      label="The same tab bar twice. In colour, films is marked by its blue alone. Without colour, every tab is the same grey, and nothing shows which one is current."
    />
  );
}

/* ---- a screen opened from a view ---------------------------------------------------- */

/** a film's page: its poster and name, the play button, a few lines about it. */
function FilmPage({ x, y, bottom }: { x: number; y: number; bottom: number }) {
  return (
    <g>
      <rect className="sk-box" x={x} y={y + 20} width={120} height={46} />
      <rect className="sk-card" x={x + 8} y={y + 52} width={30} height={45} />
      <Line x={x + 46} y={y + 74} w={60} strong />
      <Line x={x + 46} y={y + 83} w={40} />
      <rect className="sk-button sk-button--primary" x={x + 8} y={y + 106} width={44} height={12} />
      <rect className="sk-button" x={x + 56} y={y + 106} width={30} height={12} />
      {[126, 134, 142, 150, 158].map((dy, i) => (dy < bottom - y - 6 ? <Line key={dy} x={x + 8} y={y + dy} w={[100, 96, 104, 80, 92][i]} /> : null))}
      <Line x={x + 8} y={y + 172} w={40} strong />
      <Posters x={x + 8} y={y + 182} n={3} w={30} gap={7} />
    </g>
  );
}

export function OpenedKeepsTabsDo() {
  return (
    <Sketch
      w={200}
      h={252}
      label="A film's page on a phone held upright. The bar shows a back arrow and the film's name, The Quiet Harbour. The tab bar stays at the foot, with no tab current."
    >
      <PhoneUpright x={40} y={4} back="The Quiet Harbour">
        <FilmPage x={40} y={4} bottom={224} />
      </PhoneUpright>
    </Sketch>
  );
}

export function OpenedCoversTabsDont() {
  return (
    <Sketch
      w={200}
      h={252}
      label="The same film's page covering the whole screen: a back arrow and the film's name at the top, and no tab bar at the foot, so the other views are out of reach."
    >
      <PhoneUpright x={40} y={4} back="The Quiet Harbour" tabs={false}>
        <FilmPage x={40} y={4} bottom={248} />
        <Line x={48} y={234} w={70} />
      </PhoneUpright>
    </Sketch>
  );
}

/* ---- on a phone held sideways ---------------------------------------------------- */

/** a phone held sideways: the rail at the left, a slimmer bar beside it, the page under the bar. */
function PhoneSideways({ x, y, w = 240, h = 112, current, fresh }: { x: number; y: number; w?: number; h?: number; current?: number; fresh?: number }) {
  const rail = 24;
  return (
    <g>
      <rect className="sk-screen" x={x} y={y} width={w} height={h} />
      <SideRail x={x} y={y} w={rail} h={h} current={current} s={9} />
      <rect className="sk-bar" x={x + rail} y={y} width={w - rail} height={15} />
      <line className="sk-rule" x1={x + rail} x2={x + w} y1={y + 15} y2={y + 15} />
      <Chevron x={x + rail + 8} y={y + 4.5} s={6} />
      <Line x={x + rail + 18} y={y + 5.5} w={28} strong />
      <SearchIcon x={x + w - 45} y={y + 4.5} s={5.4} />
      <SmallBell x={x + w - 32} y={y + 3.4} k={0.85} />
      <Avatar x={x + w - 17} y={y + 2.5} s={10} />
      <Line x={x + rail + 8} y={y + 22} w={44} strong />
      <Posters x={x + rail + 8} y={y + 32} n={8} w={20} gap={6} fresh={fresh} />
      {h >= 112 ? (
        <g>
          <Line x={x + rail + 8} y={y + 70} w={36} strong />
          <Posters x={x + rail + 8} y={y + 80} n={8} w={20} gap={6} />
        </g>
      ) : (
        <Line x={x + rail + 8} y={y + 70} w={36} strong />
      )}
    </g>
  );
}

export function SidewaysAnatomy() {
  const x = 52;
  const y = 22;
  return (
    <Sketch
      w={320}
      h={142}
      label="A phone held sideways: 1 the same five tabs as a rail down the left edge, icons alone; 2 the current tab, films, blue, with a bar on its left edge; 3 a slimmer bar above the page, with the product's name, the search icon, the bell and the avatar; 4 the page, with the whole height under the bar."
    >
      <PhoneSideways x={x} y={y} current={1} />
      <Callout x={30} y={44} n={1} />
      <Pointer x1={36} y1={44} x2={x + 7} y2={y + 12} />
      <Callout x={30} y={70} n={2} />
      <Pointer x1={36} y1={70} x2={x + 1} y2={y + 43} />
      <Callout x={130} y={10} n={3} />
      <Pointer x1={130} y1={16} x2={130} y2={y + 6} />
      <Callout x={306} y={90} n={4} />
      <Pointer x1={300} y1={90} x2={x + 232} y2={90} />
    </Sketch>
  );
}

export function Turning() {
  return (
    <Sketch
      w={400}
      h={196}
      label="The same phone before and after it is turned. Upright, films is the current tab at the foot, and one poster, outlined in blue, is at the top of the page. Turned sideways, the tabs are a rail at the left with films still current, the bar is slimmer, and the same poster is still in view."
    >
      <rect className="sk-screen" x={10} y={4} width={88} height={188} />
      <rect className="sk-bar" x={10} y={4} width={88} height={16} />
      <line className="sk-rule" x1={10} x2={98} y1={20} y2={20} />
      <Chevron x={16} y={9} s={6} />
      <Line x={25} y={10} w={22} strong />
      <SearchIcon x={60} y={9} s={4.6} />
      <SmallBell x={69} y={8} k={0.75} />
      <Avatar x={84} y={7.5} s={9} />
      <Line x={16} y={28} w={36} strong />
      <Posters x={16} y={38} n={3} w={22} gap={6} fresh={0} />
      <Line x={16} y={80} w={30} strong />
      <Posters x={16} y={90} n={3} w={22} gap={6} />
      <Line x={16} y={132} w={34} strong />
      <Posters x={16} y={142} n={3} w={22} gap={6} />
      <TabBar x={10} y={172} w={88} h={20} current={1} s={8} />
      <Arrow x1={110} y1={98} x2={140} y2={98} />
      <Word x={125} y={90} size="xs" tone="dim" anchor="middle" mono={false}>
        Turned
      </Word>
      <PhoneSideways x={150} y={56} current={1} w={240} h={84} fresh={0} />
    </Sketch>
  );
}

/* ---- on a TV ---------------------------------------------------------------- */

type TvItem = 'avatar' | 'search' | IconKind | 'bell';
const TV_TOP: TvItem[] = ['avatar', 'search', 'home', 'films', 'series', 'watchlist'];
const TV_FOOT: TvItem[] = ['bell', 'settings'];
const TV_NAMES: Record<string, string> = {
  search: 'search',
  home: 'home',
  films: 'films',
  series: 'series',
  watchlist: 'watchlist',
  bell: 'notifications',
  settings: 'settings',
};

/** a TV, 16 by 9: the rail at the left, closed or open, the page beside it, and the safe area as a dashed line. */
function Tv({
  x,
  y,
  w = 316,
  open,
  focus,
  current = 'films',
  safe = true,
  names = open,
  focusClosed,
}: {
  x: number;
  y: number;
  w?: number;
  open?: boolean;
  /** the item that has the focus, in the open rail. */
  focus?: TvItem;
  current?: TvItem;
  safe?: boolean;
  /** the names beside the icons. */
  names?: boolean;
  /** the item that has the focus, in a rail that stays closed. */
  focusClosed?: TvItem;
}) {
  // the drawing is made for a TV 316 wide; k scales every size and gap to this one.
  const k = w / 316;
  const h = (w * 9) / 16;
  const sx = w * 0.05;
  const sy = h * 0.05;
  const s = 10 * k;
  const pad = 3 * k;
  const ix = x + sx + 5 * k;
  const closedW = sx + 5 * k + s + 8 * k;
  const openW = r2(w * (k < 0.95 ? 0.46 : 0.39));
  const nameSize = k < 0.95 ? 'xs' : 'sm';
  const nameX = ix + 18 * k;
  const step = 17 * k;
  const at = (item: TvItem) => {
    const top = TV_TOP.indexOf(item);
    if (top === 0) return y + sy + k;
    if (top > 0) return y + sy + 8 * k + top * step;
    return y + h - sy - 13 * k - (TV_FOOT.length - 1 - TV_FOOT.indexOf(item)) * step;
  };
  const items = [...TV_TOP, ...TV_FOOT];
  const pageX = x + closedW + 10 * k;
  return (
    <g>
      <rect className="sk-screen" x={x} y={y} width={w} height={h} />
      <rect className="sk-box" x={r2(pageX)} y={r2(y + sy + 2 * k)} width={r2(x + w - sx - 2 * k - pageX)} height={r2(h * 0.38)} />
      <Line x={r2(pageX)} y={r2(y + sy + h * 0.38 + 10 * k)} w={r2(50 * k)} strong />
      <Posters x={r2(pageX)} y={r2(y + sy + h * 0.38 + 20 * k)} n={6} w={r2(30 * k)} gap={r2(8 * k)} />
      <rect className={open ? 'sk-sheet' : 'sk-side'} x={x} y={y} width={r2(open ? openW : closedW)} height={r2(h)} />
      {safe ? <rect className="sk-planned" x={r2(x + sx)} y={r2(y + sy)} width={r2(w - 2 * sx)} height={r2(h - 2 * sy)} /> : null}
      {items.map((item) => {
        const iy = at(item);
        const isFocus = open && item === focus;
        const isClosedFocus = !open && item === focusClosed;
        const isCurrent = item === current;
        return (
          <g key={item}>
            {isFocus ? <rect className="sk-card sk-card--hover" x={r2(x + sx)} y={r2(iy - pad)} width={r2(openW - sx - 8 * k)} height={r2(s + 2 * pad)} /> : null}
            {isFocus ? <rect className="sk-focus" x={r2(x + sx + 0.75)} y={r2(iy - pad + 0.75)} width={r2(openW - sx - 8 * k - 1.5)} height={r2(s + 2 * pad - 1.5)} /> : null}
            {isClosedFocus ? <rect className="sk-focus" x={r2(ix - pad)} y={r2(iy - pad)} width={r2(s + 2 * pad)} height={r2(s + 2 * pad)} /> : null}
            {isCurrent ? <Marker x={r2(x + sx)} y={r2(iy - pad)} h={r2(s + 2 * pad)} /> : null}
            {item === 'avatar' ? (
              <Avatar x={r2(ix - k)} y={r2(iy - k)} s={r2(12 * k)} />
            ) : item === 'search' ? (
              <SearchIcon x={r2(ix + k)} y={r2(iy + k)} s={r2(6.4 * k)} />
            ) : item === 'bell' ? (
              <SmallBell x={r2(ix)} y={r2(iy + 0.5 * k)} k={r2(k)} />
            ) : (
              <ViewIcon kind={item} x={r2(ix)} y={r2(iy)} s={r2(s)} current={isCurrent} />
            )}
            {names && item === 'avatar' ? (
              <Word x={r2(nameX)} y={r2(iy + 8 * k)} size={nameSize} tone="strong" mono={false}>
                Alex Urban
              </Word>
            ) : null}
            {names && item !== 'avatar' ? (
              <Word x={r2(nameX)} y={r2(iy + 8 * k)} size={nameSize} tone={isFocus ? 'strong' : undefined}>
                {TV_NAMES[item]}
              </Word>
            ) : null}
          </g>
        );
      })}
    </g>
  );
}

export function TvClosed() {
  const x = 22;
  const y = 4;
  return (
    <Sketch
      w={360}
      h={186}
      label="A TV with the rail closed down its left edge, icons alone: 1 the avatar at the top; 2 the search; 3 the views, home, films, series and watchlist, with films current, blue with a bar on its left edge; 4 the bell and settings at the foot; 5 the safe area, a dashed line 5% in from every edge, which everything that can take focus stays inside."
    >
      <Tv x={x} y={y} />
      <Callout x={9} y={y + 15} n={1} />
      <Pointer x1={15} y1={y + 15} x2={x + 20} y2={y + 15} />
      <Callout x={9} y={y + 40} n={2} />
      <Pointer x1={15} y1={y + 40} x2={x + 22} y2={y + 40} />
      <Callout x={9} y={y + 74} n={3} />
      <Pointer x1={15} y1={y + 74} x2={x + 16} y2={y + 74} />
      <Callout x={9} y={y + 150} n={4} />
      <Pointer x1={15} y1={y + 150} x2={x + 20} y2={y + 150} />
      <Callout x={350} y={y + 60} n={5} />
      <Pointer x1={344} y1={y + 60} x2={x + 300} y2={y + 60} />
    </Sketch>
  );
}

export function TvOpen() {
  return (
    <Sketch
      w={360}
      h={204}
      label="The same TV with the rail open over the page, the names beside the icons: Alex Urban by the avatar, then search, home, films, series, watchlist, and notifications and settings at the foot. The focus has moved down to series, which has the ring inside its edge and a lighter surface; films, the current view, keeps its blue bar. Under the TV: the up and down keys move, ok opens, right or back closes the rail."
    >
      <Tv x={22} y={4} open focus="series" />
      <Word x={180} y={198} size="xs" tone="dim" anchor="middle">
        ↑ ↓ move · ok opens · → or back closes
      </Word>
    </Sketch>
  );
}

export function TvRailOpensDo() {
  return (
    <Sketch w={240} h={140} label="A TV whose rail opens when the focus moves into it: the names show beside the icons, and series, which has the focus, has the ring.">
      <Tv x={2} y={2} w={236} open focus="series" safe={false} />
    </Sketch>
  );
}

export function TvRailNeverOpensDont() {
  return (
    <Sketch w={240} h={140} label="A TV whose rail never opens: the focus ring is on one of the icons, and nothing on the screen says what it opens.">
      <Tv x={2} y={2} w={236} focusClosed="series" safe={false} />
    </Sketch>
  );
}

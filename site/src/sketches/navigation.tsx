// storyboard drawings for app navigation: views listed down the side, grouped
// by what people do there — and where tabs fit instead.
import { Callout, Chevron, Line, Marker, Pointer, Screen, Sketch, Status, Word } from './kit';

/** the side navigation of a downloads-like app: three groups, the first view current. */
function SideList({ x = 1, y = 17, w = 104, h = 182, words = true }: { x?: number; y?: number; w?: number; h?: number; words?: boolean }) {
  const group = (gy: number, title: string, items: { w: number; count?: string; tone?: 'warn' | 'neutral'; current?: boolean }[]) => (
    <g>
      {words ? (
        <Word x={x + 10} y={gy} size="xs" tone="dim">
          {title}
        </Word>
      ) : (
        <Line x={x + 10} y={gy - 4} w={22} />
      )}
      {items.map((it, i) => {
        const iy = gy + 10 + i * 14;
        return (
          <g key={i}>
            {it.current ? <rect className="sk-current" x={x + 1} y={iy - 3} width={w - 2} height={12} /> : null}
            {it.current ? <Marker x={x + 1} y={iy - 3} h={12} /> : null}
            <rect className="sk-icon" x={x + 10} y={iy} width={6} height={6} />
            <Line x={x + 22} y={iy + 1} w={it.w} strong={it.current} />
            {it.count ? (
              <Word x={x + w - 8} y={iy + 6} size="xs" tone={it.tone === 'warn' ? 'warn' : 'dim'} anchor="end">
                {it.count}
              </Word>
            ) : null}
          </g>
        );
      })}
    </g>
  );
  return (
    <g>
      <rect className="sk-side" x={x} y={y} width={w} height={h} />
      {group(y + 16, 'work', [
        { w: 44, count: '3', tone: 'warn', current: true },
        { w: 36, count: '12' },
        { w: 40 },
        { w: 34 },
        { w: 30 },
      ])}
      {group(y + 104, 'find', [{ w: 32 }, { w: 40 }])}
      {group(y + 148, 'setup', [{ w: 44 }, { w: 30 }])}
    </g>
  );
}

export function AppWithSideNav() {
  return (
    <Sketch w={480} h={260} label="An app with its views listed down the left, grouped into work, find and setup. The first view, needs attention with 3 items, is the current one; the content fills the rest.">
      <Screen w={478} h={258} />
      <Chevron x={8} y={5} />
      <Line x={20} y={7} w={36} strong />
      <Word x={64} y={12} size="xs" tone="dim">/ downloads</Word>
      <rect className="sk-icon" x={438} y={4} width={9} height={9} />
      <rect className="sk-avatar" x={455} y={3} width={13} height={11} />
      <SideList x={1} y={17} w={120} h={240} />
      <Word x={140} y={40} size="md" tone="strong">needs attention</Word>
      <Line x={140} y={48} w={140} />
      {[64, 90, 116].map((y) => (
        <g key={y}>
          <rect className="sk-card" x={140} y={y} width={322} height={20} />
          <Line x={150} y={y + 8} w={130} strong />
          <Status x={362} y={y + 7} tone="warn" text="needs attention" />
        </g>
      ))}
    </Sketch>
  );
}

export function SideNavSmall() {
  return (
    <Sketch label="An app whose views are listed down the side in three groups, with the current view marked.">
      <Screen />
      <Chevron x={8} y={5} />
      <Line x={20} y={7} w={36} strong />
      <SideList />
      <Line x={122} y={32} w={90} strong />
      {[48, 72, 96, 120].map((y) => (
        <rect key={y} className="sk-card" x={122} y={y} width={186} height={18} />
      ))}
    </Sketch>
  );
}

export function NineTabs() {
  const tabs = ['requests', 'series', 'missing', 'downloads', 'search', 'discover', 'sources', 'clients', 'settings'];
  let x = 10;
  return (
    <Sketch label="Nine tabs in one row that mix daily work, finding things and setup; the last ones run off the edge.">
      <Screen />
      <Chevron x={8} y={5} />
      <Line x={20} y={7} w={36} strong />
      <g>
        {tabs.map((t, i) => {
          const tx = x;
          x += t.length * 6.2 + 14;
          return (
            <g key={t}>
              <Word x={tx} y={36} size="xs" tone={i === 0 ? 'accent' : 'strong'}>
                {t}
              </Word>
              {i === 0 ? <rect className="sk-fill-info" x={tx} y={40} width={t.length * 6} height={2} /> : null}
            </g>
          );
        })}
      </g>
      <rect className="sk-fade" x={270} y={18} width={49} height={30} />
      <line className="sk-rule" x1={1} x2={319} y1={46} y2={46} />
      {[58, 82, 106, 130, 154].map((y) => (
        <rect key={y} className="sk-card" x={10} y={y} width={298} height={18} />
      ))}
    </Sketch>
  );
}

export function SideNavAnatomy() {
  return (
    <Sketch w={320} h={240} label="The side navigation, close up: 1 marks a group title, 2 a view with a count, 3 the current view with the blue bar on its edge.">
      <rect className="sk-screen" x={1} y={1} width={318} height={238} />
      <SideList x={60} y={10} w={140} h={220} />
      <Callout x={30} y={26} n={1} />
      <Pointer x1={37} y1={26} x2={66} y2={24} />
      <Callout x={240} y={50} n={2} />
      <Pointer x1={233} y1={50} x2={196} y2={50} />
      <Callout x={30} y={39} n={3} />
      <Pointer x1={37} y1={40} x2={60} y2={40} />
    </Sketch>
  );
}

export function TabsForOneThing() {
  const tabs = ['overview', 'episodes', 'files', 'history'];
  let x = 16;
  return (
    <Sketch label="One item's page with four tabs — overview, episodes, files and history — that switch between parts of the same thing.">
      <Screen />
      <Chevron x={8} y={5} />
      <Line x={20} y={7} w={36} strong />
      <rect className="sk-box" x={16} y={28} width={40} height={56} />
      <Word x={66} y={44} size="md" tone="strong" mono={false}>The Quiet Harbour</Word>
      <Line x={66} y={54} w={80} />
      {tabs.map((t, i) => {
        const tx = x;
        x += t.length * 6.2 + 18;
        return (
          <g key={t}>
            <Word x={tx} y={104} size="xs" tone={i === 0 ? 'accent' : 'strong'}>
              {t}
            </Word>
            {i === 0 ? <rect className="sk-fill-info" x={tx} y={108} width={t.length * 6} height={2} /> : null}
          </g>
        );
      })}
      <line className="sk-rule" x1={1} x2={319} y1={114} y2={114} />
      <Line x={16} y={128} w={240} />
      <Line x={16} y={138} w={220} />
      <Line x={16} y={148} w={180} />
    </Sketch>
  );
}

export function PhoneMenu() {
  return (
    <Sketch w={200} h={260} label="On a phone, the app's views open as a menu from the app's title.">
      <rect className="sk-screen" x={50} y={1} width={110} height={256} />
      <rect className="sk-bar" x={50} y={1} width={110} height={20} />
      <Word x={60} y={15} size="xs" tone="strong">downloads ▾</Word>
      <rect className="sk-sheet" x={52} y={22} width={106} height={150} />
      <SideList x={52} y={22} w={106} h={150} />
      <Line x={60} y={190} w={80} />
      <Line x={60} y={200} w={60} />
    </Sketch>
  );
}

export function PhoneTabs() {
  return (
    <Sketch w={200} h={260} label="On a phone, a row of tabs runs off the screen and has to be scrolled sideways.">
      <rect className="sk-screen" x={50} y={1} width={110} height={256} />
      <rect className="sk-bar" x={50} y={1} width={110} height={20} />
      <Word x={58} y={36} size="xs" tone="accent">requests</Word>
      <rect className="sk-fill-info" x={58} y={40} width={48} height={2} />
      <Word x={114} y={36} size="xs" tone="strong">series</Word>
      <Word x={152} y={36} size="xs" tone="strong">missing</Word>
      <rect className="sk-fade" x={136} y={22} width={24} height={24} />
      <Word x={105} y={58} size="xs" tone="dim" anchor="middle">← →</Word>
      {[70, 92, 114, 136].map((y) => (
        <rect key={y} className="sk-card" x={58} y={y} width={94} height={16} />
      ))}
    </Sketch>
  );
}

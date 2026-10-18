// storyboard drawings for the worklist: a page for working through what
// needs doing, from its counted tabs down to the menu on every row.
import { EmptyPanel } from './empty';
import { ListRow } from './selection';
import { Banner, Button, Callout, Checkbox, Chevron, LabelButton, Line, Marker, Pointer, Screen, SearchField, Sketch, Word } from './kit';

/** the worklist, 300 wide, with its left edge at ox. */
function Worklist({ ox }: { ox: number }) {
  const rows = ['S04E01', 'S04E02', 'S04E03', 'S04E04'];
  return (
    <g>
      <Screen x={ox} w={300} h={236} />
      <Chevron x={ox + 7} y={5} />
      <Line x={ox + 19} y={7} w={30} strong />
      <Word x={ox + 56} y={12} size="xs" tone="dim">
        / downloads
      </Word>
      <Word x={ox + 12} y={34} size="md" tone="strong">
        missing
      </Word>
      <Line x={ox + 12} y={40} w={150} />
      <Line x={ox + 12} y={48} w={96} />
      <Word x={ox + 12} y={64} size="xs" tone="accent">
        missing
      </Word>
      <Word x={ox + 52} y={64} size="xs" tone="strong">
        2,500
      </Word>
      <rect className="sk-fill-info" x={ox + 12} y={67} width={66} height={2} />
      <Word x={ox + 92} y={64} size="xs" tone="strong">
        on their way
      </Word>
      <Word x={ox + 157} y={64} size="xs" tone="accent">
        12
      </Word>
      <Word x={ox + 180} y={64} size="xs" tone="strong">
        needs attention
      </Word>
      <Word x={ox + 260} y={64} size="xs" tone="err">
        3
      </Word>
      <line className="sk-rule" x1={ox} x2={ox + 300} y1={72} y2={72} />
      <Banner x={ox + 12} y={79} w={276} tone="warn" text={0.55} action />
      <SearchField x={ox + 12} y={101} w={100} />
      <Button x={ox + 118} y={101.5} w={36} />
      <Button x={ox + 158} y={101.5} w={36} />
      <Line x={ox + 250} y={105} w={38} />
      <rect className="sk-card" x={ox + 12} y={119} width={276} height={17} />
      <Marker x={ox + 12} y={119} h={17} />
      <Word x={ox + 20} y={130.5} size="xs" tone="accent">
        8 selected
      </Word>
      <LabelButton x={ox + 196} y={122} text="grab 8 selected" primary />
      <Checkbox x={ox + 18} y={142} state="mixed" />
      <Line x={ox + 32} y={143.5} w={30} strong />
      <Line x={ox + 196} y={143.5} w={30} strong />
      <rect className="sk-bar" x={ox + 12} y={153} width={276} height={14} />
      <Word x={ox + 32} y={163} size="xs" tone="strong" mono={false}>
        The Quiet Harbour · S04 · 8 missing
      </Word>
      {rows.map((c, i) => (
        <ListRow key={c} x={ox + 12} y={170 + i * 16} w={276} code={c} check={i < 3 ? 'on' : 'off'} selected={i < 3} titleW={60} />
      ))}
    </g>
  );
}

export function WorklistOverview() {
  return (
    <Sketch h={240} label="A worklist of missing episodes: the title missing, counted tabs (missing 2,500, on their way 12, needs attention 3 in red), one amber banner, search and filters, a toolbar with 8 selected and a blue grab 8 selected button, and the table grouped by season, with a status and a menu on every row.">
      <Worklist ox={10} />
    </Sketch>
  );
}

export function WorklistAnatomy() {
  const ox = 24;
  return (
    <Sketch w={344} h={240} label="The worklist, close up: 1 the header, 2 the counted tabs, 3 the banner, 4 search and filters, 5 the toolbar, 6 the table, grouped by season, 7 the menu on every row.">
      <Worklist ox={ox} />
      <Callout x={10} y={31} n={1} />
      <Pointer x1={16} y1={31} x2={ox + 10} y2={31} />
      <Callout x={10} y={61} n={2} />
      <Pointer x1={16} y1={61} x2={ox + 10} y2={61} />
      <Callout x={10} y={87} n={3} />
      <Pointer x1={16} y1={87} x2={ox + 12} y2={87} />
      <Callout x={10} y={107} n={4} />
      <Pointer x1={16} y1={107} x2={ox + 12} y2={107} />
      <Callout x={10} y={127} n={5} />
      <Pointer x1={16} y1={127} x2={ox + 12} y2={127} />
      <Callout x={10} y={170} n={6} />
      <Pointer x1={16} y1={170} x2={ox + 12} y2={170} />
      <Callout x={334} y={193} n={7} />
      <Pointer x1={328} y1={193} x2={ox + 284} y2={193} />
    </Sketch>
  );
}

/* ---- do and don't ------------------------------------------------------------------ */

function ListUnder({ y, n }: { y: number; n: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <g key={i}>
          <Line x={14} y={y + i * 14} w={[90, 70, 84, 64, 78][i % 5]} strong />
          <Line x={150} y={y + i * 14} w={40} />
        </g>
      ))}
    </g>
  );
}

export function OneStrip() {
  return (
    <Sketch w={240} h={140} label="A list with one amber banner above it, with a button that offers a way forward.">
      <rect className="sk-screen" x={1} y={1} width={238} height={138} />
      <Line x={12} y={12} w={70} strong />
      <Banner x={10} y={24} w={220} tone="warn" text={0.5} action />
      <ListUnder y={52} n={6} />
    </Sketch>
  );
}

export function StackedStrips() {
  return (
    <Sketch w={240} h={140} label="A list with three banners stacked above it, amber, blue and grey, pushing the list down.">
      <rect className="sk-screen" x={1} y={1} width={238} height={138} />
      <Line x={12} y={12} w={70} strong />
      <Banner x={10} y={24} w={220} tone="warn" text={0.45} />
      <Banner x={10} y={44} w={220} tone="info" text={0.6} />
      <Banner x={10} y={64} w={220} tone="neutral" text={0.5} />
      <ListUnder y={92} n={3} />
    </Sketch>
  );
}

/* ---- when there is nothing to list -------------------------------------------------- */

function EmptyWorklist({ x, done }: { x: number; done: boolean }) {
  return (
    <g>
      <Screen x={x} w={152} h={156} />
      <Chevron x={x + 7} y={5} />
      <Line x={x + 19} y={7} w={26} strong />
      <Word x={x + 8} y={32} size="sm" tone="strong">
        missing
      </Word>
      <Line x={x + 8} y={38} w={90} />
      <Word x={x + 8} y={54} size="xs" tone="accent">
        {done ? 'missing 0' : 'missing'}
      </Word>
      <rect className="sk-fill-info" x={x + 8} y={57} width={done ? 46 : 36} height={2} />
      <line className="sk-rule" x1={x} x2={x + 152} y1={61} y2={61} />
      <EmptyPanel cx={x + 76} y={72} kind={done ? 'done' : 'unknown'} title={done ? 'nothing missing' : 'nothing can be checked yet'} buttons={done ? 0 : 1} primary={!done} />
    </g>
  );
}

export function WorklistEmpty() {
  return (
    <Sketch h={160} label="Two worklists with nothing to list. Both keep their title and tabs. One says nothing missing, with a green check. The other says nothing can be checked yet, with an amber question mark and a blue button to ask again.">
      <EmptyWorklist x={1} done />
      <EmptyWorklist x={167} done={false} />
    </Sketch>
  );
}

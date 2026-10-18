// storyboard drawings for empty states: the five kinds of empty, each with
// its own small line picture, a title that says what is true, and the way on.
import type { ReactNode } from 'react';
import { Button, Callout, Chevron, Line, Pointer, Screen, SearchField, Sketch, Word } from './kit';

export type EmptyKind = 'empty' | 'done' | 'search' | 'error' | 'unknown';

/**
 * the picture of each kind, on a 40 × 30 grid: a prompt with nothing after it;
 * the prompt and a check; rows and a square lens that finds none; a line that
 * doesn't connect; a question that can't be answered yet.
 */
export function EmptyPicture({ kind, x, y, s = 1 }: { kind: EmptyKind; x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect className="sk-illus" x={0.5} y={0.5} width={39} height={29} vectorEffect="non-scaling-stroke" />
      {kind === 'empty' || kind === 'done' ? (
        <g>
          <path className="sk-illus sk-illus--accent" d="M7 10 L11 14 L7 18" vectorEffect="non-scaling-stroke" />
          {kind === 'empty' ? (
            <line className="sk-illus sk-illus--soft" x1={14} x2={20} y1={19} y2={19} vectorEffect="non-scaling-stroke" />
          ) : (
            <path className="sk-illus sk-illus--ok" d="M20 15 L24 19 L32 10" vectorEffect="non-scaling-stroke" />
          )}
        </g>
      ) : null}
      {kind === 'search' ? (
        <g>
          <line className="sk-illus sk-illus--soft" x1={6} x2={26} y1={8} y2={8} vectorEffect="non-scaling-stroke" />
          <line className="sk-illus sk-illus--soft" x1={6} x2={22} y1={14} y2={14} vectorEffect="non-scaling-stroke" />
          <line className="sk-illus sk-illus--soft" x1={6} x2={18} y1={20} y2={20} vectorEffect="non-scaling-stroke" />
          <rect className="sk-illus sk-illus--accent" x={24} y={13} width={8} height={8} vectorEffect="non-scaling-stroke" />
          <line className="sk-illus sk-illus--accent" x1={32} y1={21} x2={35} y2={24} vectorEffect="non-scaling-stroke" />
        </g>
      ) : null}
      {kind === 'error' ? (
        <g>
          <path className="sk-illus sk-illus--soft" d="M5 20 H14 V11 H18" vectorEffect="non-scaling-stroke" />
          <path className="sk-illus sk-illus--soft" d="M23 19 H27 V11 H35" vectorEffect="non-scaling-stroke" />
          <line className="sk-illus sk-illus--err" x1={19} x2={22} y1={12} y2={18} vectorEffect="non-scaling-stroke" />
        </g>
      ) : null}
      {kind === 'unknown' ? (
        <g>
          <path className="sk-illus sk-illus--warn" d="M15 9 H25 V15 H20 V19" vectorEffect="non-scaling-stroke" />
          <rect className="sk-fill-warn" x={19} y={21.5} width={2} height={2} />
        </g>
      ) : null}
    </g>
  );
}

/**
 * an empty state, centred on cx: the picture, the title, a line of
 * description, and up to three buttons, the first one emphasized when asked.
 */
export function EmptyPanel({
  cx,
  y,
  kind,
  title,
  desc = true,
  buttons = 0,
  primary = false,
  allPrimary = false,
  s = 1,
}: {
  cx: number;
  y: number;
  kind: EmptyKind;
  title: string;
  desc?: boolean;
  buttons?: number;
  primary?: boolean;
  allPrimary?: boolean;
  s?: number;
}) {
  const bw = 40;
  const total = buttons * bw + (buttons - 1) * 6;
  return (
    <g>
      <EmptyPicture kind={kind} x={cx - 20 * s} y={y} s={s} />
      <Word x={cx} y={y + 30 * s + 16} size={title.length > 20 ? 'xs' : 'sm'} tone="strong" anchor="middle">
        {title}
      </Word>
      {desc ? <Line x={cx - 50} y={y + 30 * s + 24} w={100} /> : null}
      {Array.from({ length: buttons }, (_, i) => (
        <Button key={i} x={cx - total / 2 + i * (bw + 6)} y={y + 30 * s + (desc ? 36 : 26)} w={bw} primary={allPrimary || (primary && i === 0)} />
      ))}
    </g>
  );
}

/* ---- the five kinds, one small sketch each ------------------------------------ */

const KINDS: { kind: EmptyKind; title: string; buttons: number; primary?: boolean; label: string }[] = [
  { kind: 'empty', title: 'nothing tracked yet', buttons: 1, primary: true, label: 'Empty: a prompt with nothing after it, the title nothing tracked yet, and one emphasized button to add the first item.' },
  { kind: 'done', title: 'nothing missing', buttons: 0, label: 'Done: the prompt and a green check, the title nothing missing, and no button.' },
  { kind: 'search', title: 'no matches', buttons: 1, label: 'No match: rows and a square lens that finds none, the title no matches, and a quiet button to clear the filters.' },
  { kind: 'error', title: "couldn't load the list", buttons: 1, label: "Error: a line that doesn't connect, the title couldn't load the list, and a quiet button to try again." },
  { kind: 'unknown', title: 'nothing can be checked yet', buttons: 1, primary: true, label: 'Unknown: a question mark in amber, the title nothing can be checked yet, and an emphasized button for what finds out.' },
];

function Kind({ kind, title, buttons, primary, label }: (typeof KINDS)[number]) {
  return (
    <Sketch w={160} h={118} label={label}>
      <rect className="sk-screen" x={1} y={1} width={158} height={116} />
      <EmptyPanel cx={80} y={14} kind={kind} title={title} buttons={buttons} primary={primary} />
    </Sketch>
  );
}

export const KindEmpty = () => <Kind {...KINDS[0]} />;
export const KindDone = () => <Kind {...KINDS[1]} />;
export const KindSearch = () => <Kind {...KINDS[2]} />;
export const KindError = () => <Kind {...KINDS[3]} />;
export const KindUnknown = () => <Kind {...KINDS[4]} />;

/* ---- the parts ------------------------------------------------------------------ */

/** a list's frame: its title, its tabs and its filters stay while the list is empty. */
function ListFrame({ w = 318, h = 198, tabs = true }: { w?: number; h?: number; tabs?: boolean }) {
  return (
    <g>
      <Screen w={w} h={h} />
      <Chevron x={8} y={5} />
      <Line x={20} y={7} w={36} strong />
      <Word x={12} y={34} size="md" tone="strong">
        missing
      </Word>
      <Line x={12} y={40} w={130} />
      {tabs ? (
        <g>
          <Word x={12} y={60} size="xs" tone="accent">
            missing 0
          </Word>
          <rect className="sk-fill-info" x={12} y={63} width={46} height={2} />
          <Word x={72} y={60} size="xs" tone="strong">
            not yet aired 132
          </Word>
          <line className="sk-rule" x1={1} x2={w + 1} y1={67} y2={67} />
        </g>
      ) : null}
      <SearchField x={12} y={74} w={110} text="harbour" />
      <Button x={128} y={74.5} w={40} />
    </g>
  );
}

export function EmptyAnatomy() {
  return (
    <Sketch h={200} label="A list with no matches, close up: 1 the place where the rows would be, under the title, tabs and filters, which stay; 2 the picture; 3 the title, no matches; 4 a line of description; 5 a button to clear the filters.">
      <ListFrame />
      <rect className="sk-planned" x={8} y={94} width={304} height={100} />
      <EmptyPanel cx={160} y={104} kind="search" title="no matches" buttons={1} />
      <Callout x={296} y={104} n={1} />
      <Callout x={110} y={119} n={2} />
      <Pointer x1={116} y1={119} x2={138} y2={119} />
      <Callout x={88} y={146} n={3} />
      <Pointer x1={94} y1={146} x2={124} y2={146} />
      <Callout x={88} y={160} n={4} />
      <Pointer x1={94} y1={159} x2={108} y2={156} />
      <Callout x={210} y={176} n={5} />
      <Pointer x1={204} y1={176} x2={182} y2={176} />
    </Sketch>
  );
}

/* ---- do and don't --------------------------------------------------------------- */

function Panel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Sketch w={200} h={124} label={label}>
      <rect className="sk-screen" x={1} y={1} width={198} height={122} />
      {children}
    </Sketch>
  );
}

export function NoMatchesDo() {
  return (
    <Panel label="An empty state with a square lens, the title no matches, a line saying nothing fits the search and filters, and a button to clear the filters.">
      <EmptyPanel cx={100} y={16} kind="search" title="no matches" buttons={1} />
    </Panel>
  );
}

export function NoDataDont() {
  return (
    <Panel label="An empty state with only the title no data: no reason, and no way out.">
      <EmptyPanel cx={100} y={24} kind="empty" title="no data" desc={false} />
    </Panel>
  );
}

export function LoadFailedDo() {
  return (
    <Panel label="An empty state with a broken line, the title couldn't load the list, a line of description, and a button to try again.">
      <EmptyPanel cx={100} y={16} kind="error" title="couldn't load the list" buttons={1} />
    </Panel>
  );
}

export function FalseGoodNewsDont() {
  return (
    <Panel label="After a load that failed, an empty state with a green check that says nothing missing.">
      <EmptyPanel cx={100} y={16} kind="done" title="nothing missing" />
    </Panel>
  );
}

export function UnknownDo() {
  return (
    <Panel label="An empty state with an amber question mark, the title nothing can be checked yet, a line of description, and an emphasized button to ask the catalog again.">
      <EmptyPanel cx={100} y={16} kind="unknown" title="nothing can be checked yet" buttons={1} primary />
    </Panel>
  );
}

export function UnknownAsDoneDont() {
  return (
    <Panel label="When nothing could be checked, an empty state with a green check that says nothing missing.">
      <EmptyPanel cx={100} y={24} kind="done" title="nothing missing" desc={false} />
    </Panel>
  );
}

export function OnePrimaryDo() {
  return (
    <Panel label="An empty state with the title nothing tracked yet, one emphasized button and one quiet button beside it.">
      <EmptyPanel cx={100} y={16} kind="empty" title="nothing tracked yet" buttons={2} primary />
    </Panel>
  );
}

export function ThreePrimariesDont() {
  return (
    <Panel label="An empty state with the title nothing tracked yet and three emphasized buttons side by side.">
      <EmptyPanel cx={100} y={16} kind="empty" title="nothing tracked yet" buttons={3} allPrimary />
    </Panel>
  );
}

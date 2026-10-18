// storyboard drawings for the status vocabulary: many values the system
// knows become a few statuses people understand, each with one meaning.
import { Arrow, Callout, Chip, Line, Pointer, Sketch, Status, Toast, Word, type Tone } from './kit';

const VALUES = ['wanted', 'queued', 'searching', 'grabbed', 'downloaded', 'waiting', 'failed', 'held'];
const TARGET: Record<string, number> = { wanted: 0, queued: 1, searching: 1, grabbed: 1, downloaded: 1, waiting: 1, failed: 2, held: 3 };
const STATUSES: { text: string; tone: Tone }[] = [
  { text: 'missing', tone: 'neutral' },
  { text: 'on its way', tone: 'info' },
  { text: 'needs attention', tone: 'err' },
  { text: 'held', tone: 'ok' },
];

export function VocabularyMapping() {
  const vy = (i: number) => 22 + i * 20;
  const sy = [22, 82, 142, 162];
  return (
    <Sketch h={184} label="Eight values the system knows, on the left: wanted, queued, searching, grabbed, downloaded, waiting, failed and held. Arrows lead them to four statuses on the right: wanted to missing; queued, searching, grabbed, downloaded and waiting to on its way; failed to needs attention; held to held.">
      <Word x={16} y={10} size="xs" tone="dim" mono={false}>
        What the system knows
      </Word>
      <Word x={200} y={10} size="xs" tone="dim" mono={false}>
        What people read
      </Word>
      {VALUES.map((v, i) => (
        <g key={v}>
          <Word x={16} y={vy(i) + 3} size="xs" tone="dim">
            {v}
          </Word>
          <Arrow x1={82} y1={vy(i)} x2={192} y2={sy[TARGET[v]]} />
        </g>
      ))}
      {STATUSES.map((s, i) => (
        <Status key={s.text} x={200} y={sy[i] - 3} tone={s.tone} text={s.text} glyph />
      ))}
    </Sketch>
  );
}

export function StatusAnatomy() {
  return (
    <Sketch h={88} label="One status, close up: 1 its meaning, shown by its colour and its own shape, here a red cross for an error; 2 its words, needs attention; 3 its detail, the release was removed by its source.">
      <rect className="sk-screen" x={1} y={1} width={318} height={86} />
      <g transform="translate(30 30) scale(1.6)">
        <Status x={0} y={0} tone="err" text="needs attention" glyph />
        <Word x={0} y={16} size="xs" tone="dim" mono={false}>
          The release was removed by its source
        </Word>
      </g>
      <Callout x={16} y={16} n={1} />
      <Pointer x1={22} y1={19} x2={30} y2={28} />
      <Callout x={196} y={18} n={2} />
      <Pointer x1={190} y1={20} x2={176} y2={28} />
      <Callout x={210} y={74} n={3} />
      <Pointer x1={204} y1={72} x2={194} y2={60} />
    </Sketch>
  );
}

export function FiveMeanings() {
  const rows: { meaning: string; tone: Tone; text: string }[] = [
    { meaning: 'Neutral', tone: 'neutral', text: 'missing' },
    { meaning: 'Information', tone: 'info', text: 'on its way' },
    { meaning: 'Success', tone: 'ok', text: 'held' },
    { meaning: 'Warning', tone: 'warn', text: "can't be checked" },
    { meaning: 'Error', tone: 'err', text: 'needs attention' },
  ];
  return (
    <Sketch w={220} h={112} label="The five meanings, each with an example: neutral, missing, with a grey dash; information, on its way, with a blue bar and dot; success, held, with a green check; warning, can't be checked, with an amber triangle; error, needs attention, with a red cross.">
      {rows.map((r, i) => (
        <g key={r.meaning}>
          <Word x={12} y={18 + i * 20} size="xs" tone="dim" mono={false}>
            {r.meaning}
          </Word>
          <Status x={86} y={13 + i * 20} tone={r.tone} text={r.text} glyph />
        </g>
      ))}
    </Sketch>
  );
}

export function EndToEnd() {
  return (
    <Sketch h={100} label="The same words in three places: a tab that says on their way 12, a row whose status is on its way, and a message after a grab that says 8 episodes queued.">
      <rect className="sk-screen" x={4} y={10} width={100} height={62} />
      <Word x={12} y={30} size="xs" tone="strong">
        on their way
      </Word>
      <Word x={78} y={30} size="xs" tone="accent">
        12
      </Word>
      <rect className="sk-fill-info" x={12} y={34} width={78} height={2} />
      <line className="sk-rule" x1={4} x2={104} y1={40} y2={40} />
      <Line x={12} y={50} w={60} />
      <Line x={12} y={60} w={48} />
      <rect className="sk-screen" x={110} y={10} width={100} height={62} />
      <Line x={118} y={22} w={60} />
      <line className="sk-rule" x1={110} x2={210} y1={32} y2={32} />
      <Line x={118} y={40} w={18} strong />
      <Status x={142} y={38.5} tone="info" text="on its way" glyph />
      <line className="sk-rule" x1={110} x2={210} y1={50} y2={50} />
      <Line x={118} y={58} w={60} />
      <rect className="sk-screen" x={216} y={10} width={100} height={62} />
      <Line x={224} y={22} w={60} />
      <Line x={224} y={32} w={48} />
      <Toast x={222} y={46} w={88} tone="ok" lines={['8 episodes queued']} />
      {['On the tab', 'In the row', 'After the grab'].map((t, i) => (
        <Word key={t} x={54 + i * 106} y={88} size="xs" tone="dim" mono={false} anchor="middle">
          {t}
        </Word>
      ))}
    </Sketch>
  );
}

/* ---- do and don't ------------------------------------------------------------------ */

export function WordsDecide() {
  return (
    <Sketch w={200} h={36} label="The status connection firewalled, in amber with a warning triangle.">
      <Status x={30} y={15} tone="warn" text="connection firewalled" glyph />
    </Sketch>
  );
}

export function ColourContradicts() {
  return (
    <Sketch w={200} h={36} label="The words connection firewalled on a green chip with a green dot.">
      <Chip x={30} y={12} text="• connection firewalled" tone="ok" />
    </Sketch>
  );
}

export function OneStatusPerRow() {
  return (
    <Sketch w={220} h={44} label="A row with one status, missing, and its detail: search failed, again in 2h.">
      <Word x={12} y={20} size="xs" tone="strong">
        S04E07
      </Word>
      <Status x={56} y={15.5} tone="neutral" text="missing" glyph />
      <Word x={56} y={33} size="xs" tone="dim" mono={false}>
        search failed · again in 2h
      </Word>
    </Sketch>
  );
}

export function TwoStatuses() {
  return (
    <Sketch w={220} h={44} label="A row with two statuses side by side: missing, and search failed in amber.">
      <Word x={12} y={20} size="xs" tone="strong">
        S04E07
      </Word>
      <Status x={56} y={15.5} tone="neutral" text="missing" glyph />
      <Status x={112} y={15.5} tone="warn" text="search failed" glyph />
    </Sketch>
  );
}

export function NeutralForFacts() {
  return (
    <Sketch w={200} h={36} label="The status queued, in grey: a plain fact.">
      <Status x={30} y={15} tone="neutral" text="queued" glyph />
    </Sketch>
  );
}

export function BlueForEverything() {
  return (
    <Sketch w={200} h={36} label="Three statuses, queued, missing and held, all in information blue.">
      <Status x={14} y={15} tone="info" text="queued" glyph />
      <Status x={74} y={15} tone="info" text="missing" glyph />
      <Status x={140} y={15} tone="info" text="held" glyph />
    </Sketch>
  );
}

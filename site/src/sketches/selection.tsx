// storyboard drawings for selection and bulk actions: tick the rows, press the
// one emphasized action, read what happened; and the parts of a list that
// selects.
import {
  Arrow,
  Button,
  Callout,
  Checkbox,
  Chevron,
  Cursor,
  Dots,
  LabelButton,
  Line,
  Marker,
  Pointer,
  Sketch,
  Status,
  Toast,
  Word,
  type Tone,
} from './kit';

/** one row of a list: a checkbox, the item's code, a line for its title, its status and its menu. */
export function ListRow({
  x,
  y,
  w,
  code,
  check = 'off',
  status = 'missing',
  tone = 'neutral',
  menu = true,
  selected,
  opens,
  titleW = 50,
}: {
  x: number;
  y: number;
  w: number;
  code: string;
  check?: 'off' | 'on' | 'disabled' | 'none';
  status?: string;
  tone?: Tone;
  menu?: boolean;
  selected?: boolean;
  /** a › at the row's end: a press opens it. */
  opens?: boolean;
  titleW?: number;
}) {
  const cx = check === 'none' ? x + 6 : x + 20;
  return (
    <g>
      {selected ? <rect className="sk-current" x={x} y={y} width={w} height={14} /> : null}
      {selected ? <Marker x={x} y={y} h={14} /> : null}
      {check !== 'none' ? <Checkbox x={x + 6} y={y + 3.5} state={check} /> : null}
      <Word x={cx} y={y + 10} size="xs" tone="strong">
        {code}
      </Word>
      <Line x={cx + 38} y={y + 5} w={titleW} />
      <Status x={x + w - 92} y={y + 4.5} tone={tone} text={status} glyph />
      {menu ? <Dots x={x + w - 16} y={y + 6} /> : null}
      {opens ? <Chevron x={x + w - 12} y={y + 3.5} s={7} /> : null}
    </g>
  );
}

/** a list's toolbar: what the list holds, or the selection and its actions. */
function Bar({ x, y, w, text, selected, action, extra }: { x: number; y: number; w: number; text: string; selected?: boolean; action?: string; extra?: string }) {
  return (
    <g>
      <rect className="sk-card" x={x} y={y} width={w} height={16} />
      {selected ? <Marker x={x} y={y} h={16} /> : null}
      <Word x={x + 7} y={y + 11} size="xs" tone={selected ? 'accent' : 'strong'}>
        {text}
      </Word>
      {extra ? (
        <Word x={x + 7 + text.length * 5.1 + 8} y={y + 11} size="xs" tone="dim">
          {extra}
        </Word>
      ) : null}
      {action ? <LabelButton x={x + w - action.length * 5.1 - 16} y={y + 2.5} text={action} primary /> : null}
    </g>
  );
}

/* ---- the story ------------------------------------------------------------------ */

function Frame({ x, step }: { x: number; step: 1 | 2 | 3 }) {
  const codes = ['S04E01', 'S04E02', 'S04E03', 'S04E04', 'S04E05', 'S04E06'];
  return (
    <g>
      <rect className="sk-screen" x={x} y={1} width={98} height={148} />
      {step === 2 ? (
        <g>
          <rect className="sk-card" x={x + 4} y={8} width={90} height={16} />
          <Marker x={x + 4} y={8} h={16} />
          <Word x={x + 9} y={19} size="xs" tone="accent">
            3 selected
          </Word>
          <Button x={x + 64} y={10.5} w={26} primary />
          <Cursor x={x + 76} y={15} />
        </g>
      ) : (
        <g>
          <rect className="sk-card" x={x + 4} y={8} width={90} height={16} />
          <Word x={x + 9} y={19} size="xs" tone="strong">
            40 missing
          </Word>
        </g>
      )}
      {codes.map((c, i) => {
        const y = 30 + i * 16;
        const ticked = step < 3 && i < 3;
        return (
          <g key={c}>
            {ticked ? <rect className="sk-current" x={x + 4} y={y} width={90} height={14} /> : null}
            {ticked ? <Marker x={x + 4} y={y} h={14} /> : null}
            <Checkbox x={x + 9} y={y + 3.5} state={ticked ? 'on' : 'off'} />
            <Word x={x + 21} y={y + 10} size="xs" tone="strong">
              {c}
            </Word>
            {step === 3 && i < 3 ? (
              <Status x={x + 60} y={y + 4.5} tone="info" glyph />
            ) : (
              <Status x={x + 60} y={y + 4.5} tone="neutral" glyph />
            )}
          </g>
        );
      })}
      {step === 1 ? <Cursor x={x + 13} y={73} /> : null}
      {step === 3 ? <Toast x={x + 4} y={126} w={90} lines={['3 episodes queued']} /> : null}
    </g>
  );
}

export function SelectStory() {
  const labels = ['Tick the rows', 'Press the action', 'Read the result'];
  return (
    <Sketch h={170} label="A storyboard in three frames. One: three rows are ticked. Two: the toolbar says 3 selected and the cursor presses its blue button. Three: the three rows now have a blue on-its-way status, and a message at the bottom says 3 episodes queued.">
      <Frame x={1} step={1} />
      <Arrow x1={102} y1={75} x2={109} y2={75} />
      <Frame x={111} step={2} />
      <Arrow x1={212} y1={75} x2={219} y2={75} />
      <Frame x={221} step={3} />
      {labels.map((l, i) => (
        <Word key={l} x={50 + i * 110} y={164} size="xs" tone="dim" mono={false} anchor="middle">
          {`${i + 1}  ${l}`}
        </Word>
      ))}
    </Sketch>
  );
}

/* ---- press versus select ------------------------------------------------------------- */

export function PressVsSelect() {
  return (
    <Sketch h={118} label="Three rows of a list, each with a checkbox at the start and a chevron at the end. A note above points at a checkbox: the checkbox selects. A note below points at the middle of a row: a press anywhere else opens the row.">
      <rect className="sk-screen" x={1} y={1} width={318} height={116} />
      {['S04E01', 'S04E02', 'S04E03'].map((c, i) => (
        <g key={c}>
          <ListRow x={14} y={36 + i * 16} w={292} code={c} menu={false} opens titleW={80} />
          <line className="sk-rule" x1={14} x2={306} y1={51 + i * 16} y2={51 + i * 16} />
        </g>
      ))}
      <Word x={14} y={18} size="xs" tone="strong" mono={false}>
        The checkbox selects
      </Word>
      <Pointer x1={24} y1={22} x2={23} y2={37} />
      <Word x={110} y={106} size="xs" tone="strong" mono={false}>
        A press anywhere else opens the row
      </Word>
      <Pointer x1={160} y1={98} x2={160} y2={76} />
    </Sketch>
  );
}

/* ---- the parts ------------------------------------------------------------------------ */

export function SelectionAnatomy() {
  const ox = 24;
  const w = 290;
  const rows: { code: string; check: 'on' | 'off' | 'disabled'; status?: string; tone?: Tone }[] = [
    { code: 'S04E01', check: 'on' },
    { code: 'S04E02', check: 'on' },
    { code: 'S04E03', check: 'on' },
    { code: 'S04E04', check: 'off' },
    { code: 'S04E05', check: 'disabled', status: 'on its way', tone: 'info' },
    { code: 'S04E06', check: 'off' },
  ];
  return (
    <Sketch w={344} h={204} label="A list that selects, close up: 1 the selection toolbar with 8 selected, clear and select all 37; 2 its one blue action; 3 a quieter action; 4 the select-all checkbox in the header; 5 a ticked row; 6 the row's menu; 7 the group's row and its action; 8 a row that can't be selected, with its status; 9 the message that counts what happened.">
      <rect className="sk-screen" x={ox - 6} y={4} width={w + 12} height={196} />
      <rect className="sk-card" x={ox} y={12} width={w} height={18} />
      <Marker x={ox} y={12} h={18} />
      <Word x={ox + 8} y={24} size="xs" tone="accent">
        8 selected
      </Word>
      <Word x={ox + 66} y={24} size="xs" tone="dim">
        clear
      </Word>
      <Word x={ox + 98} y={24} size="xs" tone="accent">
        select all 37
      </Word>
      <Button x={ox + 178} y={15.5} w={28} />
      <Button x={ox + 212} y={15.5} w={70} primary />
      <Checkbox x={ox + 6} y={38} state="mixed" />
      <Line x={ox + 20} y={39.5} w={30} strong />
      <Line x={ox + w - 92} y={39.5} w={24} strong />
      <line className="sk-rule" x1={ox} x2={ox + w} y1={48} y2={48} />
      <rect className="sk-bar" x={ox} y={51} width={w} height={14} />
      <Word x={ox + 20} y={61} size="xs" tone="strong" mono={false}>
        The Quiet Harbour · S04 · 9 missing
      </Word>
      <Button x={ox + w - 42} y={52.5} w={36} />
      {rows.map((r, i) => (
        <ListRow key={r.code} x={ox} y={68 + i * 16} w={w} code={r.code} check={r.check} status={r.status} tone={r.tone} selected={r.check === 'on'} />
      ))}
      <Toast x={ox + 150} y={170} w={130} lines={['8 episodes queued']} />
      <Callout x={10} y={21} n={1} />
      <Pointer x1={16} y1={21} x2={ox} y2={21} />
      <Callout x={318} y={7} n={2} />
      <Pointer x1={312} y1={9} x2={ox + 270} y2={15} />
      <Callout x={ox + 160} y={7} n={3} />
      <Pointer x1={ox + 166} y1={8} x2={ox + 180} y2={15} />
      <Callout x={10} y={42} n={4} />
      <Pointer x1={16} y1={42} x2={ox + 6} y2={42} />
      <Callout x={10} y={75} n={5} />
      <Pointer x1={16} y1={75} x2={ox + 6} y2={75} />
      <Callout x={332} y={92} n={6} />
      <Pointer x1={326} y1={92} x2={ox + w - 4} y2={91} />
      <Callout x={332} y={58} n={7} />
      <Pointer x1={326} y1={58} x2={ox + w - 6} y2={58} />
      <Callout x={10} y={139} n={8} />
      <Pointer x1={16} y1={139} x2={ox + 6} y2={139} />
      <Callout x={332} y={179} n={9} />
      <Pointer x1={326} y1={179} x2={ox + 280} y2={179} />
    </Sketch>
  );
}

/* ---- select all ---------------------------------------------------------------------- */

export function SelectAllOffer() {
  return (
    <Sketch h={106} label="After ticking the header checkbox: the toolbar says 40 selected and offers select all 2,409; every row on screen is ticked.">
      <rect className="sk-screen" x={1} y={1} width={318} height={104} />
      <rect className="sk-card" x={14} y={10} width={292} height={18} />
      <Marker x={14} y={10} h={18} />
      <Word x={22} y={22} size="xs" tone="accent">
        40 selected
      </Word>
      <Word x={86} y={22} size="xs" tone="accent">
        select all 2,409
      </Word>
      <Button x={232} y={13.5} w={68} primary />
      <Checkbox x={20} y={36} state="on" />
      <Line x={34} y={37.5} w={30} strong />
      <line className="sk-rule" x1={14} x2={306} y1={46} y2={46} />
      {['S04E01', 'S04E02', 'S04E03'].map((c, i) => (
        <ListRow key={c} x={14} y={50 + i * 16} w={292} code={c} check="on" selected />
      ))}
    </Sketch>
  );
}

/* ---- do and don't -------------------------------------------------------------------- */

export function CountedAction() {
  return (
    <Sketch w={200} h={40} label="A toolbar that says 8 selected, with one blue button: grab 8 selected.">
      <Bar x={6} y={12} w={188} text="8 selected" selected action="grab 8 selected" />
    </Sketch>
  );
}

export function VagueAction() {
  return (
    <Sketch w={200} h={40} label="A toolbar that says 8 selected, with one blue button that only says apply.">
      <Bar x={6} y={12} w={188} text="8 selected" selected action="apply" />
    </Sketch>
  );
}

export function RowMenus() {
  return (
    <Sketch w={240} h={92} label="Five rows, each with its code, its status in words, and a small menu of three dots at its end.">
      <rect className="sk-screen" x={1} y={1} width={238} height={90} />
      {['S04E01', 'S04E02', 'S04E03', 'S04E04', 'S04E05'].map((c, i) => (
        <ListRow key={c} x={8} y={8 + i * 16} w={224} code={c} check="none" titleW={40} />
      ))}
    </Sketch>
  );
}

export function RowButtons() {
  return (
    <Sketch w={240} h={92} label="Five rows, each ending in two buttons, a blue grab and a releases button, which squeeze the content.">
      <rect className="sk-screen" x={1} y={1} width={238} height={90} />
      {['S04E01', 'S04E02', 'S04E03', 'S04E04', 'S04E05'].map((c, i) => (
        <g key={c}>
          <Word x={14} y={18 + i * 16} size="xs" tone="strong">
            {c}
          </Word>
          <Line x={52} y={13 + i * 16} w={24} />
          <Status x={84} y={12.5 + i * 16} tone="neutral" text="missing" glyph />
          <LabelButton x={140} y={9 + i * 16} text="grab" primary />
          <LabelButton x={176} y={9 + i * 16} text="releases" />
        </g>
      ))}
    </Sketch>
  );
}

export function CountingToast() {
  return (
    <Sketch w={220} h={52} label="A message that says: 6 episodes queued, 2 skipped: on their way already.">
      <Toast x={10} y={12} w={200} lines={['6 episodes queued · 2 skipped:', 'on their way already']} />
    </Sketch>
  );
}

export function DoneToast() {
  return (
    <Sketch w={220} h={52} label="A message that only says: Done.">
      <Toast x={10} y={17} w={200} lines={['Done']} />
    </Sketch>
  );
}

export function HiddenByFilters() {
  const frame = (x: number, filtered: boolean) => (
    <g>
      <rect className="sk-screen" x={x} y={1} width={150} height={146} />
      <rect className="sk-card" x={x + 6} y={8} width={138} height={filtered ? 26 : 16} />
      <Marker x={x + 6} y={8} h={filtered ? 26 : 16} />
      <Word x={x + 12} y={19} size="xs" tone="accent">
        8 selected
      </Word>
      {filtered ? (
        <Word x={x + 12} y={30} size="xs" tone="dim">
          3 hidden by filters
        </Word>
      ) : null}
      {filtered ? (
        <g>
          <rect className="sk-chip sk-chip--info" x={x + 6} y={40} width={58} height={11} />
          <Word x={x + 11} y={48} size="xs" tone="accent">
            season 4
          </Word>
        </g>
      ) : null}
      {Array.from({ length: filtered ? 5 : 7 }, (_, i) => {
        const y = (filtered ? 56 : 30) + i * 16;
        return (
          <g key={i}>
            <rect className="sk-current" x={x + 6} y={y} width={138} height={14} />
            <Marker x={x + 6} y={y} h={14} />
            <Checkbox x={x + 11} y={y + 3.5} state="on" />
            <Line x={x + 24} y={y + 5} w={[60, 48, 66, 52, 58, 44, 62][i]} strong />
          </g>
        );
      })}
    </g>
  );
  return (
    <Sketch h={150} label="Two frames. Before: 8 rows selected. After a filter for season 4: the toolbar still says 8 selected, and adds 3 hidden by filters; the other 5 selected rows are on screen.">
      {frame(1, false)}
      <Arrow x1={155} y1={74} x2={166} y2={74} />
      {frame(169, true)}
    </Sketch>
  );
}

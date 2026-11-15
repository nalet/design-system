// storyboard drawings for the drafted parts of six components: an icon button
// that is on, a menu of one choice, details on an empty state, an action and a
// long list in a multi select, toasts at the top of a player, and a dialog on
// a phone. like every sketch, they show the idea, not the component, and each
// says in its label what it shows.
import { Arrow, Callout, Checkbox, Line, Pointer, Progress, Sketch, Toast, Toggle, Word } from './kit';
import { EmptyPicture } from './empty';

/* ---- small parts ------------------------------------------------------------------ */

type IconName =
  | 'bookmark'
  | 'heart'
  | 'captions'
  | 'play'
  | 'pause'
  | 'sliders'
  | 'volume'
  | 'expand'
  | 'plus'
  | 'check'
  | 'close'
  | 'caret-right'
  | 'caret-down'
  | 'caret-up';

/** line icons on a 12-unit grid, thin and unfilled, like the icon set. */
const ICONS: Record<IconName, string> = {
  bookmark: 'M3 1.5 H9 V10.5 L6 8 L3 10.5 Z',
  heart: 'M6 10 L2 6 C0.8 4.8 1 2.8 2.6 2.1 C3.9 1.6 5.2 2.2 6 3.4 C6.8 2.2 8.1 1.6 9.4 2.1 C11 2.8 11.2 4.8 10 6 Z',
  captions: 'M1 2.5 H11 V9.5 H1 Z M3 7 H5.5 M6.5 7 H9',
  play: 'M3.5 2 L10 6 L3.5 10 Z',
  pause: 'M4 2.5 V9.5 M8 2.5 V9.5',
  sliders: 'M1.5 4 H10.5 M1.5 8 H10.5 M4 2.5 V5.5 M8 6.5 V9.5',
  volume: 'M1.5 4.5 H3.5 L6.5 2 V10 L3.5 7.5 H1.5 Z M8.5 4.2 Q10 6 8.5 7.8',
  expand: 'M1.5 4 V1.5 H4 M8 1.5 H10.5 V4 M10.5 8 V10.5 H8 M4 10.5 H1.5 V8',
  plus: 'M6 2 V10 M2 6 H10',
  check: 'M1.5 6.2 L4.5 9 L10.5 3',
  close: 'M2.5 2.5 L9.5 9.5 M9.5 2.5 L2.5 9.5',
  'caret-right': 'M4.5 2.5 L8 6 L4.5 9.5',
  'caret-down': 'M2.5 4.5 L6 8 L9.5 4.5',
  'caret-up': 'M2.5 7.5 L6 4 L9.5 7.5',
};

function Icon({ name, x, y, s = 12, tone }: { name: IconName; x: number; y: number; s?: number; tone?: 'accent' | 'dark' | 'bright' }) {
  const cls = tone === 'dark' ? 'sk-tick' : tone === 'accent' ? 'sk-icon sk-icon--accent' : 'sk-icon';
  return (
    <path
      className={cls}
      style={tone === 'bright' ? { stroke: 'var(--fg)' } : undefined}
      d={ICONS[name]}
      transform={`translate(${x} ${y}) scale(${s / 12})`}
      vectorEffect="non-scaling-stroke"
    />
  );
}

/**
 * an icon button, s units square: the standard kind framed, the quiet kind
 * bare. on, it has the faint selected tint and a blue bar inside its bottom
 * edge; `filled` draws the look the drafts turn down, a blue fill.
 */
function IconBtn({
  x,
  y,
  name,
  s = 22,
  quiet,
  on,
  filled,
  open,
}: {
  x: number;
  y: number;
  name: IconName;
  s?: number;
  quiet?: boolean;
  on?: boolean;
  filled?: boolean;
  /** the trigger of a menu that is open: the hover fill. */
  open?: boolean;
}) {
  const inset = (s - 12) / 2;
  return (
    <g>
      {on ? <rect className="sk-current" x={x} y={y} width={s} height={s} /> : null}
      {open ? <rect className="sk-box" x={x} y={y} width={s} height={s} /> : null}
      {filled ? <rect className="sk-button sk-button--primary" x={x} y={y} width={s} height={s} /> : null}
      {!filled && !quiet ? <rect className="sk-button" x={x} y={y} width={s} height={s} /> : null}
      {on ? <rect className="sk-fill-info" x={x + 0.6} y={y + s - 2.6} width={s - 1.2} height={2} /> : null}
      <Icon name={name} x={x + inset} y={y + inset} tone={filled ? 'dark' : on ? 'bright' : undefined} />
    </g>
  );
}

/** a button with words, h units high: the emphasized one is filled blue. */
function WordButton({ x, y, text, h = 16, primary, icon }: { x: number; y: number; text: string; h?: number; primary?: boolean; icon?: IconName }) {
  const w = text.length * 5.1 + (icon ? 30 : 16);
  return (
    <g>
      <rect className={primary ? 'sk-button sk-button--primary' : 'sk-button'} x={x} y={y} width={w} height={h} />
      {icon ? <Icon name={icon} x={x + 6} y={y + (h - 10) / 2} s={10} tone={primary ? 'dark' : undefined} /> : null}
      <Word x={icon ? x + 21 : x + w / 2} y={y + h / 2 + 3} size="xs" tone={primary ? 'inverse' : 'strong'} anchor={icon ? 'start' : 'middle'}>
        {text}
      </Word>
    </g>
  );
}

/** a caption under a frame, in the body face. */
function Caption({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <Word x={x} y={y} size="xs" tone="dim" mono={false} anchor="middle">
      {children}
    </Word>
  );
}

/** a picked option's words: the brightest grey, a step bolder. */
function Picked({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text className="sk-word sk-word--xs sk-word--strong" x={x} y={y} style={{ fontWeight: 700 }}>
      {children}
    </text>
  );
}

export function WhichOneFits() {
  return (
    <Sketch h={130} label="Three cases side by side. A list of settings, each with its name and a switch, the first one on. A title's actions: play, a bookmark that is on, with its blue bar, and a heart that is off. And a play button that becomes a pause button once it is pressed, its label changing from play to pause.">
      {/* a setting: a switch */}
      <rect className="sk-screen" x={4} y={4} width={100} height={96} />
      <Line x={12} y={14} w={44} strong />
      {[30, 52, 74].map((y, i) => (
        <g key={y}>
          <Line x={12} y={y + 2} w={[44, 36, 40][i]} strong />
          <Toggle x={82} y={y} on={i === 0} />
          <line className="sk-rule" x1={4} x2={104} y1={y + 13} y2={y + 13} />
        </g>
      ))}
      <Caption x={54} y={114}>
        A setting:
      </Caption>
      <Caption x={54} y={124}>
        a switch
      </Caption>

      {/* a state, in place: on or off */}
      <rect className="sk-screen" x={110} y={4} width={100} height={96} />
      <rect className="sk-box" x={118} y={14} width={22} height={32} />
      <Line x={146} y={18} w={48} strong />
      <Line x={146} y={28} w={36} />
      <WordButton x={118} y={60} text="play" icon="play" primary />
      <IconBtn x={172} y={60} s={16} name="bookmark" on />
      <IconBtn x={191} y={60} s={16} name="heart" />
      <Caption x={160} y={114}>
        A state, in place:
      </Caption>
      <Caption x={160} y={124}>
        on or off
      </Caption>

      {/* two verbs: the label changes */}
      <rect className="sk-screen" x={216} y={4} width={100} height={96} />
      <IconBtn x={228} y={34} name="play" />
      <Arrow x1={256} y1={45} x2={276} y2={45} />
      <IconBtn x={282} y={34} name="pause" />
      <Word x={239} y={72} size="xs" tone="strong" anchor="middle">
        play
      </Word>
      <Word x={293} y={72} size="xs" tone="strong" anchor="middle">
        pause
      </Word>
      <Caption x={266} y={114}>
        Two verbs:
      </Caption>
      <Caption x={266} y={124}>
        the label changes
      </Caption>
    </Sketch>
  );
}

function TitleActions({ filled }: { filled?: boolean }) {
  return (
    <g>
      <rect className="sk-screen" x={1} y={1} width={198} height={58} />
      <Line x={12} y={13} w={70} strong />
      <WordButton x={12} y={26} h={18} text="play" icon="play" primary />
      <IconBtn x={66} y={26} s={18} name="bookmark" on={!filled} filled={filled} />
      <IconBtn x={90} y={26} s={18} name="heart" on={!filled} filled={filled} />
    </g>
  );
}

/* ---- action menu: a menu of one choice --------------------------------------------- */

export function OneChoiceMenu() {
  const mx = 158;
  const mw = 128;
  const quality = [
    { t: 'auto', detail: '720p', picked: true },
    { t: '1080p' },
    { t: '720p' },
    { t: '480p' },
  ];
  const speed = [{ t: '0.5×' }, { t: '1×', picked: true }, { t: '1.5×' }, { t: '2×' }];
  const row = (top: number, o: { t: string; detail?: string; picked?: boolean }) => (
    <g key={o.t + top}>
      {o.picked ? <Icon name="check" x={mx + 7} y={top + 1.5} s={9} tone="accent" /> : null}
      {o.picked ? (
        <Picked x={mx + 22} y={top + 8.5}>
          {o.t}
        </Picked>
      ) : (
        <Word x={mx + 22} y={top + 8.5} size="xs">
          {o.t}
        </Word>
      )}
      {o.detail ? (
        <Word x={mx + 22 + o.t.length * 5.1 + 4} y={top + 8.5} size="xs" tone="dim">
          {`· ${o.detail}`}
        </Word>
      ) : null}
    </g>
  );
  return (
    <Sketch h={212} label="A video player's settings menu, open above the icon at the right of its controls. Under the header quality, marked 1: auto · 720p, checked, then 1080p, 720p and 480p; the 720p after auto, marked 5, says what auto picked. A thin separator, marked 4. Under the header speed: 0.5×, then 1× with a blue check before it, marked 2, and its words brighter and bolder, marked 3, then 1.5× and 2×.">
      <rect className="sk-screen" x={1} y={1} width={318} height={210} />
      <Progress x={12} y={180} w={296} value={0.42} />
      <IconBtn x={10} y={188} s={18} name="pause" quiet />
      <IconBtn x={30} y={188} s={18} name="volume" quiet />
      <IconBtn x={246} y={188} s={18} name="captions" quiet />
      <IconBtn x={268} y={188} s={18} name="sliders" quiet open />
      <IconBtn x={290} y={188} s={18} name="expand" quiet />

      <rect className="sk-sheet" x={mx} y={49} width={mw} height={135} />
      <Word x={mx + 10} y={61.5} size="xs" tone="dim">
        quality
      </Word>
      {quality.map((o, i) => row(65 + i * 12, o))}
      <line className="sk-rule" x1={mx} x2={mx + mw} y1={116.5} y2={116.5} />
      <Word x={mx + 10} y={128.5} size="xs" tone="dim">
        speed
      </Word>
      {speed.map((o, i) => row(132 + i * 12, o))}

      <Callout x={140} y={58.5} n={1} />
      <Pointer x1={146} y1={58.5} x2={166} y2={58.5} />
      <Callout x={140} y={150} n={2} />
      <Pointer x1={146} y1={150} x2={164} y2={150} />
      <Callout x={304} y={150} n={3} />
      <Pointer x1={298} y1={150} x2={193} y2={150} />
      <Callout x={140} y={116.5} n={4} />
      <Pointer x1={146} y1={116.5} x2={157} y2={116.5} />
      <Callout x={304} y={70} n={5} />
      <Pointer x1={298} y1={70} x2={238} y2={70} />
    </Sketch>
  );
}

/** a small menu for the do and don't: rows of options, headers and separators. */
function SmallMenu({ rows }: { rows: ({ h: string } | { t: string; picked?: boolean } | 'sep')[] }) {
  const x = 50;
  const w = 100;
  let y = 12;
  const parts = rows.map((r, i) => {
    const top = y;
    if (r === 'sep') {
      y += 7;
      return <line key={i} className="sk-rule" x1={x} x2={x + w} y1={top + 3.5} y2={top + 3.5} />;
    }
    y += 12;
    if ('h' in r) {
      return (
        <Word key={i} x={x + 10} y={top + 8.5} size="xs" tone="dim">
          {r.h}
        </Word>
      );
    }
    return (
      <g key={i}>
        {r.picked ? <Icon name="check" x={x + 7} y={top + 1.5} s={9} tone="accent" /> : null}
        {r.picked ? (
          <Picked x={x + 22} y={top + 8.5}>
            {r.t}
          </Picked>
        ) : (
          <Word x={x + 22} y={top + 8.5} size="xs">
            {r.t}
          </Word>
        )}
      </g>
    );
  });
  return (
    <g>
      <rect className="sk-sheet" x={x} y={8} width={w} height={y - 8 + 4} />
      {parts}
    </g>
  );
}

export function ChoiceGroupsDo() {
  return (
    <Sketch w={200} h={126} label="A menu with two headers, quality and speed, each above its three options, a separator between them, and one option checked under each: 1080p and 1×.">
      <SmallMenu rows={[{ h: 'quality' }, { t: '1080p', picked: true }, { t: '720p' }, { t: '480p' }, 'sep', { h: 'speed' }, { t: '0.5×' }, { t: '1×', picked: true }, { t: '2×' }]} />
    </Sketch>
  );
}

export function ChoiceMixedDont() {
  return (
    <Sketch w={200} h={126} label="One list of six options, three qualities and three speeds, with two checks and no headers.">
      <SmallMenu rows={[{ t: '1080p', picked: true }, { t: '720p' }, { t: '480p' }, { t: '0.5×' }, { t: '1×', picked: true }, { t: '2×' }]} />
    </Sketch>
  );
}

/* ---- empty state: details ---------------------------------------------------------- */

/** a couldn't-load empty state centred on cx: its picture, words, button and, when asked, its details. */
function FailedPanel({ cx, details, codeAsSentence }: { cx: number; details?: 'closed' | 'open'; codeAsSentence?: boolean }) {
  return (
    <g>
      <EmptyPicture kind="error" x={cx - 20} y={12} />
      <Word x={cx} y={58} size="xs" tone="strong" anchor="middle">
        couldn't load the list
      </Word>
      <Word x={cx} y={71} size="xs" mono={false} anchor="middle">
        {codeAsSentence ? 'HTTP 503 Service Unavailable' : 'The server is busy.'}
      </Word>
      <WordButton x={cx - 31} y={79} h={15} text="try again" />
      {details ? (
        <g>
          <Icon name={details === 'open' ? 'caret-down' : 'caret-right'} x={cx - 23} y={101.5} s={8} />
          <Word x={cx - 13} y={108} size="xs" tone="dim">
            details
          </Word>
        </g>
      ) : null}
      {details === 'open' ? (
        <g>
          <line className="sk-rule" x1={cx - 52} x2={cx - 52} y1={114} y2={138} />
          <Word x={cx - 45} y={124} size="xs">
            HTTP 503 Service
          </Word>
          <Word x={cx - 45} y={134} size="xs">
            Unavailable
          </Word>
        </g>
      ) : null}
    </g>
  );
}

/* ---- multi select: an action, and a long list -------------------------------------- */

/** the multi select's trigger: its label, the summary in blue, the arrow turned over while open. */
function MultiTrigger({ x, y, chosen }: { x: number; y: number; chosen: string }) {
  return (
    <g>
      <rect className="sk-input" x={x} y={y} width={112} height={18} />
      <Word x={x + 8} y={y + 12} size="xs">
        lists
      </Word>
      <Word x={x + 40} y={y + 12} size="xs" tone="accent">
        {chosen}
      </Word>
      <Icon name="caret-up" x={x + 96} y={y + 5} s={8} tone="accent" />
    </g>
  );
}

/** the panel's foot: the thin rule, the action, and clear. */
function Foot({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line className="sk-rule" x1={x} x2={x + 140} y1={y} y2={y} />
      <Icon name="plus" x={x + 9} y={y + 5} s={8} />
      <Word x={x + 21} y={y + 12} size="xs">
        create a list
      </Word>
      <Word x={x + 10} y={y + 27} size="xs">
        clear lists
      </Word>
    </g>
  );
}

const LISTS = ['Watchlist', 'Rainy Sundays', 'Film club', 'Westerns', 'To watch again', 'Road trips', 'Noir', 'Documentaries', 'Classics', 'Summer'];

function Option({ x, y, text, on }: { x: number; y: number; text: string; on?: boolean }) {
  return (
    <g>
      <Checkbox x={x + 10} y={y + 4.5} state={on ? 'on' : 'off'} />
      <Word x={x + 23} y={y + 11} size="xs" tone="strong">
        {text}
      </Word>
    </g>
  );
}

export function FootInViewDo() {
  return (
    <Sketch w={200} h={160} label="A multi select's panel near the bottom of a small window: five of its ten lists show, with a scroll bar beside them, and under a thin rule, create a list and clear lists stay in view, a little above the window's edge.">
      <rect className="sk-screen" x={1} y={1} width={198} height={158} />
      <MultiTrigger x={20} y={8} chosen="3 chosen" />
      <rect className="sk-sheet" x={20} y={30} width={140} height={122} />
      {LISTS.slice(0, 5).map((t, i) => (
        <Option key={t} x={20} y={34 + i * 16} text={t} on={i === 0 || i === 2 || i === 4} />
      ))}
      <rect className="sk-scroll" x={154} y={34} width={3} height={80} />
      <rect className="sk-scroll-thumb" x={154} y={34} width={3} height={40} />
      <Foot x={20} y={118} />
    </Sketch>
  );
}

export function ActionLostDont() {
  return (
    <Sketch w={200} h={160} label="The same panel with no maximum height: its ten lists run past the bottom of the window, and the action at their end is out of sight.">
      <rect className="sk-screen" x={1} y={1} width={198} height={158} />
      <MultiTrigger x={20} y={8} chosen="3 chosen" />
      <rect className="sk-sheet" x={20} y={30} width={140} height={200} />
      {LISTS.map((t, i) => (
        <Option key={t} x={20} y={34 + i * 16} text={t} on={i === 0 || i === 2 || i === 4} />
      ))}
      <rect className="sk-fade" x={1} y={146} width={198} height={14} />
    </Sketch>
  );
}

/* ---- toast: at the top ------------------------------------------------------------- */

/** a video playing, with two lines of subtitles and its controls at the foot. */
function Player({ w, h }: { w: number; h: number }) {
  const cx = w / 2;
  const foot = h - 30;
  return (
    <g>
      <rect className="sk-screen" x={1} y={1} width={w - 2} height={h - 2} />
      <Word x={cx} y={foot - 22} size="sm" tone="strong" mono={false} anchor="middle">
        Where were you last night?
      </Word>
      <Word x={cx} y={foot - 9} size="sm" tone="strong" mono={false} anchor="middle">
        Out by the harbour.
      </Word>
      <Progress x={12} y={foot} w={w - 24} value={0.36} />
      <IconBtn x={10} y={foot + 7} s={16} name="pause" quiet />
      <IconBtn x={28} y={foot + 7} s={16} name="volume" quiet />
      <IconBtn x={w - 64} y={foot + 7} s={16} name="captions" quiet on />
      <IconBtn x={w - 46} y={foot + 7} s={16} name="sliders" quiet />
      <IconBtn x={w - 28} y={foot + 7} s={16} name="expand" quiet />
    </g>
  );
}

export function ToastTopDo() {
  return (
    <Sketch w={240} h={150} label="A video playing, its subtitles and controls at the foot, and a toast at the top: Saved to watchlist.">
      <Player w={240} h={150} />
      <Toast x={66} y={12} w={108} lines={['Saved to watchlist']} />
    </Sketch>
  );
}

export function ToastBottomDont() {
  return (
    <Sketch w={240} h={150} label="The same video with the toast at the bottom, over the second line of subtitles, just above the controls.">
      <Player w={240} h={150} />
      <Toast x={66} y={102} w={108} lines={['Saved to watchlist']} />
    </Sketch>
  );
}

/* ---- modal: a sheet on a phone ----------------------------------------------------- */

/** a dialog's parts inside a frame: the title and close, a field, and the footer's two buttons. */
function DialogParts({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g>
      <Line x={x + 6} y={y + 6} w={Math.min(36, w * 0.45)} strong />
      <Icon name="close" x={x + w - 12} y={y + 3.5} s={8} />
      <line className="sk-rule" x1={x} x2={x + w} y1={y + 15} y2={y + 15} />
      <Line x={x + 6} y={y + 21} w={22} />
      <rect className="sk-input" x={x + 6} y={y + 27} width={w - 12} height={9} />
      <line className="sk-rule" x1={x} x2={x + w} y1={y + 43} y2={y + 43} />
      <Line x={x + w - 46} y={y + 50} w={14} />
      <rect className="sk-button sk-button--primary" x={x + w - 28} y={y + 47} width={22} height={9} />
    </g>
  );
}

/** a phone held upright: the bar at the top, and the tabs at the foot as icons only. */
function PhoneFrame({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect className="sk-screen" x={x} y={y} width={70} height={150} />
      <rect className="sk-bar" x={x} y={y} width={70} height={14} />
      <Line x={x + 6} y={y + 5} w={20} strong />
      {[26, 44, 62, 80].map((dy) => (
        <rect key={dy} className="sk-card" x={x + 6} y={y + dy} width={58} height={12} />
      ))}
      <line className="sk-rule" x1={x} x2={x + 70} y1={y + 136} y2={y + 136} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} className={i === 0 ? 'sk-icon sk-icon--accent' : 'sk-icon'} x={x + 6 + i * 13} y={y + 140} width={6} height={6} />
      ))}
    </g>
  );
}

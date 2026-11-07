// storyboard drawings for touch and tv sizes, choosing on a tv, and three
// planned inputs: the slider, the stepper and the progress bar.
//
// the touch and tv drawings are to scale: one unit is a css pixel on a phone,
// and a dp on a tv's 960 × 540 canvas, so they set their own type sizes. the
// others use the kit's storyboard scale, like every other sketch.
import type { ReactNode } from 'react';
import { Callout, Glyph, LabelButton, Pointer, Sketch, Word } from './kit';

/* ---- shared ----------------------------------------------------------------- */

type Tone = 'strong' | 'muted' | 'dim' | 'accent' | 'inverse' | 'ok' | 'warn' | 'err' | 'info';

/** text at a size of its own, for the drawings that are to scale. */
function T({
  x,
  y,
  size,
  children,
  tone = 'muted',
  body,
  anchor,
  weight,
}: {
  x: number;
  y: number;
  size: number;
  children: ReactNode;
  tone?: Tone;
  body?: boolean;
  anchor?: 'start' | 'middle' | 'end';
  weight?: number;
}) {
  const cls = ['sk-word', tone === 'muted' ? '' : `sk-word--${tone}`, body ? 'sk-word--body' : ''].filter(Boolean).join(' ');
  return (
    <text className={cls} x={x} y={y} textAnchor={anchor} style={{ fontSize: size, fontWeight: weight }}>
      {children}
    </text>
  );
}

/** a drawing as wide as its figure: the to-scale screens, which the kit would cap at 520 px. */
function Wide({ w, h, label, children }: { w: number; h: number; label: string; children: ReactNode }) {
  return (
    <svg className="ds-sketch" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label} style={{ maxWidth: '100%' }}>
      {children}
    </svg>
  );
}

/** a numbered marker at a size of its own, for the to-scale screens. */
function Mark({ x, y, n, s = 24 }: { x: number; y: number; n: number; s?: number }) {
  return (
    <g className="sk-callout">
      <rect x={x - s / 2} y={y - s / 2} width={s} height={s} />
      <text x={x} y={y + s * 0.22} textAnchor="middle" style={{ fontSize: s * 0.62 }}>
        {n}
      </text>
    </g>
  );
}

/** a touch area: the invisible square that answers to a finger, drawn as a dashed tint. */
function Area({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <rect className="sk-strip sk-strip--info" x={x} y={y} width={w} height={h} fillOpacity={0.55} strokeDasharray="3 2" />;
}

/** the tv focus ring, 3 wide: outside with a gap of 2, or inside the edge. */
function Ring({ x, y, w, h, inside }: { x: number; y: number; w: number; h: number; inside?: boolean }) {
  const o = inside ? -1.5 : 3.5;
  return <rect className="sk-focus" x={x - o} y={y - o} width={w + 2 * o} height={h + 2 * o} style={{ strokeWidth: 3 }} />;
}

/** the focused surface of a tv row, a field or a plain button. */
function FocusedSurface({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <rect x={x} y={y} width={w} height={h} style={{ fill: 'var(--surface-focus)' }} />;
}

/** a key on a remote, as a small keycap with its word. */
function Key({ x, y, children, size = 16 }: { x: number; y: number; children: string; size?: number }) {
  const w = children.length * size * 0.62 + size;
  return (
    <g>
      <rect className="sk-chip" x={x} y={y - size * 1.05} width={w} height={size * 1.5} />
      <T x={x + w / 2} y={y} size={size} tone="strong" anchor="middle">
        {children}
      </T>
    </g>
  );
}

/** an icon placeholder: a small square, as the kit draws icons. */
function IconBox({ x, y, s }: { x: number; y: number; s: number }) {
  return <rect className="sk-icon" x={x} y={y} width={s} height={s} />;
}

/* ---- touch ------------------------------------------------------------------- */

/** a large button, drawn to scale: 42 high. */
function BigButton({ x, y, w, text, primary }: { x: number; y: number; w: number; text: string; primary?: boolean }) {
  return (
    <g>
      <rect className={primary ? 'sk-button sk-button--primary' : 'sk-button'} x={x} y={y} width={w} height={42} />
      <T x={x + w / 2} y={y + 26} size={14} tone={primary ? 'inverse' : 'strong'} anchor="middle">
        {text}
      </T>
    </g>
  );
}

/** an icon button at a given size, drawn to scale, with its icon. */
function SquareButton({ x, y, s, faded }: { x: number; y: number; s: number; faded?: boolean }) {
  const icon = s >= 42 ? 20 : s >= 34 ? 16 : 12;
  return (
    <g className={faded ? 'sk-faded' : undefined}>
      <rect className="sk-button" x={x} y={y} width={s} height={s} />
      <IconBox x={x + (s - icon) / 2} y={y + (s - icon) / 2} s={icon} />
    </g>
  );
}

export function TouchArea() {
  return (
    <Sketch
      w={360}
      h={204}
      label="The touch area, to scale. A large button, 42 high, answers to a touch in a band 48 high around it. Two large icon buttons stand 8 apart, so their two 48 squares stay 2 apart. A banner's dismiss, drawn 28 square, answers in a 48 square around it. A switch with its label sits in a row 48 high, and the whole row is its target."
    >
      <Area x={24} y={30} w={112} h={48} />
      <BigButton x={24} y={33} w={112} text="try again" />
      <T x={24} y={98} size={11} body tone="dim">
        Drawn 42, touched in 48
      </T>

      <Area x={185} y={30} w={48} h={48} />
      <Area x={235} y={30} w={48} h={48} />
      <SquareButton x={188} y={33} s={42} />
      <SquareButton x={238} y={33} s={42} />
      <T x={234} y={24} size={10} tone="accent" anchor="middle">
        8
      </T>
      <line className="sk-pointer" x1={230} x2={238} y1={27} y2={27} />
      <T x={185} y={98} size={11} body tone="dim">
        Two icon buttons, 8 apart
      </T>

      <Area x={24} y={122} w={48} h={48} />
      <rect className="sk-button" x={34} y={132} width={28} height={28} />
      <path className="sk-icon" d="M42 140 L54 152 M54 140 L42 152" />
      <T x={24} y={190} size={11} body tone="dim">
        Drawn 28, touched in 48
      </T>

      <Area x={185} y={122} w={151} h={48} />
      <rect className="sk-toggle sk-toggle--on" x={195} y={136} width={36} height={20} />
      <rect className="sk-knob sk-knob--on" x={214} y={139} width={14} height={14} />
      <T x={241} y={150.5} size={13} body tone="strong">
        Email alerts
      </T>
      <T x={185} y={190} size={11} body tone="dim">
        A switch: its row is the target
      </T>
    </Sketch>
  );
}

export function TouchDo() {
  return (
    <Sketch w={240} h={90} label="Three large icon buttons, 42 square and 8 apart. Each answers to a touch in its own 48 square, and the squares never meet.">
      {[49, 99, 149].map((x) => (
        <g key={x}>
          <Area x={x - 3} y={18} w={48} h={48} />
          <SquareButton x={x} y={21} s={42} />
        </g>
      ))}
    </Sketch>
  );
}

export function TouchDont() {
  const xs = [74, 106, 138];
  return (
    <Sketch w={240} h={90} label="Three small icon buttons, 28 square and only 4 apart. Their 48 squares run into each other, marked in red where they overlap: a touch there could hit either button.">
      {xs.map((x) => (
        <Area key={x} x={x - 10} y={18} w={48} h={48} />
      ))}
      {[96, 128].map((x) => (
        <rect key={x} className="sk-fill-err" x={x} y={18} width={16} height={48} fillOpacity={0.35} />
      ))}
      {xs.map((x) => (
        <SquareButton key={x} x={x} y={28} s={28} />
      ))}
    </Sketch>
  );
}

/* ---- the tv canvas ------------------------------------------------------------- */

export function TvCanvas() {
  const rows = [
    ['S01E01 · Arrival', '52 min'],
    ['S01E02 · The Harbour', '48 min'],
    ['S01E03 · Low Tide', '50 min'],
    ['S01E04 · Lanterns', '47 min'],
    ['S01E05 · The Ferry', '51 min'],
    ['S01E06 · First Ice', '49 min'],
  ];
  // the focused button grows by 5% around its centre.
  const play = { x: 72, y: 220, w: 96, h: 42 };
  const grown = { w: play.w * 1.05, h: play.h * 1.05 };
  const gx = play.x - (grown.w - play.w) / 2;
  const gy = play.y - (grown.h - play.h) / 2;
  return (
    <Wide
      w={960}
      h={540}
      label="A TV screen drawn to scale on its 960 by 540 dp canvas. 1: the safe area, a dashed line 48 dp from the left and right edges and 27 dp from the top and bottom; everything that can take focus is inside it. 2: a row of large controls, 42 dp high and 12 dp apart; the first one, play, has the focus, 5% larger, with its ring outside it. 3: a list of episodes in rows 48 dp high. 4: the text: the title at 32 dp, the description people read at 16, labels at 14, a badge at 12, the smallest."
    >
      <rect className="sk-screen" x={0.75} y={0.75} width={958.5} height={538.5} />
      <rect className="sk-planned" x={48} y={27} width={864} height={486} />

      <T x={72} y={92} size={32} tone="strong" weight={700}>
        The Quiet Harbour
      </T>
      <T x={72} y={124} size={14}>
        2026 · 1 season · 6 episodes
      </T>
      <rect className="sk-chip sk-chip--info" x={322} y={110} width={92} height={18} />
      <T x={368} y={123} size={12} tone="info" anchor="middle">
        new episodes
      </T>
      <T x={72} y={164} size={16} body tone="strong">
        Four families wait out one winter in a
      </T>
      <T x={72} y={189} size={16} body tone="strong">
        harbour town that the ferry has left.
      </T>

      <rect className="sk-button sk-button--primary" x={gx} y={gy} width={grown.w} height={grown.h} />
      <T x={play.x + play.w / 2} y={play.y + 26} size={14.7} tone="inverse" anchor="middle">
        play
      </T>
      <Ring x={gx} y={gy} w={grown.w} h={grown.h} />
      <BigButton x={180} y={220} w={150} text="add to list" />
      <SquareButton x={342} y={220} s={42} />

      <T x={528} y={84} size={14}>
        season 1
      </T>
      {rows.map(([title, length], i) => {
        const y = 96 + i * 48;
        return (
          <g key={title}>
            <line className="sk-rule" x1={528} x2={888} y1={y + 48} y2={y + 48} />
            <T x={540} y={y + 29} size={14} body tone="strong">
              {title}
            </T>
            <T x={876} y={y + 29} size={12} anchor="end">
              {length}
            </T>
          </g>
        );
      })}

      <Mark x={24} y={14} n={1} />
      <Pointer x1={34} y1={20} x2={48} y2={27} />
      <Mark x={120} y={318} n={2} />
      <Pointer x1={120} y1={306} x2={120} y2={270} />
      <Mark x={500} y={168} n={3} />
      <Pointer x1={512} y1={168} x2={528} y2={168} />
      <Mark x={440} y={92} n={4} />
      <Pointer x1={428} y1={92} x2={402} y2={84} />
    </Wide>
  );
}

/* ---- choosing on a tv ------------------------------------------------------------ */

const LANGUAGES = ['off', 'English', 'German', 'French', 'Spanish'];

/** a select drawn to scale on a tv: 42 dp, the value and the blue arrow. */
function TvSelect({ x, y, w, value, focused }: { x: number; y: number; w: number; value: string; focused?: boolean }) {
  const g = focused ? 1.02 : 1;
  const gw = w * g;
  const gh = 42 * g;
  const gx = x - (gw - w) / 2;
  const gy = y - (gh - 42) / 2;
  return (
    <g>
      {focused ? <FocusedSurface x={gx} y={gy} w={gw} h={gh} /> : <rect className="sk-input" x={x} y={y} width={w} height={42} />}
      <T x={x + 16} y={y + 26} size={14} tone="strong">
        {value}
      </T>
      <path className="sk-chevron" d={`M${x + w - 28} ${y + 18} L${x + w - 22} ${y + 24} L${x + w - 16} ${y + 18}`} />
      {focused ? <Ring x={gx} y={gy} w={gw} h={gh} inside /> : null}
    </g>
  );
}

/** the list a tv draws for a select: rows of 40 dp, the picked one with a check. */
function TvList({ x, y, w, picked, focused }: { x: number; y: number; w: number; picked: number; focused: number }) {
  const h = LANGUAGES.length * 40 + 8;
  return (
    <g>
      <rect className="sk-sheet" x={x} y={y} width={w} height={h} />
      {LANGUAGES.map((name, i) => {
        const ry = y + 4 + i * 40;
        const isFocused = i === focused;
        const gw = (w - 2) * 1.02;
        const gh = 40 * 1.02;
        const gx = x + 1 - (gw - (w - 2)) / 2;
        const gy = ry - (gh - 40) / 2;
        return (
          <g key={name}>
            {isFocused ? <FocusedSurface x={gx} y={gy} w={gw} h={gh} /> : null}
            {i === picked ? <path className="sk-glyph sk-glyph--ok" d={`M${x + 16} ${ry + 21} L${x + 20} ${ry + 25} L${x + 28} ${ry + 15}`} style={{ stroke: 'var(--fg)' }} /> : null}
            <T x={x + 40} y={ry + 25} size={14} tone={isFocused || i === picked ? 'strong' : 'muted'}>
              {name}
            </T>
            {isFocused ? <Ring x={gx} y={gy} w={gw} h={gh} inside /> : null}
          </g>
        );
      })}
    </g>
  );
}

export function TvListOpen() {
  return (
    <Wide
      w={960}
      h={600}
      label="A settings page on a TV, drawn to scale. The subtitles select, set to English, has opened its list over the page, which is dimmed behind it. The list holds off, English, German, French and Spanish in rows of 40 dp; English has a check, and the focus is on it. Under the screen, the keys: up and down move, OK picks and closes, back closes and nothing changes."
    >
      <rect className="sk-screen" x={0.75} y={0.75} width={958.5} height={538.5} />
      <rect className="sk-planned" x={48} y={27} width={864} height={486} />
      <T x={72} y={84} size={22} tone="strong" weight={600}>
        settings
      </T>
      {[
        ['Audio', 'Original', 186],
        ['Text size', 'medium', 248],
        ['Picture quality', 'automatic', 310],
        ['Sleep timer', 'off', 372],
      ].map(([label, value, y]) => (
        <g key={label as string}>
          <T x={72} y={(y as number) + 26} size={14} body>
            {label}
          </T>
          <TvSelect x={360} y={y as number} w={336} value={value as string} />
        </g>
      ))}
      <rect x={0} y={0} width={960} height={540} style={{ fill: 'var(--bg)', opacity: 0.62 }} />
      <T x={72} y={150} size={14} body tone="strong">
        Subtitles
      </T>
      <TvSelect x={360} y={124} w={336} value="English" />
      <TvList x={360} y={170} w={336} picked={1} focused={1} />

      <Key x={72} y={580}>
        ↑ ↓
      </Key>
      <T x={142} y={580} size={16} body>
        move
      </T>
      <Key x={232} y={580}>
        ok
      </Key>
      <T x={286} y={580} size={16} body>
        picks and closes
      </T>
      <Key x={472} y={580}>
        back
      </Key>
      <T x={546} y={580} size={16} body>
        closes, and nothing changes
      </T>
    </Wide>
  );
}

function ListCrop({ focused, label }: { focused: number; label: string }) {
  return (
    <Sketch w={360} h={300} label={label}>
      <T x={24} y={24} size={14} body tone="strong">
        Subtitles
      </T>
      <TvSelect x={24} y={34} w={312} value="English" />
      <TvList x={24} y={80} w={312} picked={1} focused={focused} />
    </Sketch>
  );
}

export function TvListPickedDo() {
  return <ListCrop focused={1} label="The subtitles list open on a TV, with the focus on English, the language that is set, which has the check." />;
}

export function TvListFirstDont() {
  return <ListCrop focused={0} label="The subtitles list open on a TV, with the focus on off, the first row, while the check is on English, the second." />;
}

/** a field and a select at rest and focused on a tv: the ring inside, as on a row. */
export function TvFieldFocus() {
  // a focused field grows by 2% around its centre, like a row.
  const gw = 216 * 1.02;
  const gh = 42 * 1.02;
  const dx = (gw - 216) / 2;
  const dy = (gh - 42) / 2;
  const col = (x: number, focused: boolean) => (
    <g>
      <T x={x} y={30} size={12} tone="dim">
        {focused ? 'focused' : 'at rest'}
      </T>
      <T x={x} y={64} size={14} body tone={focused ? 'strong' : 'muted'}>
        Server address
      </T>
      {focused ? (
        <g>
          <FocusedSurface x={x - dx} y={74 - dy} w={gw} h={gh} />
          <T x={x + 16} y={100} size={14} tone="strong">
            media.example.com
          </T>
          <Ring x={x - dx} y={74 - dy} w={gw} h={gh} inside />
        </g>
      ) : (
        <g>
          <rect className="sk-input" x={x} y={74} width={216} height={42} />
          <T x={x + 16} y={100} size={14} tone="strong">
            media.example.com
          </T>
        </g>
      )}
      <T x={x} y={152} size={14} body tone={focused ? 'strong' : 'muted'}>
        Subtitles
      </T>
      <TvSelect x={x} y={162} w={216} value="English" focused={focused} />
    </g>
  );
  return (
    <Sketch
      w={520}
      h={220}
      label="A text field and a select on a TV, drawn to scale, at rest on the left and focused on the right. Focused, each draws the ring inside its own edge, in place of its border, turns to the lighter focused surface, grows by 2%, and its label turns brighter."
    >
      {col(32, false)}
      {col(280, true)}
    </Sketch>
  );
}

/* ---- the slider ------------------------------------------------------------------- */

/** a slider in the kit's scale: the track, the part up to the thumb in blue, and a square thumb. */
function Slider({ x, y, w, value, loaded, focused }: { x: number; y: number; w: number; value: number; loaded?: number; focused?: boolean }) {
  const tx = x + w * value;
  return (
    <g>
      <rect className="sk-track" x={x} y={y} width={w} height={4} style={{ fill: 'var(--border-control)' }} />
      {loaded ? <rect x={x} y={y} width={w * loaded} height={4} style={{ fill: 'var(--fg-dim)' }} /> : null}
      <rect className="sk-fill-info" x={x} y={y} width={w * value} height={4} />
      <rect x={tx - 5} y={y - 3} width={10} height={10} style={{ fill: 'var(--fg)' }} />
      {focused ? <rect className="sk-focus" x={x - 6} y={y - 9} width={w + 12} height={22} /> : null}
    </g>
  );
}

/** a speaker: a small square and its cone, as an icon placeholder. */
function Speaker({ x, y }: { x: number; y: number }) {
  return <path className="sk-icon" d={`M${x} ${y + 2.5} H${x + 2.5} L${x + 6} ${y} V${y + 8} L${x + 2.5} ${y + 5.5} H${x} Z`} />;
}

export function SliderKinds() {
  return (
    <Sketch
      h={156}
      label="Three sliders. The volume in a player: a speaker, a track filled in blue to 70%, a square thumb, and 70% in words. Where you are in a film: the time played, 0:42:10, a track filled in blue up to the thumb, a lighter part after it for what has loaded, and the length, 1:52:00. A value in a range in settings: Text size, the thumb a little left of the middle, and 120%."
    >
      <Word x={8} y={16} size="xs" tone="dim" mono={false}>
        How loud, in a player
      </Word>
      <Speaker x={8} y={27} />
      <Slider x={24} y={29} w={178} value={0.7} />
      <Word x={214} y={34} size="xs" tone="strong">
        70%
      </Word>

      <Word x={8} y={66} size="xs" tone="dim" mono={false}>
        Where you are, in a player
      </Word>
      <Word x={8} y={84} size="xs" tone="strong">
        0:42:10
      </Word>
      <Slider x={52} y={79} w={208} value={0.38} loaded={0.6} />
      <Word x={268} y={84} size="xs">
        1:52:00
      </Word>

      <Word x={8} y={116} size="xs" tone="dim" mono={false}>
        A value in a range, in settings
      </Word>
      <Word x={8} y={137} size="xs" tone="strong" mono={false}>
        Text size
      </Word>
      <Slider x={60} y={132} w={168} value={0.4} />
      <Word x={240} y={137} size="xs" tone="strong">
        120%
      </Word>
    </Sketch>
  );
}

export function SliderAnatomy() {
  return (
    <Sketch h={104} label="A slider, close up: 1 its label, Volume; 2 the track, the whole range; 3 the part up to the thumb, in blue; 4 the square thumb; 5 the value in words, 60%.">
      <Word x={48} y={30} size="sm" tone="strong" mono={false}>
        Volume
      </Word>
      <Slider x={48} y={48} w={200} value={0.6} />
      <Word x={262} y={53} size="sm" tone="strong">
        60%
      </Word>
      <Callout x={28} y={26} n={1} />
      <Pointer x1={34} y1={26} x2={44} y2={26} />
      <Callout x={220} y={84} n={2} />
      <Pointer x1={220} y1={78} x2={220} y2={53} />
      <Callout x={96} y={84} n={3} />
      <Pointer x1={96} y1={78} x2={96} y2={53} />
      <Callout x={168} y={24} n={4} />
      <Pointer x1={168} y1={30} x2={168} y2={43} />
      <Callout x={272} y={84} n={5} />
      <Pointer x1={272} y1={78} x2={272} y2={57} />
    </Sketch>
  );
}

export function SliderOwnRowDo() {
  return (
    <Sketch w={240} h={96} label="A player's controls on a TV: the seek bar on a row of its own, with the focus on it, above a row of three buttons. Left and right move the thumb; down goes to the buttons.">
      <rect className="sk-screen" x={1} y={1} width={238} height={94} />
      <Slider x={24} y={34} w={192} value={0.4} focused />
      <Word x={24} y={18} size="xs" tone="dim">
        ← → move the thumb
      </Word>
      {[94, 114, 134].map((x) => (
        <rect key={x} className="sk-button" x={x} y={62} width={12} height={12} />
      ))}
      <Word x={150} y={88} size="xs" tone="dim">
        ↓ to the buttons
      </Word>
    </Sketch>
  );
}

export function SliderInARowDont() {
  return (
    <Sketch w={240} h={96} label="A slider between two buttons in one row on a TV, with the focus on the slider. Pressing right moves the thumb, so the button to its right is never reached.">
      <rect className="sk-screen" x={1} y={1} width={238} height={94} />
      <rect className="sk-button" x={20} y={42} width={12} height={12} />
      <Slider x={52} y={46} w={128} value={0.5} focused />
      <rect className="sk-button" x={204} y={42} width={12} height={12} />
      <Word x={52} y={24} size="xs" tone="dim">
        → moves the thumb, not the focus
      </Word>
      <path className="sk-cross" d="M206 66 L214 74 M214 66 L206 74" />
    </Sketch>
  );
}

/* ---- the stepper ------------------------------------------------------------------ */

/** a stepper in the kit's scale: one frame, − at its start, the value, + at its end. */
function Stepper({ x, y, value, lowest }: { x: number; y: number; value: string; lowest?: boolean }) {
  const w = 120;
  const h = 22;
  return (
    <g>
      <rect className="sk-input" x={x} y={y} width={w} height={h} />
      <line className="sk-rule" x1={x + h} x2={x + h} y1={y} y2={y + h} />
      <line className="sk-rule" x1={x + w - h} x2={x + w - h} y1={y} y2={y + h} />
      <g className={lowest ? 'sk-faded' : undefined}>
        <line className="sk-icon" x1={x + 7} x2={x + h - 7} y1={y + h / 2} y2={y + h / 2} />
      </g>
      <line className="sk-icon" x1={x + w - h + 7} x2={x + w - 7} y1={y + h / 2} y2={y + h / 2} />
      <line className="sk-icon" x1={x + w - h / 2} x2={x + w - h / 2} y1={y + 7} y2={y + h - 7} />
      <Word x={x + w / 2} y={y + 14.5} size="sm" tone="strong" anchor="middle">
        {value}
      </Word>
    </g>
  );
}

export function StepperAnatomy() {
  return (
    <Sketch h={88} label="A stepper, close up: 1 its label, Countdown; 2 the minus, which takes a step down; 3 the value with its unit, 5 s; 4 the plus, a step up; 5 the hint with the range, From 1 to 15 seconds.">
      <Word x={100} y={24} size="sm" tone="strong" mono={false}>
        Countdown
      </Word>
      <Stepper x={100} y={34} value="5 s" />
      <Word x={100} y={72} size="xs" tone="dim" mono={false}>
        From 1 to 15 seconds
      </Word>
      <Callout x={78} y={20} n={1} />
      <Pointer x1={84} y1={20} x2={96} y2={20} />
      <Callout x={78} y={45} n={2} />
      <Pointer x1={84} y1={45} x2={100} y2={45} />
      <Callout x={176} y={12} n={3} />
      <Pointer x1={176} y1={18} x2={176} y2={34} />
      <Callout x={242} y={45} n={4} />
      <Pointer x1={236} y1={45} x2={220} y2={45} />
      <Callout x={242} y={70} n={5} />
      <Pointer x1={236} y1={70} x2={190} y2={70} />
    </Sketch>
  );
}

export function StepperStates() {
  return (
    <Sketch h={104} label="A stepper at its lowest value, 1 s, where the minus is dimmed and does nothing. And the same setting on a TV: one row, Countdown, with 5 s between two small arrows at its end; the row has the focus, with the ring inside its edge.">
      <Word x={8} y={16} size="xs" tone="dim" mono={false}>
        At its lowest
      </Word>
      <Word x={8} y={38} size="xs" tone="strong" mono={false}>
        Countdown
      </Word>
      <Stepper x={8} y={46} value="1 s" lowest />

      <Word x={164} y={16} size="xs" tone="dim" mono={false}>
        On a TV: one row
      </Word>
      <rect x={164} y={40} width={150} height={26} style={{ fill: 'var(--surface-focus)' }} />
      <rect className="sk-focus" x={165} y={41} width={148} height={24} style={{ strokeWidth: 2 }} />
      <Word x={174} y={56} size="xs" tone="strong" mono={false}>
        Countdown
      </Word>
      <Word x={304} y={56} size="xs" tone="strong" anchor="end">
        ‹ 5 s ›
      </Word>
      <Word x={164} y={86} size="xs" tone="dim">
        ← → change it · ↑ ↓ move on
      </Word>
    </Sketch>
  );
}

/* ---- the progress bar ---------------------------------------------------------- */

/** a progress bar in the kit's scale: the track, and the part that is done in its state's colour. */
function Bar({ x, y, w, value, tone = 'info' }: { x: number; y: number; w: number; value: number; tone?: 'info' | 'neutral' | 'err' }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={4} style={{ fill: 'var(--border-2)' }} />
      <rect className={`sk-fill-${tone}`} x={x} y={y} width={w * value} height={4} />
    </g>
  );
}

export function ProgressAnatomy() {
  return (
    <Sketch h={100} label="A progress bar, close up: 1 what is under way, Copying 3 files; 2 the bar, filled in blue to 62%; 3 the value in words, 62% · 1.4 of 2.2 gb; 4 cancel, a quiet button at the end of the first line.">
      <Word x={40} y={26} size="sm" tone="strong" mono={false}>
        Copying 3 files
      </Word>
      <Word x={280} y={26} size="xs" tone="strong" anchor="end">
        cancel
      </Word>
      <Bar x={40} y={36} w={240} value={0.62} />
      <Word x={40} y={56} size="xs" tone="strong">
        62% · 1.4 of 2.2 gb
      </Word>
      <Callout x={20} y={22} n={1} />
      <Pointer x1={26} y1={22} x2={36} y2={22} />
      <Callout x={200} y={84} n={2} />
      <Pointer x1={200} y1={78} x2={200} y2={41} />
      <Callout x={80} y={84} n={3} />
      <Pointer x1={80} y1={78} x2={80} y2={60} />
      <Callout x={300} y={22} n={4} />
      <Pointer x1={294} y1={22} x2={284} y2={22} />
    </Sketch>
  );
}

export function ProgressStates() {
  const row = (y: number, name: string, body: ReactNode) => (
    <g>
      <Word x={8} y={y + 7} size="xs" tone="dim" mono={false}>
        {name}
      </Word>
      {body}
    </g>
  );
  return (
    <Sketch
      h={152}
      label="One copy in four states. Under way: the bar in blue at 62%, with 62% · 1.4 of 2.2 gb. Paused: the bar in grey where it stopped, with paused · 62%. Failed: the bar in red where it stopped, the error's cross and Couldn't finish: the disk is full, and try again. Done: no bar, a green check and copied · 2.2 gb."
    >
      {row(
        10,
        'Under way',
        <g>
          <Bar x={84} y={10} w={220} value={0.62} />
          <Word x={84} y={28} size="xs" tone="strong">
            62% · 1.4 of 2.2 gb
          </Word>
        </g>,
      )}
      {row(
        50,
        'Paused',
        <g>
          <Bar x={84} y={50} w={220} value={0.62} tone="neutral" />
          <Glyph x={84} y={62} tone="neutral" />
          <Word x={95} y={68} size="xs" tone="strong">
            paused · 62%
          </Word>
        </g>,
      )}
      {row(
        90,
        'Failed',
        <g>
          <Bar x={84} y={90} w={220} value={0.62} tone="err" />
          <Glyph x={84} y={102} tone="err" />
          <Word x={95} y={108} size="xs" tone="strong" mono={false}>
            Couldn&apos;t finish: the disk is full.
          </Word>
          <LabelButton x={252} y={100} text="try again" />
        </g>,
      )}
      {row(
        130,
        'Done',
        <g>
          <Glyph x={84} y={130} tone="ok" />
          <Word x={95} y={136} size="xs" tone="strong">
            copied · 2.2 gb
          </Word>
        </g>,
      )}
    </Sketch>
  );
}

export function ProgressFailedDo() {
  return (
    <Sketch w={240} h={72} label="A copy that failed: the bar stays at 62% in red, with the error's cross, Couldn't finish: the disk is full, and a try again button.">
      <Word x={16} y={16} size="xs" tone="strong" mono={false}>
        Copying 3 files
      </Word>
      <Bar x={16} y={24} w={208} value={0.62} tone="err" />
      <Glyph x={16} y={37} tone="err" />
      <Word x={27} y={43} size="xs" tone="strong" mono={false}>
        Couldn&apos;t finish: the disk is full.
      </Word>
      <LabelButton x={16} y={52} text="try again" />
    </Sketch>
  );
}

export function ProgressFailedDont() {
  return (
    <Sketch w={240} h={72} label="A copy that failed, still drawn as a blue bar at 62% with 62% under it, and nothing that says it stopped.">
      <Word x={16} y={16} size="xs" tone="strong" mono={false}>
        Copying 3 files
      </Word>
      <Bar x={16} y={24} w={208} value={0.62} />
      <Word x={16} y={43} size="xs" tone="strong">
        62% · 1.4 of 2.2 gb
      </Word>
    </Sketch>
  );
}

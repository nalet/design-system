// the sketch kit: storyboard drawings for principles and patterns. a sketch
// shows the idea, not the component — frames, placeholder lines for text, one
// blue accent for what matters, and a state colour only where it means
// something. words appear only where they carry the point. every sketch says
// in its label what it shows, for people who can't see it.
import type { ReactNode } from 'react';

export type Tone = 'ok' | 'warn' | 'err' | 'info' | 'neutral';

export function Sketch({ w = 320, h = 200, label, children }: { w?: number; h?: number; label: string; children: ReactNode }) {
  return (
    <svg className="ds-sketch" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label}>
      {children}
    </svg>
  );
}

/** a screen: a frame, with a top bar unless `bar={false}`. */
export function Screen({ x = 1, y = 1, w = 318, h = 198, bar = true }: { x?: number; y?: number; w?: number; h?: number; bar?: boolean }) {
  return (
    <g>
      <rect className="sk-screen" x={x} y={y} width={w} height={h} />
      {bar ? <rect className="sk-bar" x={x} y={y} width={w} height={16} /> : null}
      {bar ? <line className="sk-rule" x1={x} x2={x + w} y1={y + 16} y2={y + 16} /> : null}
    </g>
  );
}

/** the brand chevron, small, as in a top bar. */
export function Chevron({ x, y, s = 7 }: { x: number; y: number; s?: number }) {
  return <path className="sk-chevron" d={`M${x} ${y} L${x + s / 2} ${y + s / 2} L${x} ${y + s}`} />;
}

/** a line of text, drawn as a bar. */
export function Line({ x, y, w, strong, tone }: { x: number; y: number; w: number; strong?: boolean; tone?: Tone }) {
  const cls = tone ? `sk-fill-${tone}` : strong ? 'sk-text sk-text--strong' : 'sk-text';
  return <rect className={cls} x={x} y={y} width={w} height={4} />;
}

/** a few lines of text: a paragraph. */
export function Para({ x, y, w, n = 3 }: { x: number; y: number; w: number; n?: number }) {
  const widths = [1, 0.92, 0.7, 0.85, 0.6];
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <Line key={i} x={x} y={y + i * 8} w={w * widths[i % widths.length]} />
      ))}
    </g>
  );
}

/**
 * a status: a small square in its state colour, and optionally a word. with
 * `glyph`, the square becomes the state's own shape, as the real status has.
 */
export function Status({ x, y, tone, text, glyph }: { x: number; y: number; tone: Tone; text?: string; glyph?: boolean }) {
  return (
    <g>
      {glyph ? <Glyph x={x} y={y - 0.5} tone={tone} /> : <rect className={`sk-fill-${tone}`} x={x} y={y} width={5} height={5} />}
      {text ? (
        <text className={`sk-word sk-word--${tone}`} x={x + 9} y={y + 5}>
          {text}
        </text>
      ) : null}
    </g>
  );
}

/** a button: filled blue when it is the emphasized one, outlined otherwise. */
export function Button({ x, y, w = 36, primary }: { x: number; y: number; w?: number; primary?: boolean }) {
  return <rect className={primary ? 'sk-button sk-button--primary' : 'sk-button'} x={x} y={y} width={w} height={11} />;
}

/** a row's quiet menu: three dots. */
export function Dots({ x, y }: { x: number; y: number }) {
  return (
    <g className="sk-dots">
      <rect x={x} y={y} width={2} height={2} />
      <rect x={x + 4} y={y} width={2} height={2} />
      <rect x={x + 8} y={y} width={2} height={2} />
    </g>
  );
}

/** a word that carries the point of the sketch. */
export function Word({
  x,
  y,
  children,
  size = 'sm',
  tone,
  mono = true,
  anchor,
}: {
  x: number;
  y: number;
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  tone?: Tone | 'accent' | 'strong' | 'dim' | 'inverse';
  mono?: boolean;
  anchor?: 'start' | 'middle' | 'end';
}) {
  const cls = ['sk-word', `sk-word--${size}`, tone ? `sk-word--${tone}` : '', mono ? '' : 'sk-word--body'].filter(Boolean).join(' ');
  return (
    <text className={cls} x={x} y={y} textAnchor={anchor}>
      {children}
    </text>
  );
}

/** a numbered marker for an anatomy: square, like every frame. */
export function Callout({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g className="sk-callout">
      <rect x={x - 6} y={y - 6} width={12} height={12} />
      <text x={x} y={y + 3} textAnchor="middle">
        {n}
      </text>
    </g>
  );
}

/** a thin connector from a callout to what it points at. */
export function Pointer({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line className="sk-pointer" x1={x1} y1={y1} x2={x2} y2={y2} />;
}

/** a placeholder picture: a poster, an avatar, an icon. */
export function Box({ x, y, w, h, accent }: { x: number; y: number; w: number; h: number; accent?: boolean }) {
  return <rect className={accent ? 'sk-box sk-box--accent' : 'sk-box'} x={x} y={y} width={w} height={h} />;
}

/** the selection or current-item marker: the accent bar on the leading edge. */
export function Marker({ x, y, h }: { x: number; y: number; h: number }) {
  return <rect className="sk-fill-info" x={x} y={y} width={2} height={h} />;
}

/* ---- added for the pattern pages ------------------------------------------ */

/**
 * the shape that goes with a state, so a status never rests on colour alone:
 * a dash, a bar and a dot, a check, a triangle, a cross. 6 units square.
 */
export function Glyph({ x, y, tone }: { x: number; y: number; tone: Tone }) {
  const cls = `sk-glyph sk-glyph--${tone}`;
  switch (tone) {
    case 'ok':
      return <path className={cls} d={`M${x} ${y + 3.2} L${x + 2.2} ${y + 5.4} L${x + 6} ${y + 0.8}`} />;
    case 'warn':
      return <path className={cls} d={`M${x + 3} ${y + 0.4} L${x + 6} ${y + 5.6} L${x} ${y + 5.6} Z`} />;
    case 'err':
      return <path className={cls} d={`M${x + 0.6} ${y + 0.6} L${x + 5.4} ${y + 5.4} M${x + 5.4} ${y + 0.6} L${x + 0.6} ${y + 5.4}`} />;
    case 'info':
      return (
        <g className={`sk-glyph-fill sk-glyph-fill--${tone}`}>
          <rect x={x + 2.2} y={y} width={1.6} height={1.6} />
          <rect x={x + 2.2} y={y + 2.4} width={1.6} height={3.6} />
        </g>
      );
    default:
      return <rect className={`sk-glyph-fill sk-glyph-fill--${tone}`} x={x} y={y + 2.3} width={6} height={1.6} />;
  }
}

/** a checkbox: empty, ticked, partly ticked (a dash), or one that can't be ticked. */
export function Checkbox({ x, y, state = 'off' }: { x: number; y: number; state?: 'off' | 'on' | 'mixed' | 'disabled' }) {
  if (state === 'on' || state === 'mixed') {
    return (
      <g>
        <rect className="sk-check sk-check--on" x={x} y={y} width={7} height={7} />
        {state === 'on' ? (
          <path className="sk-tick" d={`M${x + 1.5} ${y + 3.7} L${x + 3} ${y + 5.2} L${x + 5.6} ${y + 1.9}`} />
        ) : (
          <line className="sk-tick" x1={x + 1.7} x2={x + 5.3} y1={y + 3.5} y2={y + 3.5} />
        )}
      </g>
    );
  }
  return <rect className={state === 'disabled' ? 'sk-check sk-check--disabled' : 'sk-check'} x={x} y={y} width={7} height={7} />;
}

/** a switch: a square track and a square knob; on, it is blue with the knob at the end. */
export function Toggle({ x, y, on }: { x: number; y: number; on?: boolean }) {
  return (
    <g>
      <rect className={on ? 'sk-toggle sk-toggle--on' : 'sk-toggle'} x={x} y={y} width={14} height={8} />
      <rect className={on ? 'sk-knob sk-knob--on' : 'sk-knob'} x={on ? x + 8 : x + 2} y={y + 2} width={4} height={4} />
    </g>
  );
}

/** a box people type into; red when its value needs a fix. */
export function Input({ x, y, w, h = 11, invalid }: { x: number; y: number; w: number; h?: number; invalid?: boolean }) {
  return <rect className={invalid ? 'sk-input sk-input--err' : 'sk-input'} x={x} y={y} width={w} height={h} />;
}

/** a field: its label above, the box, a value in it, and the error under it when there is one. */
export function Field({
  x,
  y,
  w,
  label = 40,
  value,
  invalid,
}: {
  x: number;
  y: number;
  w: number;
  label?: number;
  value?: number;
  invalid?: boolean;
}) {
  return (
    <g>
      <Line x={x} y={y} w={label} strong />
      <Input x={x} y={y + 7} w={w} invalid={invalid} />
      {value ? <Line x={x + 4} y={y + 10.5} w={value} /> : null}
      {invalid ? <Line x={x} y={y + 22} w={Math.min(w, 70)} tone="err" /> : null}
    </g>
  );
}

/** the keyboard focus: a blue frame just outside what has it. */
export function FocusRing({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <rect className="sk-focus" x={x - 2} y={y - 2} width={w + 4} height={h + 4} />;
}

/**
 * a message strip: a frame tinted by its state, with a bar on its leading edge,
 * a line of text, and an optional quiet button at its end.
 */
export function Strip({
  x,
  y,
  w,
  tone,
  h = 16,
  text = 0.5,
  action,
}: {
  x: number;
  y: number;
  w: number;
  tone: Tone;
  h?: number;
  /** the text's length, as a share of the width. */
  text?: number;
  action?: boolean;
}) {
  return (
    <g>
      <rect className={`sk-strip sk-strip--${tone}`} x={x} y={y} width={w} height={h} />
      <rect className={`sk-fill-${tone}`} x={x} y={y} width={2} height={h} />
      <Glyph x={x + 7} y={y + h / 2 - 3} tone={tone} />
      <Line x={x + 18} y={y + h / 2 - 2} w={(w - 18) * text} strong />
      {action ? <Button x={x + w - 34} y={y + h / 2 - 5.5} w={28} /> : null}
    </g>
  );
}

/** a toast: a small frame that shows for a few seconds, with a bar in its state's colour, and one or two lines. */
export function Toast({ x, y, w = 96, tone = 'ok', lines }: { x: number; y: number; w?: number; tone?: Tone; lines?: string[] }) {
  const h = lines && lines.length > 1 ? 28 : 18;
  return (
    <g>
      <rect className="sk-toast" x={x} y={y} width={w} height={h} />
      <rect className={`sk-fill-${tone}`} x={x} y={y} width={2} height={h} />
      {lines ? (
        lines.map((l, i) => (
          <Word key={l} x={x + 8} y={y + 12 + i * 10} size="xs" tone="strong" mono={false}>
            {l}
          </Word>
        ))
      ) : (
        <Line x={x + 8} y={y + 7} w={w * 0.6} strong />
      )}
    </g>
  );
}

/** a button with its label: the emphasized one is filled blue. the label is monospace, lowercase. */
export function LabelButton({ x, y, text, primary, w }: { x: number; y: number; text: string; primary?: boolean; w?: number }) {
  const width = w ?? text.length * 5.1 + 12;
  return (
    <g>
      <Button x={x} y={y} w={width} primary={primary} />
      <Word x={x + width / 2} y={y + 8} size="xs" tone={primary ? 'inverse' : 'strong'} anchor="middle">
        {text}
      </Word>
    </g>
  );
}

/** a progress bar: the track, and the part that is done, in blue. */
export function Progress({ x, y, w, value }: { x: number; y: number; w: number; value: number }) {
  return (
    <g>
      <rect className="sk-track" x={x} y={y} width={w} height={4} />
      <rect className="sk-fill-info" x={x} y={y} width={w * value} height={4} />
    </g>
  );
}

/**
 * the loader, standing still: a faint square frame with three quarters of it
 * lit. the unlit side is the gap that runs round it.
 */
export function Loader({ x, y, s = 10 }: { x: number; y: number; s?: number }) {
  return (
    <g>
      <rect className="sk-loader-frame" x={x} y={y} width={s} height={s} />
      <path className="sk-loader" d={`M${x} ${y} H${x + s} V${y + s} H${x}`} />
    </g>
  );
}

/** a skeleton block: the shape of content that is on its way. */
export function Block({ x, y, w, h = 6 }: { x: number; y: number; w: number; h?: number }) {
  return <rect className="sk-skeleton" x={x} y={y} width={w} height={h} />;
}

/** a search field: a frame with a small square lens, and what has been typed. */
export function SearchField({ x, y, w, text, h = 12 }: { x: number; y: number; w: number; text?: string; h?: number }) {
  return (
    <g>
      <Input x={x} y={y} w={w} h={h} />
      <rect className="sk-lens" x={x + 4} y={y + h / 2 - 2.5} width={4} height={4} />
      <line className="sk-lens" x1={x + 8} y1={y + h / 2 + 1.5} x2={x + 9.5} y2={y + h / 2 + 3} />
      {text ? (
        <Word x={x + 14} y={y + h / 2 + 3} size="xs" tone="strong">
          {text}
        </Word>
      ) : (
        <Line x={x + 14} y={y + h / 2 - 1.5} w={Math.min(w * 0.45, 50)} />
      )}
    </g>
  );
}

/** the search folded into an icon, as in the shell bar on a phone: the square lens and its handle. */
export function SearchIcon({ x, y, s = 6 }: { x: number; y: number; s?: number }) {
  return (
    <g>
      <rect className="sk-lens" x={x} y={y} width={s} height={s} />
      <line className="sk-lens" x1={x + s} y1={y + s} x2={x + s * 1.45} y2={y + s * 1.45} />
    </g>
  );
}

/** an arrow from one step of a storyboard to the next. */
export function Arrow({ x1, y1, x2, y2, dashed }: { x1: number; y1: number; x2: number; y2: number; dashed?: boolean }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const head = 4.5;
  const p = (r: number, t: number) => `${x2 - head * Math.cos(a) + r * Math.cos(t)} ${y2 - head * Math.sin(a) + r * Math.sin(t)}`;
  return (
    <g>
      <line
        className={dashed ? 'sk-arrow sk-arrow--dashed' : 'sk-arrow'}
        x1={x1}
        y1={y1}
        x2={x2 - head * Math.cos(a)}
        y2={y2 - head * Math.sin(a)}
      />
      <path className="sk-arrow-head" d={`M${x2} ${y2} L${p(2.6, a + Math.PI / 2)} L${p(2.6, a - Math.PI / 2)} Z`} />
    </g>
  );
}

/** a small chip with a count or a word, as on a tile; `end` puts its right edge at x. */
export function Chip({ x, y, text, tone, end }: { x: number; y: number; text: string; tone?: Tone; end?: boolean }) {
  const w = text.length * 5.1 + 7;
  const left = end ? x - w : x;
  return (
    <g>
      <rect className={tone ? `sk-chip sk-chip--${tone}` : 'sk-chip'} x={left} y={y} width={w} height={10} />
      <Word x={left + w / 2} y={y + 7.4} size="xs" tone={tone ?? 'strong'} anchor="middle">
        {text}
      </Word>
    </g>
  );
}

/**
 * a launch tile, laid out as the real one: the icon, the name and a badge or a
 * dot along the top; under them a line about the app or, on a number tile, the
 * figure at the bottom. the name in words, or as a line of the given length.
 */
export function Tile({
  x,
  y,
  w = 72,
  h = 44,
  name,
  nameW = 30,
  desc = 1,
  icon = true,
  figure,
  figureTone,
  badge,
  badgeTone,
  dot,
  state,
  planned,
  fresh,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  name?: string;
  nameW?: number;
  /** how many lines of description: 0, 1 or 2. */
  desc?: number;
  icon?: boolean;
  /** a number tile's figure. */
  figure?: string;
  figureTone?: Tone;
  badge?: string;
  badgeTone?: Tone;
  /** the status dot's tone. */
  dot?: Tone;
  state?: 'focus' | 'current' | 'disabled' | 'hover';
  /** drawn dashed: a tile that isn't there yet. */
  planned?: boolean;
  /** outlined in blue: the tile the sketch is about, such as one that just arrived. */
  fresh?: boolean;
}) {
  const cls = planned
    ? 'sk-planned'
    : `sk-card${state === 'hover' || state === 'focus' ? ' sk-card--hover' : ''}${fresh ? ' sk-card--new' : ''}`;
  const nameX = icon ? x + 19 : x + 7;
  const nameEnd = nameX + (name ? name.length * 5.1 : nameW);
  const chipW = badge ? badge.length * 5.1 + 7 : 0;
  return (
    <g className={state === 'disabled' ? 'sk-faded' : undefined}>
      <rect className={cls} x={x} y={y} width={w} height={h} />
      {state === 'current' ? <Marker x={x} y={y} h={h} /> : null}
      {state === 'focus' ? <rect className="sk-focus" x={x + 0.75} y={y + 0.75} width={w - 1.5} height={h - 1.5} /> : null}
      {icon ? <rect className={planned ? 'sk-icon' : 'sk-icon sk-icon--accent'} x={x + 7} y={y + 7} width={8} height={8} /> : null}
      {name ? (
        <Word x={nameX} y={y + 14} size="xs" tone="strong">
          {name}
        </Word>
      ) : (
        <Line x={nameX} y={y + 9} w={nameW} strong />
      )}
      {state === 'focus' || state === 'hover' ? <Chevron x={nameEnd + 4} y={y + 8.5} s={5} /> : null}
      {badge ? <Chip x={x + w - 5} y={y + 5} text={badge} tone={badgeTone} end /> : null}
      {dot ? <rect className={`sk-fill-${dot}`} x={badge ? x + w - 13 - chipW : x + w - 11} y={y + 8} width={4} height={4} /> : null}
      {figure ? (
        <Word x={x + 7} y={y + h - 7} size="lg" tone={figureTone ?? 'strong'}>
          {figure}
        </Word>
      ) : null}
      {!figure && desc > 0 ? <Line x={x + 7} y={y + 23} w={w - 16} /> : null}
      {!figure && desc > 1 ? <Line x={x + 7} y={y + 31} w={(w - 16) * 0.6} /> : null}
    </g>
  );
}

/** a group's title, led by a small chevron, as on the home page. */
export function GroupTitle({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <g>
      <Chevron x={x} y={y - 5} s={5} />
      <Word x={x + 8} y={y} size="xs">
        {children}
      </Word>
    </g>
  );
}

/** the bell: notifications. */
export function Bell({ x, y }: { x: number; y: number }) {
  return (
    <g className="sk-bell">
      <path d={`M${x + 1} ${y + 7} H${x + 9} L${x + 8} ${y + 5.6} V${y + 3.6} C${x + 8} ${y + 1.8} ${x + 6.8} ${y + 0.6} ${x + 5} ${y + 0.6} C${x + 3.2} ${y + 0.6} ${x + 2} ${y + 1.8} ${x + 2} ${y + 3.6} V${y + 5.6} Z`} />
      <line x1={x + 4} x2={x + 6} y1={y + 8.8} y2={y + 8.8} />
    </g>
  );
}

/** a mouse pointer: where someone presses. */
export function Cursor({ x, y }: { x: number; y: number }) {
  return <path className="sk-cursor" d={`M${x} ${y} L${x} ${y + 10} L${x + 2.6} ${y + 7.6} L${x + 4.4} ${y + 11.4} L${x + 6} ${y + 10.6} L${x + 4.3} ${y + 7} L${x + 7.6} ${y + 7} Z`} />;
}

/** a cross over something that doesn't belong. */
export function Cross({ x, y, s = 8 }: { x: number; y: number; s?: number }) {
  return <path className="sk-cross" d={`M${x} ${y} L${x + s} ${y + s} M${x + s} ${y} L${x} ${y + s}`} />;
}

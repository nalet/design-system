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

/** a status: a small square in its state colour, and optionally a word. */
export function Status({ x, y, tone, text }: { x: number; y: number; tone: Tone; text?: string }) {
  return (
    <g>
      <rect className={`sk-fill-${tone}`} x={x} y={y} width={5} height={5} />
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
  tone?: Tone | 'accent' | 'strong' | 'dim';
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

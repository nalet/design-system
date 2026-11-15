import * as React from 'react';
import { cx } from '../../lib/cx';
import { useLanguage } from '../../lib/language';
import { rem } from '../../lib/rem';
import { StateGlyph, type State } from '../../lib/StateGlyph';
import '../../lib/a11y.css';
import './Toast.css';

export interface ToastOptions {
  /** The meaning, for the glyph. Default neutral. Errors belong in a banner, not a toast. */
  state?: State;
  /** Milliseconds on screen. Default 5000; hovering the toast pauses it. */
  duration?: number;
  /** Replace the toast with this ID instead of adding one (e.g. a repeated action). */
  id?: string;
}

export interface ToastItem {
  id: string;
  message: React.ReactNode;
  state: State;
  duration: number;
}

/** The edge of the screen the toasts appear at. */
export type ToastPlacement = 'bottom' | 'top';

// one store per copy of the library: toast() can be called from anywhere —
// event handlers, async code — and every mounted <Toaster /> renders it.
let items: ToastItem[] = [];
let counter = 0;
const listeners = new Set<() => void>();
const MAX_VISIBLE = 3;

// the screens that moved the toasts, in the order they opened: the last one
// still open decides, so the toasts go back when it closes.
interface Move {
  /** the screen that asked: one object for as long as it is open. */
  screen: object;
  placement: ToastPlacement;
  offset: number;
}
let moves: Move[] = [];

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function snapshot() {
  return items;
}

function moveSnapshot(): Move | undefined {
  return moves[moves.length - 1];
}

/**
 * toast — transient feedback after an action: "8 episodes queued". It never
 * takes focus, is announced politely, and leaves on its own. Returns the ID.
 * Render one <Toaster /> near the app root.
 */
export function toast(message: React.ReactNode, options: ToastOptions = {}): string {
  const id = options.id ?? `nc-toast-${++counter}`;
  const item: ToastItem = {
    id,
    message,
    state: options.state ?? 'neutral',
    duration: options.duration ?? 5000,
  };
  if (listeners.size === 0 && typeof console !== 'undefined') {
    console.warn('toast(): no <Toaster /> is mounted, so the message is not shown.');
  }
  const without = items.filter((t) => t.id !== id);
  items = [...without, item].slice(-MAX_VISIBLE);
  emit();
  return id;
}

/** Remove one toast now. */
toast.dismiss = (id: string): void => {
  items = items.filter((t) => t.id !== id);
  emit();
};

/** Remove every toast now. */
toast.clear = (): void => {
  items = [];
  emit();
};

/**
 * useToastPlacement — a screen moves the toasts while it is open: every toast,
 * in every toaster, appears at this edge until the screen closes, and then
 * where it appeared before. For a screen whose foot is taken by something
 * people use the whole time, such as a player that fills the window:
 * `useToastPlacement('top')`. Without a placement (null), it moves nothing.
 *
 * `offset` is the height of a bar that stays at that edge while the screen is
 * open, in px at the usual text size; the toasts keep their distance from it.
 */
export function useToastPlacement(placement: ToastPlacement | null | undefined, offset = 0): void {
  const [screen] = React.useState<object>(() => ({}));
  // what the screen asks for now. it keeps its place among the open screens
  // when it asks for something else, so the one that opened last still decides.
  React.useEffect(() => {
    const at = moves.findIndex((m) => m.screen === screen);
    if (!placement) {
      if (at < 0) return;
      moves = moves.filter((m) => m.screen !== screen);
    } else {
      const move: Move = { screen, placement, offset };
      moves = at < 0 ? [...moves, move] : moves.map((m) => (m.screen === screen ? move : m));
    }
    emit();
  }, [screen, placement, offset]);
  // the screen closes: the toasts are back where they were.
  React.useEffect(
    () => () => {
      if (!moves.some((m) => m.screen === screen)) return;
      moves = moves.filter((m) => m.screen !== screen);
      emit();
    },
    [screen],
  );
}

export interface ToasterProps {
  /** The region's accessible name. Default "notifications", in the page's language. */
  label?: string;
  /**
   * The edge the toasts appear at: `bottom` (the default) or `top`. A screen
   * that is open can move them for as long as it is, with `useToastPlacement`.
   */
  placement?: ToastPlacement;
  /**
   * The height of a bar that stays at that edge, such as a phone's tab bar at
   * the foot, in px at the usual text size. The toasts keep their distance
   * from the bar, not from the screen's edge. Default 0.
   */
  offset?: number;
  className?: string;
}

function ToastView({ item }: { item: ToastItem }) {
  const { words } = useLanguage();
  const [paused, setPaused] = React.useState(false);
  const remaining = React.useRef(item.duration);
  const startedAt = React.useRef(0);

  React.useEffect(() => {
    remaining.current = item.duration;
  }, [item]);

  React.useEffect(() => {
    if (paused) return;
    startedAt.current = Date.now();
    const t = window.setTimeout(() => toast.dismiss(item.id), remaining.current);
    return () => {
      window.clearTimeout(t);
      remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt.current));
    };
  }, [paused, item]);

  // a warning or an error says its state in words, for a screen reader: the
  // text is whole in the page's language, and the message takes its place in it.
  const spoken = item.state === 'warning' ? words.toast.warning : item.state === 'error' ? words.toast.error : null;
  const [before, after] = spoken != null ? spoken.split('{message}') : [];

  return (
    <li
      className={cx('nc-toast', `nc-toast--${item.state}`)}
      data-state={item.state}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span className="nc-toast__icon" aria-hidden="true">
        <StateGlyph state={item.state} />
      </span>
      <span className="nc-toast__text">
        {before ? <span className="nc-sr-only">{before}</span> : null}
        {item.message}
        {after ? <span className="nc-sr-only">{after}</span> : null}
      </span>
    </li>
  );
}

/**
 * Toaster — where toasts appear: bottom centre, above everything, at most three
 * at a time; top centre where `placement` or an open screen says so. The list
 * is a polite live region that exists before the first toast, so every
 * addition is announced once; nothing in it is focusable.
 */
export function Toaster({ label, placement = 'bottom', offset = 0, className }: ToasterProps) {
  const { words } = useLanguage();
  const list = React.useSyncExternalStore(subscribe, snapshot, snapshot);
  const moved = React.useSyncExternalStore(subscribe, moveSnapshot, moveSnapshot);
  const edge = moved?.placement ?? placement;
  const bar = moved ? moved.offset : offset;
  return (
    <section
      className={cx('nc-toaster', `nc-toaster--${edge}`, className)}
      data-placement={edge}
      aria-label={label ?? words.toast.region}
      style={bar > 0 ? ({ '--nc-toaster-bar': rem(bar) } as React.CSSProperties) : undefined}
    >
      <ol className="nc-toaster__list" aria-live="polite" aria-relevant="additions text">
        {list.map((t) => (
          <ToastView key={t.id} item={t} />
        ))}
      </ol>
    </section>
  );
}

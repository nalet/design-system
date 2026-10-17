import * as React from 'react';
import { cx } from '../../lib/cx';
import { StateGlyph, type ObjectState } from '../../lib/StateGlyph';
import '../../lib/a11y.css';
import './Toast.css';

export interface ToastOptions {
  /** the meaning, for the glyph. default neutral. errors belong in a message strip, not a toast. */
  state?: ObjectState;
  /** milliseconds on screen. default 5000; hovering the toast pauses it. */
  duration?: number;
  /** replace the toast with this id instead of adding one (e.g. a repeated action). */
  id?: string;
}

export interface ToastItem {
  id: string;
  message: React.ReactNode;
  state: ObjectState;
  duration: number;
}

// one store per copy of the library: toast() can be called from anywhere —
// event handlers, async code — and every mounted <Toaster /> renders it.
let items: ToastItem[] = [];
let counter = 0;
const listeners = new Set<() => void>();
const MAX_VISIBLE = 3;

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

/**
 * toast — transient feedback after an action: "8 episodes queued". it never
 * takes focus, is announced politely, and leaves on its own. returns the id.
 * render one <Toaster /> near the app root.
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

/** remove one toast now. */
toast.dismiss = (id: string): void => {
  items = items.filter((t) => t.id !== id);
  emit();
};

/** remove every toast now. */
toast.clear = (): void => {
  items = [];
  emit();
};

export interface ToasterProps {
  /** the region's accessible name. default "notifications". */
  label?: string;
  className?: string;
}

function ToastView({ item }: { item: ToastItem }) {
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
        {item.state === 'warning' || item.state === 'error' ? <span className="nc-sr-only">{item.state}: </span> : null}
        {item.message}
      </span>
    </li>
  );
}

/**
 * Toaster — where toasts appear: bottom centre, above everything, at most three
 * at a time. the list is a polite live region that exists before the first
 * toast, so every addition is announced once; nothing in it is focusable.
 */
export function Toaster({ label = 'notifications', className }: ToasterProps) {
  const list = React.useSyncExternalStore(subscribe, snapshot, snapshot);
  return (
    <section className={cx('nc-toaster', className)} aria-label={label}>
      <ol className="nc-toaster__list" aria-live="polite" aria-relevant="additions text">
        {list.map((t) => (
          <ToastView key={t.id} item={t} />
        ))}
      </ol>
    </section>
  );
}

import * as React from 'react';

/**
 * useElementWidth — the current content-box width of an element, tracked with
 * a ResizeObserver. Returns null until measured (and always in environments
 * without ResizeObserver, e.g. jsdom), so callers treat null as "wide".
 */
export function useElementWidth(ref: React.RefObject<HTMLElement | null>): number | null {
  const [width, setWidth] = React.useState<number | null>(null);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w != null) setWidth(Math.round(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return width;
}

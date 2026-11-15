import * as React from 'react';

/**
 * useElementWidth — the current content-box width of an element, tracked with
 * a ResizeObserver. Returns null until measured (and always in environments
 * without ResizeObserver, e.g. jsdom), so callers treat null as "wide".
 *
 * The width is in pixels at the usual text size, 16: where the reader's text
 * is larger, everything in the element is larger too, so the same room holds
 * less, and the width reported is smaller by that share. A component's
 * thresholds therefore stay the numbers on its page at every text size.
 */
export function useElementWidth(ref: React.RefObject<HTMLElement | null>): number | null {
  const [width, setWidth] = React.useState<number | null>(null);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w != null) setWidth(Math.round((w * 16) / rootTextSize()));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return width;
}

/** The page's text size in px: 16 unless the reader, or the page, set another. */
function rootTextSize(): number {
  const size = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return size > 0 ? size : 16;
}

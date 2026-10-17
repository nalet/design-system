import * as React from 'react';

/**
 * useOverflowX — whether an element's content is wider than the element, so it
 * scrolls sideways. Tracked with a ResizeObserver on the element and its first
 * child; false where ResizeObserver does not exist (jsdom).
 *
 * A region that scrolls must be reachable from the keyboard (WCAG 2.1.1): a
 * component makes its scroll frame focusable and named only while this is true.
 */
export function useOverflowX(ref: React.RefObject<HTMLElement | null>): boolean {
  const [overflowing, setOverflowing] = React.useState(false);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const check = () => setOverflowing(el.scrollWidth > el.clientWidth + 1);
    const ro = new ResizeObserver(check);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    check();
    return () => ro.disconnect();
  }, [ref]);
  return overflowing;
}

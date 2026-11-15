import * as React from 'react';
import { cx } from '../../lib/cx';
import { useLanguage } from '../../lib/language';
import { NavigationLink, useRovingLinks, type NavigateHandler, type NavigationItem } from '../../lib/navigation';
import './Rail.css';

export interface RailProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** The product's views, in their order: up to five, home first. */
  views: NavigationItem[];
  /**
   * The `href` of the current view, or of the item at the foot that is open.
   * Leave it out on a screen that belongs to none of them.
   */
  current?: string;
  /**
   * The screen is one inside the current view, such as one of the watchlist's
   * lists: the view is marked as current, not as the current page.
   */
  inside?: boolean;
  /** On a TV, what the top bar holds elsewhere, above the views: the person and the search. */
  head?: NavigationItem[];
  /** At the rail's foot, apart from the views: settings, and on a TV the notifications before it. */
  foot?: NavigationItem | NavigationItem[];
  /**
   * On a TV, the rail is open, with the names beside the icons, while the
   * focus is in it. Set this to keep it open or closed yourself.
   */
  open?: boolean;
  /**
   * Called when a link is pressed to open it here, before the browser follows
   * it: call `event.preventDefault()` and move there with your router.
   */
  onNavigate?: NavigateHandler;
  /** On a TV, called when → or back closes the rail, once the focus is back on what had it before. */
  onClose?: () => void;
  /** The landmark's name. Default "views", in the page's language. */
  label?: string;
}

const onTv = (el: Element) => el.closest('[data-nc-screen="tv"]') != null;

/**
 * Rail — a product's views as icons alone, one under the other, down the left
 * edge of the screen: links in a navigation landmark, the current one blue
 * with a bar on its left edge, all of them one tab stop. On a TV
 * (`data-nc-screen="tv"` on an ancestor) it opens over the page with the
 * views' names while the focus is in it.
 */
export const Rail = React.forwardRef<HTMLElement, RailProps>(function Rail(
  {
    views,
    current,
    inside = false,
    head,
    foot,
    open,
    onNavigate,
    onClose,
    label,
    className,
    onFocus,
    onBlur,
    onKeyDown,
    onPointerDown,
    ...rest
  },
  ref,
) {
  const { lang, words } = useLanguage();
  const headItems = head ?? [];
  const footItems = foot == null ? [] : Array.isArray(foot) ? foot : [foot];
  const items = [...headItems, ...views, ...footItems];
  const currentIndex = current == null ? -1 : items.findIndex((item) => item.href === current);
  // tab moves onto the current item, or onto the first view where none is current.
  const home = currentIndex >= 0 ? currentIndex : views.length ? headItems.length : 0;
  const navRef = React.useRef<HTMLElement>(null);
  React.useImperativeHandle(ref, () => navRef.current as HTMLElement);
  const roving = useRovingLinks(navRef, items.length, home, 'vertical');

  const [within, setWithin] = React.useState(false);
  // an item that goes away while it has the focus takes the focus out of the
  // rail without a blur: the rail closes then too.
  React.useLayoutEffect(() => {
    if (within && navRef.current && !navRef.current.contains(document.activeElement)) setWithin(false);
  });
  // what had the focus before it moved into the rail: where → and back put it again, on a tv.
  const cameFrom = React.useRef<HTMLElement | null>(null);
  const byPointer = React.useRef(false);

  React.useEffect(() => {
    if (views.length > 5 && typeof console !== 'undefined') {
      console.warn(`Rail: ${views.length} views; a rail holds up to five.`);
    }
  }, [views.length]);

  const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
    onFocus?.(e);
    const nav = e.currentTarget;
    const pointer = byPointer.current;
    byPointer.current = false;
    if (!nav.contains(e.relatedTarget as Node | null)) {
      cameFrom.current = e.relatedTarget instanceof HTMLElement ? e.relatedTarget : null;
      // on a tv, the focus moves into the rail on the current view, whichever
      // item the page's arrow keys reached first.
      if (!pointer && onTv(nav) && (e.target as Element).hasAttribute('data-nc-nav')) {
        const stop = nav.querySelector<HTMLElement>('[data-nc-nav][tabindex="0"]');
        if (stop && stop !== e.target) {
          stop.focus();
          return;
        }
      }
    }
    setWithin(true);
    roving.onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    onBlur?.(e);
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setWithin(false);
    roving.onBlur(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    byPointer.current = false;
    const tv = onTv(e.currentTarget);
    if (tv && (e.key === 'ArrowRight' || e.key === 'Escape' || e.key === 'GoBack' || e.key === 'BrowserBack')) {
      // → or back closes the rail: the focus goes back to the page, where it was.
      e.preventDefault();
      const back = cameFrom.current;
      if (back && back.isConnected) back.focus();
      onClose?.();
      return;
    }
    // on a tv the arrow keys stop at the first and the last item.
    roving.onKeyDown(e, !tv);
  };

  const group = (kind: 'head' | 'views' | 'foot', list: NavigationItem[], from: number) =>
    list.length ? (
      <ul className={`nc-rail__group nc-rail__group--${kind}`} role="list">
        {list.map((item, i) => (
          <li key={item.href} className="nc-rail__cell">
            <NavigationLink
              block="nc-rail"
              item={item}
              current={from + i === currentIndex}
              inside={inside}
              stop={from + i === roving.stop}
              lang={lang}
              onNavigate={onNavigate}
            />
          </li>
        ))}
      </ul>
    ) : null;

  return (
    <nav
      ref={navRef}
      className={cx('nc-rail', (open ?? within) && 'nc-rail--open', className)}
      aria-label={label ?? words.navigation.views}
      {...rest}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        // a press puts the focus where it lands; the flag lasts for the focus it causes.
        byPointer.current = true;
        setTimeout(() => {
          byPointer.current = false;
        }, 0);
      }}
    >
      <div className="nc-rail__panel">
        {group('head', headItems, 0)}
        {group('views', views, headItems.length)}
        {group('foot', footItems, headItems.length + views.length)}
      </div>
    </nav>
  );
});

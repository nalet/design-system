import * as React from 'react';
import { cx } from '../../lib/cx';
import { useLanguage } from '../../lib/language';
import { NavigationLink, useRovingLinks, type NavigateHandler, type NavigationItem } from '../../lib/navigation';
import './TabBar.css';

export interface TabBarProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** The product's views, in their order: up to five, home first. The same ones as in the rail. */
  views: NavigationItem[];
  /** The `href` of the current view. Leave it out on a screen that belongs to none of them. */
  current?: string;
  /**
   * The screen is one inside the current view, such as one of the watchlist's
   * lists: the view is marked as current, not as the current page.
   */
  inside?: boolean;
  /**
   * Called when a tab is pressed to open it here, before the browser follows
   * it: call `event.preventDefault()` and move there with your router.
   */
  onNavigate?: NavigateHandler;
  /** The landmark's name. Default "views", in the page's language. */
  label?: string;
}

/**
 * TabBar — a product's views as icons alone, side by side, at the foot of a
 * phone held upright: links in a navigation landmark, each an equal share of
 * the width, the current one blue with a bar on its top edge, all of them one
 * tab stop. It keeps clear of the strip the phone keeps at its foot.
 */
export const TabBar = React.forwardRef<HTMLElement, TabBarProps>(function TabBar(
  { views, current, inside = false, onNavigate, label, className, onFocus, onBlur, onKeyDown, ...rest },
  ref,
) {
  const { lang, words } = useLanguage();
  const currentIndex = current == null ? -1 : views.findIndex((item) => item.href === current);
  const roving = useRovingLinks(views.length, Math.max(currentIndex, 0), 'horizontal');

  React.useEffect(() => {
    if (views.length > 5 && typeof console !== 'undefined') {
      console.warn(`TabBar: ${views.length} views; a tab bar holds up to five.`);
    }
  }, [views.length]);

  return (
    <nav
      ref={ref}
      className={cx('nc-tabbar', className)}
      aria-label={label ?? words.navigation.views}
      {...rest}
      onFocus={(e) => {
        onFocus?.(e);
        roving.onFocus(e);
      }}
      onBlur={(e) => {
        onBlur?.(e);
        roving.onBlur(e);
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (!e.defaultPrevented) roving.onKeyDown(e, true);
      }}
    >
      <ul className="nc-tabbar__list" role="list">
        {views.map((item, i) => (
          <li key={item.href} className="nc-tabbar__cell">
            <NavigationLink
              block="nc-tabbar"
              item={item}
              current={i === currentIndex}
              inside={inside}
              stop={i === roving.stop}
              lang={lang}
              onNavigate={onNavigate}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
});

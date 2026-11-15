import * as React from 'react';
import { cx } from './cx';
import { formatCount } from './language';
import './a11y.css';

/**
 * navigation — what the rail and the tab bar share: a product's views as
 * links, each its icon alone, one of them current, and one tab stop for all
 * of them.
 */

/** One place in a product's main navigation: a view, or an item beside the views, such as settings. */
export interface NavigationItem {
  /** Its own address. The item is a link, so it opens in a new tab like any link. */
  href: string;
  /**
   * Its name, one word, as people name the place: "films". It is the link's
   * accessible name and its tooltip under a pointer, and the word beside the
   * icon in an open rail on a TV.
   */
  name: string;
  /** Its icon, at 24: `<Icon icon={Film} size={24} />`. Decoration: assistive technology skips it. */
  icon: React.ReactNode;
  /** What a screen reader says where it says more than the name: "notifications, 2 unread". Start it with the name. */
  label?: string;
  /** A count on the icon, such as the unread notifications. Shown above zero; say it in `label` too. */
  count?: number;
  /** The name is a person's own: beside its icon, it keeps its capitals and is set in the body face. */
  keepCase?: boolean;
}

/**
 * Called when a link of the navigation is pressed to open it here, before the
 * browser follows it. Call `event.preventDefault()` and move there with your
 * router. A press that opens the link elsewhere (a new tab, a new window)
 * doesn't call it.
 */
export type NavigateHandler = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => void;

/** A press that opens a link here: the main button, without a key that opens it elsewhere. */
export function opensHere(e: React.MouseEvent): boolean {
  return !e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

const LINK = '[data-nc-nav]';

function linksOf(nav: HTMLElement): HTMLElement[] {
  return Array.from(nav.querySelectorAll<HTMLElement>(LINK));
}

export interface RovingLinks {
  /** The index of the link that is the tab stop. */
  stop: number;
  onFocus: (e: React.FocusEvent<HTMLElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLElement>) => void;
  /** `wrap`: past the last link, go on at the first, and the other way round. */
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>, wrap: boolean) => void;
}

/**
 * useRovingLinks — one tab stop for all the links of a navigation. Tab moves
 * onto the link at `home`: the current one, or the first view. The arrow keys
 * of the navigation's direction, Home and End move between the links. The stop
 * follows the focus while it is inside, and is back at `home` once it leaves.
 */
export function useRovingLinks(total: number, home: number, direction: 'vertical' | 'horizontal'): RovingLinks {
  const [active, setActive] = React.useState<number | null>(null);
  const stop = active != null && active < total ? active : home;

  const onFocus = (e: React.FocusEvent<HTMLElement>) => {
    const link = (e.target as HTMLElement).closest<HTMLElement>(LINK);
    if (link) setActive(linksOf(e.currentTarget).indexOf(link));
  };

  const onBlur = (e: React.FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setActive(null);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>, wrap: boolean) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const back = direction === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const on = direction === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    if (e.key !== back && e.key !== on && e.key !== 'Home' && e.key !== 'End') return;
    const link = (e.target as HTMLElement).closest<HTMLElement>(LINK);
    const links = linksOf(e.currentTarget);
    const at = link ? links.indexOf(link) : -1;
    if (at < 0) return;
    e.preventDefault();
    const last = links.length - 1;
    let to: number;
    if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = last;
    else if (e.key === on) to = at < last ? at + 1 : wrap ? 0 : last;
    else to = at > 0 ? at - 1 : wrap ? last : 0;
    links[to]?.focus();
  };

  return { stop, onFocus, onBlur, onKeyDown };
}

interface NavigationLinkProps {
  /** The component's class: "nc-rail" or "nc-tabbar". */
  block: string;
  item: NavigationItem;
  current: boolean;
  /** The screen is one inside the current item, not the item itself. */
  inside: boolean;
  /** This link is the navigation's tab stop. */
  stop: boolean;
  lang: string;
  onNavigate?: NavigateHandler;
}

/**
 * NavigationLink — one item of the rail or the tab bar: a link whose icon is
 * decoration and whose name is text, hidden on screen until the component
 * shows it, and the link's tooltip.
 */
export function NavigationLink({ block, item, current, inside, stop, lang, onNavigate }: NavigationLinkProps) {
  const count = item.count != null && item.count > 0 ? item.count : null;
  return (
    <a
      className={cx(`${block}__item`, current && `${block}__item--current`)}
      href={item.href}
      title={item.name}
      aria-label={item.label}
      aria-current={current ? (inside ? 'true' : 'page') : undefined}
      tabIndex={stop ? 0 : -1}
      data-nc-nav=""
      onClick={(e) => {
        if (opensHere(e)) onNavigate?.(e, item.href);
      }}
    >
      <span className={`${block}__icon`} aria-hidden="true">
        {item.icon}
        {count != null ? <span className={`${block}__count`}>{formatCount(count, lang)}</span> : null}
      </span>
      <span className={cx('nc-sr-only', `${block}__name`, item.keepCase && `${block}__name--keep`)}>{item.name}</span>
    </a>
  );
}

// a product for watching films, for the rail's and the tab bar's stories: its
// views, what else its navigation holds, and the screens the stories draw
// around them. the screens are placeholders: the rail and the tab bar draw
// only the navigation.
import { useEffect, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { Bell, Bookmark, Download, Film, House, Search, Settings, Tv, type LucideIcon } from 'lucide-react';
import { Button, Icon, type NavigationItem, type RailMark } from '../../src';

// each view has its own address. the stories take every press over, so the
// page stays where it is; a press that opens a view in a new tab leads back here.
const item = (name: string, glyph: LucideIcon): NavigationItem => ({
  href: `?view=${name}`,
  name,
  icon: <Icon icon={glyph} size={24} />,
});

/** the views of a wide screen and a tv, home first. */
export const VIEWS: NavigationItem[] = [item('home', House), item('films', Film), item('series', Tv), item('watchlist', Bookmark)];
/** the phone's tabs: the same views, and downloads, which only a phone offers, last. */
export const TABS: NavigationItem[] = [...VIEWS, item('downloads', Download)];
export const SETTINGS: NavigationItem = item('settings', Settings);
export const SEARCH: NavigationItem = item('search', Search);
export const NOTIFICATIONS: NavigationItem = { ...item('notifications', Bell), count: 2, label: 'notifications, 2 unread' };

/** who is signed in: a square with their initials, where the avatar goes. */
export const PERSON: NavigationItem = {
  href: '?view=account',
  name: 'Alex Urban',
  keepCase: true,
  icon: (
    <span
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '1.5rem',
        height: '1.5rem',
        border: '1px solid var(--fg-muted)',
        background: 'var(--surface)',
        color: 'var(--fg)',
        fontFamily: 'var(--ff-mono)',
        fontSize: '0.75rem',
        fontWeight: 600,
        lineHeight: 1,
      }}
    >
      au
    </span>
  ),
};

export const MARK: RailMark = { href: '?view=home', product: 'video' };

/** the name of the item at an address, for the page's title. */
export const nameOf = (href: string | undefined, items: NavigationItem[]): string | undefined =>
  items.find((i) => i.href === href)?.name;

/**
 * the current view, kept by the story: a press on a link makes it the current
 * one, as an app's router would, and the page doesn't load.
 */
export function useCurrent(start: string | undefined) {
  const [current, setCurrent] = useState(start);
  useEffect(() => setCurrent(start), [start]);
  const onNavigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    setCurrent(href);
  };
  return { current, onNavigate };
}

const frame: CSSProperties = {
  boxSizing: 'border-box',
  position: 'relative',
  overflow: 'hidden',
  maxWidth: '100%',
  border: '1px solid var(--border-2)',
  background: 'var(--bg)',
};

const strip: CSSProperties = {
  flex: 'none',
  boxSizing: 'border-box',
  borderBottom: '1px solid var(--border)',
  background: 'var(--bg-2)',
};

/** the page of a view, as a placeholder: its title, and the shapes of what it holds. */
function Page({ title, shapes, children, style }: { title: ReactNode; shapes: number; children?: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ flex: '1 1 auto', minWidth: 0, minHeight: 0, overflow: 'hidden', padding: 'var(--s-5)', ...style }}>
      <p
        style={{
          margin: '0 0 var(--s-4)',
          color: 'var(--fg)',
          fontFamily: 'var(--ff-mono)',
          fontSize: '1.125rem',
          fontWeight: 600,
          lineHeight: 1.3,
          textTransform: 'lowercase',
        }}
      >
        {title}
      </p>
      {children}
      <div aria-hidden="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(5rem, 1fr))', gap: 'var(--s-3)' }}>
        {Array.from({ length: shapes }, (_, i) => (
          <div key={i} style={{ aspectRatio: '2 / 3', border: '1px solid var(--border)', background: 'var(--bg-2)' }} />
        ))}
      </div>
    </div>
  );
}

/** a wide screen: the rail down the left edge, and beside it the room of the top bar over the page. */
export function WideScreen({ rail, title }: { rail: ReactNode; title: ReactNode }) {
  return (
    <div style={{ ...frame, display: 'flex', width: '100%', height: '26rem' }}>
      {rail}
      <div style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div aria-hidden="true" style={{ ...strip, minHeight: '3.5rem' }} />
        <Page title={title} shapes={12} />
      </div>
    </div>
  );
}

/** a phone held upright, made for touch: the room of the top bar, the page, and the tab bar at the foot. */
export function PhoneUpright({ tabBar, title }: { tabBar: ReactNode; title: ReactNode }) {
  return (
    <div data-nc-screen="touch" style={{ ...frame, display: 'flex', flexDirection: 'column', width: '22.5rem', height: '32rem' }}>
      <div aria-hidden="true" style={{ ...strip, minHeight: '3.5rem' }} />
      <Page title={title} shapes={9} style={{ padding: 'var(--s-4)' }} />
      {tabBar}
    </div>
  );
}

/** the same phone held sideways: the rail at the left, and beside it a slimmer bar over the page. */
export function PhoneSideways({ rail, title }: { rail: ReactNode; title: ReactNode }) {
  return (
    <div data-nc-screen="touch" style={{ ...frame, display: 'flex', width: '40rem', height: '22.5rem' }}>
      {rail}
      <div style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div aria-hidden="true" style={{ ...strip, minHeight: '2.5rem' }} />
        <Page title={title} shapes={12} style={{ padding: 'var(--s-4)' }} />
      </div>
    </div>
  );
}

/**
 * the left part of a tv screen, a pixel for each of its 540 by 960 units: the
 * rail, and the page inside the safe area, with one thing that takes the focus.
 */
export function TvScreen({ rail, title }: { rail: ReactNode; title: ReactNode }) {
  return (
    <div data-nc-screen="tv" style={{ ...frame, display: 'flex', width: '60rem', height: '33.75rem' }}>
      {rail}
      <Page title={title} shapes={10} style={{ padding: '1.6875rem var(--s-7) 1.6875rem var(--s-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-4)', margin: '0 0 var(--s-5)' }}>
          <Button size="lg" variant="primary">
            play
          </Button>
          <span style={{ color: 'var(--fg-2)', fontFamily: 'var(--ff-ui)', fontSize: '1rem' }}>The Quiet Harbour</span>
        </div>
      </Page>
    </div>
  );
}

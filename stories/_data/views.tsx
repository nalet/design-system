// a product for watching films, for the rail's and the tab bar's stories: its
// views, what else its navigation holds, and the screens the stories draw
// around them. the pages are placeholders: the rail and the tab bar draw only
// the navigation.
import { useEffect, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { Bell, Bookmark, Download, Film, House, Search, Settings, Tv, type LucideIcon } from 'lucide-react';
import { Avatar, Button, Icon, KeepCase, TopBar, UserMenu, type NavigationItem } from '../../src';
import { PERSON as WHO } from './person';

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

/** who is signed in, at the head of a tv's rail: their avatar, and their name once the rail is open. */
export const PERSON: NavigationItem = {
  href: '?view=account',
  name: WHO.name,
  keepCase: true,
  icon: <Avatar name={WHO.name} size="sm" decorative />,
};

const FILMS = [
  { id: 'the-quiet-harbour', label: 'The Quiet Harbour', detail: '2019' },
  { id: 'down-east', label: 'Down East', detail: '2021' },
  { id: 'the-long-way-down', label: 'The Long Way Down', detail: '2016' },
];

// the title of the page at each address: a view's is its name.
const TITLES: Record<string, string> = {
  ...Object.fromEntries([...TABS, SETTINGS, SEARCH, NOTIFICATIONS].map((i) => [i.href, i.name])),
  '?view=account': 'account',
  '?view=help': 'help',
  '?view=signed-out': 'signed out',
};

export interface Where {
  /** the address of the screen, when it is a view's, or another page's of the product. */
  current: string | undefined;
  /** the page's title: the view's name, or the film's. */
  title: ReactNode;
  /** a press on a link: the story goes there, as an app's router would, and the page doesn't load. */
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
  go: (href: string) => void;
  /** a film's page, which opens from several views and belongs to none of them. */
  openFilm: (film: string) => void;
}

/** where the story's screen is. without a start, it is on a film's page. */
export function useWhere(start: string | undefined): Where {
  const at = (href: string | undefined) => (href ? { href } : { film: FILMS[0].label });
  const [where, setWhere] = useState<{ href?: string; film?: string }>(() => at(start));
  useEffect(() => setWhere(at(start)), [start]);
  return {
    current: where.href,
    title: where.film ? <KeepCase>{where.film}</KeepCase> : (TITLES[where.href ?? ''] ?? where.href),
    onNavigate: (event, href) => {
      event.preventDefault();
      setWhere({ href });
    },
    go: (href) => setWhere({ href }),
    openFilm: (film) => setWhere({ film }),
  };
}

const frame: CSSProperties = {
  boxSizing: 'border-box',
  position: 'relative',
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

/**
 * the product's top bar on a wide screen: its mark in the first cell, as wide
 * as the rail under it, then the search, and at the end the bell and the user
 * menu. what they open is a page of the product, which the story goes to.
 */
function Bar({ where }: { where: Where }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  return (
    <TopBar
      // the bar keeps the height its own lines ask for, in a screen that has a fixed one.
      style={{ flex: 'none' }}
      product="video"
      homeHref="?view=home"
      onHomeClick={(event) => where.onNavigate(event, '?view=home')}
      searchPlacement="start"
      search={{
        value: query,
        onChange: setQuery,
        label: 'search films',
        results: q
          ? [
              {
                results: FILMS.filter((f) => f.label.toLowerCase().includes(q)).map((f) => ({
                  ...f,
                  onSelect: () => {
                    setQuery('');
                    where.openFilm(f.label);
                  },
                })),
              },
            ]
          : [],
      }}
      unread={2}
      onNotifications={() => where.go(NOTIFICATIONS.href)}
      userMenu={
        <UserMenu
          name={WHO.name}
          email={WHO.email}
          items={[
            { id: 'account', label: 'account', onSelect: () => where.go('?view=account') },
            { id: 'settings', label: 'settings', onSelect: () => where.go(SETTINGS.href) },
            { id: 'help', label: 'help', onSelect: () => where.go('?view=help') },
          ]}
          onSignOut={() => where.go('?view=signed-out')}
        />
      }
    />
  );
}

/** a wide screen: the top bar across the whole width, and under it the rail beside the page. */
export function WideScreen({ where, rail }: { where: Where; rail: ReactNode }) {
  return (
    <div style={{ ...frame, display: 'flex', flexDirection: 'column', width: '100%', height: '26rem' }}>
      <Bar where={where} />
      <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex' }}>
        {rail}
        <Page title={where.title} shapes={12} />
      </div>
    </div>
  );
}

/** a phone held upright, made for touch: the room of the top bar, the page, and the tab bar at the foot. */
export function PhoneUpright({ where, tabBar }: { where: Where; tabBar: ReactNode }) {
  return (
    <div
      data-nc-screen="touch"
      style={{ ...frame, overflow: 'hidden', display: 'flex', flexDirection: 'column', width: '22.5rem', height: '32rem' }}
    >
      <div aria-hidden="true" style={{ ...strip, minHeight: '3.5rem' }} />
      <Page title={where.title} shapes={9} style={{ padding: 'var(--s-4)' }} />
      {tabBar}
    </div>
  );
}

/** the same phone held sideways: the rail at the left, and beside it the room of a slimmer bar over the page. */
export function PhoneSideways({ where, rail }: { where: Where; rail: ReactNode }) {
  return (
    <div data-nc-screen="touch" style={{ ...frame, overflow: 'hidden', display: 'flex', width: '40rem', height: '22.5rem' }}>
      {rail}
      <div style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div aria-hidden="true" style={{ ...strip, minHeight: '2.5rem' }} />
        <Page title={where.title} shapes={12} style={{ padding: 'var(--s-4)' }} />
      </div>
    </div>
  );
}

/**
 * the left part of a tv screen, a pixel for each of its 540 by 960 units: the
 * rail, and the page inside the safe area, with one thing that takes the focus.
 */
export function TvScreen({ where, rail }: { where: Where; rail: ReactNode }) {
  return (
    <div data-nc-screen="tv" style={{ ...frame, overflow: 'hidden', display: 'flex', width: '60rem', height: '33.75rem' }}>
      {rail}
      <Page title={where.title} shapes={10} style={{ padding: '1.6875rem var(--s-7) 1.6875rem var(--s-2)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--s-3) var(--s-4)', margin: '0 0 var(--s-5)' }}>
          <Button size="lg" variant="primary">
            play
          </Button>
          <span style={{ color: 'var(--fg-2)', fontFamily: 'var(--ff-ui)', fontSize: '1rem' }}>The Quiet Harbour</span>
        </div>
      </Page>
    </div>
  );
}

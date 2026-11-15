import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { Activity, BookOpen, Download, Inbox, ScrollText } from 'lucide-react';
import {
  Icon,
  Portal,
  Tile,
  TileGroup,
  TopBar,
  UserMenu,
  type TopBarProps,
  type TopBarResultGroup,
} from '../../src';

const meta: Meta<TopBarProps> = {
  title: 'Components/navigation/top bar',
  component: TopBar,
  args: {
    product: 'platform',
    app: 'downloads',
    searchPlacement: 'end',
    narrowBelow: 600,
    unread: 2,
  },
  argTypes: {
    searchPlacement: { control: 'inline-radio', options: ['end', 'start'] },
    narrowBelow: { control: 'number' },
    unread: { control: 'number' },
    app: { control: 'text' },
    // the stories hold the search's word and the app's answers themselves.
    search: { control: false },
    userMenu: { control: false },
    onNotifications: { control: false },
    onHomeClick: { control: false },
    children: { control: false },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The bar across the top of every screen: the product's name, the open app's name, the one search, the notifications bell and the user menu.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<TopBarProps>;

// what the stories' search finds: the apps first, then the things inside them.
const APPS = [
  { id: 'catalog', label: 'catalog', icon: BookOpen },
  { id: 'downloads', label: 'downloads', icon: Download },
  { id: 'requests', label: 'requests', icon: Inbox },
  { id: 'metrics', label: 'metrics', icon: Activity },
  { id: 'logs', label: 'logs', icon: ScrollText },
];
const DOWNLOADS = [
  { id: 'the-quiet-harbour', label: 'The Quiet Harbour', detail: 'queued' },
  { id: 'down-east', label: 'Down East', detail: 'done' },
  { id: 'the-long-way-down', label: 'The Long Way Down', detail: 'failed' },
];

function find(query: string, open: (what: string) => void): TopBarResultGroup[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const apps = APPS.filter((a) => a.label.includes(q));
  const downloads = DOWNLOADS.filter((d) => d.label.toLowerCase().includes(q));
  return [
    {
      title: 'apps',
      results: apps.map((a) => ({
        id: a.id,
        label: a.label,
        icon: <Icon icon={a.icon} />,
        onSelect: () => open(`the ${a.label} app`),
      })),
    },
    {
      title: 'in downloads',
      results: downloads.map((d) => ({ ...d, onSelect: () => open(d.label) })),
    },
  ].filter((group) => group.results.length > 0);
}

const frame: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  boxSizing: 'border-box',
  background: 'var(--bg)',
};
const page: CSSProperties = {
  flex: 1,
  padding: 'var(--s-5)',
  color: 'var(--fg-muted)',
  fontFamily: 'var(--ff-mono)',
  fontSize: '0.75rem',
};

/** a screen: the bar, and under it a page that says what the bar last reported. */
function Screen({
  bar,
  width,
  height = '18rem',
  screen,
  children,
}: {
  bar: (report: (what: string) => void) => ReactNode;
  /** the screen's width; without it, the room it is given. */
  width?: string;
  height?: string;
  screen?: 'touch' | 'tv';
  children?: (last: string) => ReactNode;
}) {
  const [last, setLast] = useState('nothing yet');
  return (
    <div data-nc-screen={screen} style={{ ...frame, maxWidth: width, minHeight: height }}>
      {bar(setLast)}
      {children ? (
        children(last)
      ) : (
        <div style={page} role="status">
          last: {last}
        </div>
      )}
    </div>
  );
}

/** the stories' bar: its search holds its own word, and the app's answers come from `find`. */
function Bar({
  report,
  list = true,
  menuOpen = false,
  query: givenQuery,
  onQuery,
  ...props
}: Partial<TopBarProps> & {
  report: (what: string) => void;
  /** the user menu open from the start. */
  menuOpen?: boolean;
  /** false: the page answers the search, as the home page does, and the bar shows no list. */
  list?: boolean;
  query?: string;
  onQuery?: (query: string) => void;
}) {
  const [ownQuery, setOwnQuery] = useState('');
  const query = givenQuery ?? ownQuery;
  const setQuery = onQuery ?? setOwnQuery;
  return (
    <TopBar
      product="platform"
      homeHref="#"
      search={{
        value: query,
        onChange: setQuery,
        label: 'search apps',
        results: list
          ? find(query, (what) => {
              setQuery('');
              report(`opened ${what}`);
            })
          : undefined,
      }}
      unread={2}
      onNotifications={() => report('the bell was pressed')}
      userMenu={
        <UserMenu
          name="Ada Urban"
          email="ada.urban@example.org"
          items={[
            { id: 'account', label: 'account', onSelect: () => report('account was chosen') },
            { id: 'settings', label: 'settings', onSelect: () => report('settings was chosen') },
            { id: 'help', label: 'help', onSelect: () => report('help was chosen') },
          ]}
          onSignOut={() => report('sign out was chosen')}
          defaultOpen={menuOpen}
        />
      }
      {...props}
    />
  );
}

export const Playground: Story = {
  render: (args) => <Screen bar={(report) => <Bar report={report} {...args} />} />,
};

export const OnTheHomePage: Story = {
  name: 'on the home page',
  render: function OnTheHomePage() {
    const [query, setQuery] = useState('');
    return (
      <Screen height="22rem" bar={(report) => <Bar report={report} list={false} query={query} onQuery={setQuery} />}>
        {() => (
          <div style={{ padding: 'var(--s-5)' }}>
            <Portal title="home" searchable={false} query={query}>
              <TileGroup legend="apps" minTileWidth="12rem">
                <Tile icon={BookOpen} title="catalog" description="Films and series" href="#" />
                <Tile icon={Download} title="downloads" description="3 in the queue" href="#" />
                <Tile icon={Inbox} title="requests" description="What people asked for" href="#" />
              </TileGroup>
              <TileGroup legend="operations" minTileWidth="12rem">
                <Tile icon={Activity} title="metrics" description="Load and storage" href="#" />
                <Tile icon={ScrollText} title="logs" description="Live tail across workers" href="#" />
              </TileGroup>
            </Portal>
          </div>
        )}
      </Screen>
    );
  },
};

export const SearchAtTheStart: Story = {
  name: 'search at the start',
  render: () => (
    <Screen bar={(report) => <Bar report={report} searchPlacement="start" />}>
      {(last) => (
        <div style={{ display: 'flex', flex: 1 }}>
          {/* where the product's rail of views stands: as wide as the mark above it. */}
          <div aria-hidden="true" style={{ flex: 'none', width: '5rem', borderRight: '1px solid var(--border)', background: 'var(--bg-2)' }} />
          <div style={page} role="status">
            last: {last}
          </div>
        </div>
      )}
    </Screen>
  ),
};

export const UserMenuOpen: Story = {
  name: 'the user menu open',
  render: () => <Screen bar={(report) => <Bar report={report} app="downloads" menuOpen />} />,
};

export const Narrow: Story = {
  name: 'a narrow bar',
  render: () => <Screen width="390px" bar={(report) => <Bar report={report} app="downloads" />} />,
};

const view: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '3.5rem',
  padding: '0 var(--s-3)',
  boxSizing: 'border-box',
  color: 'var(--fg-muted)',
  fontSize: '0.8125rem',
  fontWeight: 500,
  textDecoration: 'none',
};

export const OwnNavigation: Story = {
  name: "a product's own navigation",
  render: () => (
    <Screen
      bar={(report) => (
        <Bar report={report}>
          <nav aria-label="views" style={{ display: 'flex', marginLeft: 'var(--s-4)' }}>
            <a href="#" aria-current="page" style={{ ...view, color: 'var(--cloud-blue)', boxShadow: 'inset 0 -2px 0 var(--cloud-blue)' }}>
              home
            </a>
            <a href="#" style={view}>
              films
            </a>
            <a href="#" style={view}>
              series
            </a>
          </nav>
        </Bar>
      )}
    />
  ),
};

export const OnATouchScreen: Story = {
  name: 'on a touch screen',
  render: () => <Screen width="390px" height="22rem" screen="touch" bar={(report) => <Bar report={report} app="downloads" />} />,
};

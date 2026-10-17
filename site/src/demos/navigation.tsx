// static mock-ups for the navigation patterns. the shell bar, the user menu,
// the avatar, the side navigation and the app layout are planned components:
// these pictures are built from the components that exist, to show the
// proposal, and say so in their frame (see the Mock block).
import type { CSSProperties, ReactNode } from 'react';
import {
  Activity,
  TriangleAlert,
  Bell,
  Compass,
  Download,
  FolderSearch,
  CircleHelp,
  LogOut,
  Menu,
  Plug,
  Search,
  Settings,
  SlidersHorizontal,
  Tv,
  User,
  type LucideIcon,
} from 'lucide-react';
import {
  Badge,
  Button,
  Chevron,
  Divider,
  Icon,
  IconButton,
  MessageStrip,
  ObjectStatus,
  Stack,
  Text,
  type ObjectState,
} from '@nalet/design-system';

const mono = (size: number, weight = 600, color = 'var(--fg)'): CSSProperties => ({
  fontFamily: 'var(--ff-mono)',
  fontSize: size,
  fontWeight: weight,
  color,
});

const bar: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--s-3)',
  minHeight: 48,
  padding: '0 var(--s-3)',
  background: 'var(--bg-2)',
  borderBottom: '1px solid var(--border)',
  boxSizing: 'border-box',
  width: '100%',
  flexWrap: 'wrap',
};

/** the avatar: a square with the person's initials in mono. */
function AvatarMock({ initials = 'au', label = 'au, user menu' }: { initials?: string; label?: string }) {
  return (
    <IconButton label={label} size="sm" variant="default">
      <span style={mono(11, 600)}>{initials}</span>
    </IconButton>
  );
}

function Bellwith({ count }: { count?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--s-1)' }}>
      <IconButton label={count ? `notifications, ${count} unread` : 'notifications'} size="sm" variant="ghost">
        <Icon icon={Bell} size={14} />
      </IconButton>
      {count ? <Badge tone="blue">{count}</Badge> : null}
    </span>
  );
}

/** the shell bar as proposed: lockup and app title, search, notifications, one user menu. */
export function ShellBarMock({ app = 'backlog' }: { app?: string }) {
  return (
    <div style={bar} role="group" aria-label="shell bar, mock-up">
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--s-2)' }}>
        <Chevron size={16} aria-hidden />
        <span style={mono(14, 700)}>nalet</span>
        {app ? (
          <>
            <span aria-hidden="true" style={mono(14, 400, 'var(--fg-dim)')}>
              /
            </span>
            <span style={mono(14, 600, 'var(--fg-2)')}>{app}</span>
          </>
        ) : null}
      </span>
      <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 'var(--s-2)' }}>
        <IconButton label="search, planned" size="sm" variant="ghost">
          <Icon icon={Search} size={14} />
        </IconButton>
        <Bellwith count={2} />
        <AvatarMock />
      </span>
    </div>
  );
}

/** what the proposal replaces: an email badge and a separate sign-out button. */
export function ShellBarDontMock() {
  return (
    <div style={bar} role="group" aria-label="shell bar with an email badge and a sign-out button, mock-up">
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--s-2)' }}>
        <Chevron size={16} aria-hidden />
        <span style={mono(14, 700)}>nalet</span>
      </span>
      <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 'var(--s-2)' }}>
        <Bellwith />
        <Badge>email address</Badge>
        <Button size="sm">sign out</Button>
      </span>
    </div>
  );
}

const menuItem: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--s-2)',
  minHeight: 32,
  padding: '0 var(--s-3)',
  ...mono(12, 500, 'var(--fg-2)'),
};

function MenuRow({ icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div style={menuItem}>
      <Icon icon={icon} size={14} />
      {children}
    </div>
  );
}

/** the one user menu, opened: who is signed in, then account, settings, help and sign out last. */
export function UserMenuMock() {
  return (
    <div
      role="group"
      aria-label="user menu, open, mock-up"
      style={{ width: 240, maxWidth: '100%', background: 'var(--surface)', border: '1px solid var(--border-2)' }}
    >
      <div style={{ padding: 'var(--s-3)', display: 'grid', gap: 2 }}>
        <span style={mono(13, 600)}>A. User</span>
        <Text variant="muted">The person's email address</Text>
      </div>
      <Divider />
      <div style={{ padding: 'var(--s-1) 0' }}>
        <MenuRow icon={User}>account</MenuRow>
        <MenuRow icon={Settings}>settings</MenuRow>
        <MenuRow icon={CircleHelp}>help</MenuRow>
      </div>
      <Divider />
      <div style={{ padding: 'var(--s-1) 0' }}>
        <MenuRow icon={LogOut}>sign out</MenuRow>
      </div>
    </div>
  );
}

interface NavItem {
  label: string;
  icon: LucideIcon;
  count?: number;
  state?: ObjectState;
  current?: boolean;
  setup?: boolean;
}

interface NavGroupDef {
  title: string;
  items: NavItem[];
}

/** a downloads app, as the app navigation pattern lays it out. */
export const DOWNLOADS_NAV: NavGroupDef[] = [
  {
    title: 'work',
    items: [
      { label: 'needs attention', icon: TriangleAlert, count: 3, state: 'error', current: true },
      { label: 'on its way', icon: Download, count: 12 },
      { label: 'requests', icon: Tv },
      { label: 'missing', icon: Activity },
      { label: 'series', icon: Tv },
    ],
  },
  { title: 'find', items: [{ label: 'search', icon: Search }, { label: 'discover', icon: Compass }] },
  {
    title: 'setup',
    items: [
      { label: 'search sources', icon: FolderSearch },
      { label: 'clients', icon: Plug },
      { label: 'settings', icon: SlidersHorizontal },
    ],
  },
];

function NavRow({ item }: { item: NavItem }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--s-2)',
        minHeight: 32,
        padding: '0 var(--s-3)',
        background: item.current ? 'var(--surface-selected)' : undefined,
        boxShadow: item.current ? 'inset 2px 0 0 var(--cloud-blue)' : undefined,
        ...mono(12, item.current ? 700 : 500, item.current ? 'var(--fg)' : 'var(--fg-2)'),
      }}
    >
      <Icon icon={item.icon} size={14} />
      <span style={{ flex: 1, minWidth: 0 }}>{item.label}</span>
      {item.setup ? <ObjectStatus state="warning" appearance="text">needs setup</ObjectStatus> : null}
      {item.count != null ? (
        <span style={{ ...mono(11, 600, item.state === 'error' ? 'var(--state-error)' : 'var(--fg-muted)'), fontVariantNumeric: 'tabular-nums' }}>
          {item.count}
        </span>
      ) : null}
    </div>
  );
}

/** the side navigation: groups in order — work, find, setup — and one current item. */
export function SideNavMock({ groups = DOWNLOADS_NAV, width = 224 }: { groups?: NavGroupDef[]; width?: number }) {
  return (
    <div
      role="group"
      aria-label="side navigation, mock-up"
      style={{ width, flex: 'none', padding: 'var(--s-2) 0', background: 'var(--bg-2)', borderRight: '1px solid var(--border)' }}
    >
      {groups.map((g) => (
        <div key={g.title} style={{ padding: 'var(--s-2) 0' }}>
          <div style={{ padding: '0 var(--s-3) var(--s-1)', ...mono(11, 600, 'var(--fg-dim)'), letterSpacing: '0.04em' }}>{g.title}</div>
          {g.items.map((item) => (
            <NavRow key={item.label} item={item} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** the app layout: the shell bar, the app's side navigation, and its content. */
export function AppLayoutMock() {
  return (
    <div role="group" aria-label="app layout, mock-up" style={{ width: '100%', minWidth: 600, border: '1px solid var(--border)' }}>
      <ShellBarMock app="downloads" />
      <div style={{ display: 'flex', minHeight: 300 }}>
        <SideNavMock />
        <div style={{ flex: 1, minWidth: 0, padding: 'var(--s-4)', display: 'grid', alignContent: 'start', gap: 'var(--s-3)' }}>
          <span style={mono(18, 700)}>needs attention</span>
          <Text variant="muted">3 downloads failed or are blocked, and need a person.</Text>
          {['The Quiet Harbour · S04E07', 'The Quiet Harbour · S04E08', 'Copper Lantern · S01E02'].map((row) => (
            <div
              key={row}
              style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--s-2)', padding: 'var(--s-2) var(--s-3)', border: '1px solid var(--border)', background: 'var(--surface)' }}
            >
              <span style={mono(12, 500, 'var(--fg-2)')}>{row}</span>
              <ObjectStatus state="error">needs attention</ObjectStatus>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** at phone width: the navigation behind the app title, as a menu. */
export function PhoneNavMock() {
  return (
    <div role="group" aria-label="app navigation at phone width, mock-up" style={{ width: 320, maxWidth: '100%', border: '1px solid var(--border)' }}>
      <div style={bar}>
        <Chevron size={16} aria-hidden />
        <span style={mono(14, 600, 'var(--fg-2)')}>downloads</span>
        <span style={{ marginLeft: 'auto' }}>
          <IconButton label="downloads: views" size="sm" variant="default">
            <Icon icon={Menu} size={14} />
          </IconButton>
        </span>
      </div>
      <SideNavMock width={318} />
    </div>
  );
}

/** what app navigation replaces: nine tabs in one row, mixing work, finding and setup. */
export function NineTabsMock() {
  const tabs = ['needs attention', 'on its way', 'requests', 'missing', 'series', 'search', 'discover', 'search sources', 'clients'];
  return (
    <div role="group" aria-label="nine tabs in one row, mock-up" style={{ width: '100%', overflowX: 'auto', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', width: 'max-content' }}>
        {tabs.map((t, i) => (
          <span
            key={t}
            style={{
              padding: 'var(--s-2) var(--s-3)',
              borderBottom: i === 0 ? '2px solid var(--cloud-blue)' : '2px solid transparent',
              ...mono(12, 500, i === 0 ? 'var(--cloud-blue)' : 'var(--fg-muted)'),
              whiteSpace: 'nowrap',
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/** inside an app: its setup group marks what needs setup, and the landing view says it once. */
export function AppSetupMock() {
  const groups: NavGroupDef[] = [
    {
      title: 'work',
      items: [
        { label: 'needs attention', icon: TriangleAlert, current: true },
        { label: 'on its way', icon: Download },
      ],
    },
    {
      title: 'setup',
      items: [
        { label: 'search sources', icon: FolderSearch, setup: true },
        { label: 'clients', icon: Plug, setup: true },
        { label: 'settings', icon: SlidersHorizontal },
      ],
    },
  ];
  return (
    <div role="group" aria-label="an app that needs setup, mock-up" style={{ display: 'flex', width: '100%', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
      <SideNavMock groups={groups} width={240} />
      <div style={{ flex: '1 1 16rem', minWidth: 0, padding: 'var(--s-4)', display: 'grid', alignContent: 'start', gap: 'var(--s-3)' }}>
        <span style={mono(18, 700)}>needs attention</span>
        <MessageStrip state="warning" live="off" actions={<Button size="sm" variant="ghost">configure</Button>}>
          2 things to set up before it can work: search sources and clients.
        </MessageStrip>
      </div>
    </div>
  );
}

/** settings → addons: one row per app, its setup state, a one-line summary and "configure". */
export function SetupChecklist() {
  const rows: { app: string; state: ObjectState; text: string; summary: string }[] = [
    { app: 'downloads', state: 'warning', text: 'needs setup', summary: 'No search source yet · 2 download clients, 1 unreachable' },
    { app: 'library', state: 'success', text: 'ready', summary: '3 folders · checked today' },
    { app: 'subtitles', state: 'error', text: 'degraded', summary: 'Its connection to the library is down' },
  ];
  return (
    <div role="group" aria-label="settings, addons: each app's setup, mock-up" style={{ width: '100%', display: 'grid' }}>
      {rows.map((r, i) => (
        <div
          key={r.app}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 'var(--s-2) var(--s-4)',
            padding: 'var(--s-3)',
            border: '1px solid var(--border)',
            borderTop: i ? 0 : undefined,
            background: 'var(--surface)',
          }}
        >
          <span style={{ ...mono(13, 600), flex: '0 0 7rem' }}>{r.app}</span>
          <span style={{ flex: '0 0 8rem' }}>
            <ObjectStatus state={r.state}>{r.text}</ObjectStatus>
          </span>
          <span style={{ flex: '1 1 14rem', minWidth: 0 }}>
            <Text variant="muted">{r.summary}</Text>
          </span>
          <Button size="sm">configure</Button>
        </div>
      ))}
    </div>
  );
}

/** a stack of the setup mock-ups for the page's overview. */
export function SetupPlaces() {
  return (
    <Stack gap={16} style={{ width: '100%' }}>
      <SetupChecklist />
      <AppSetupMock />
    </Stack>
  );
}

import type { CSSProperties, ReactNode } from 'react';
import { AlertCircle, Ban, Check, Clock, Download, Home, Library, Pause, RefreshCw, Search, User, Wifi } from 'lucide-react';

/**
 * the phone patterns for watching (patterns/downloads-and-offline,
 * patterns/casting), drawn from the colour tokens: the download control in
 * each of its states, the storage line, and the bar while casting.
 */

const mono: CSSProperties = { fontFamily: 'var(--ff-mono)', fontSize: 12, fontWeight: 600 };
const body: CSSProperties = { fontFamily: 'var(--ff-ui)', fontSize: 13, lineHeight: 1.45, color: 'var(--fg-2)' };
const caption: CSSProperties = { fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--fg-muted)' };

function Control({ icon, iconColor, children, progress }: { icon: ReactNode; iconColor?: string; children: ReactNode; progress?: number }) {
  return (
    <span style={{ display: 'inline-grid', gap: 4, justifySelf: 'start' }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '7px 12px',
          background: 'var(--surface-2)',
          color: 'var(--fg-2)',
          ...mono,
        }}
      >
        <span style={{ display: 'inline-flex', color: iconColor ?? 'var(--fg-2)' }} aria-hidden="true">
          {icon}
        </span>
        {children}
      </span>
      {progress != null ? (
        <span style={{ height: 2, background: 'var(--border-2)' }}>
          <span style={{ display: 'block', height: 2, width: `${progress}%`, background: 'var(--cloud-blue)' }} />
        </span>
      ) : null}
    </span>
  );
}

const STATES: { state: string; control: ReactNode; note?: string }[] = [
  { state: 'not on the phone', control: <Control icon={<Download size={14} />}>download · 1.4 GB</Control> },
  { state: 'waiting its turn', control: <Control icon={<Clock size={14} />}>queued</Control> },
  { state: 'waiting for wi-fi', control: <Control icon={<Wifi size={14} />}>waiting for Wi-Fi</Control> },
  { state: 'on its way', control: <Control icon={<Download size={14} />} progress={42}>downloading 42%</Control> },
  {
    state: 'on the phone',
    control: (
      <Control icon={<Check size={14} />} iconColor="var(--state-success)">
        downloaded · 1.4 GB
      </Control>
    ),
  },
  {
    state: 'needs a check',
    control: (
      <Control icon={<RefreshCw size={14} />} iconColor="var(--fg-muted)">
        downloaded · check needed
      </Control>
    ),
    note: 'Downloads are checked with the server every 30 days. This one plays again once the server can be reached.',
  },
  {
    state: 'failed',
    control: (
      <Control icon={<AlertCircle size={14} />} iconColor="var(--state-error)">
        couldn't download
      </Control>
    ),
    note: 'Not enough space on this phone.',
  },
  {
    state: "can't come along",
    control: (
      <Control icon={<Ban size={14} />} iconColor="var(--fg-muted)">
        can't be downloaded
      </Control>
    ),
    note: 'This title can only be streamed.',
  },
];

/** the download control in each of its states, with the sentence a state adds. */
export function DownloadStates() {
  return (
    <div
      role="img"
      aria-label="The download control in eight states: download with the size, queued, waiting for Wi-Fi, downloading 42 percent with a bar, downloaded with the size, downloaded but needing a check with the reason, couldn't download with the reason, and can't be downloaded with the reason."
      style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: 'var(--s-5)', display: 'grid', gap: 'var(--s-4)' }}
    >
      {STATES.map(({ state, control, note }) => (
        <div key={state} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 130px) minmax(0, 1fr)', gap: 'var(--s-4)', alignItems: 'start' }}>
          <span style={{ ...caption, paddingTop: 8 }}>{state}</span>
          <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
            {control}
            {note ? <span style={body}>{note}</span> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

/** the one line at the top of the downloads screen. */
export function StorageLine() {
  return (
    <span style={{ display: 'block', margin: 'var(--s-3) 0', ...mono, fontWeight: 500, color: 'var(--fg-muted)' }}>
      12.4 GB used by downloads · 18 GB free on this phone
    </span>
  );
}

/** a phone screen while casting: the bar above the bottom navigation. */
export function MiniController() {
  const navIcon = { size: 18, color: 'var(--fg-muted)' };
  return (
    <div
      role="img"
      aria-label="A phone screen while casting: above the bottom navigation, a bar with the episode's picture, its title, playing on Living Room TV, and a pause button."
      style={{ width: '100%', maxWidth: 360, background: 'var(--bg)', border: '1px solid var(--border)', display: 'grid' }}
    >
      <div style={{ height: 120, background: 'var(--bg-2)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div style={{ width: 40, aspectRatio: '2 / 3', background: 'linear-gradient(160deg, hsl(205 42% 46%), hsl(245 38% 18%))', flex: 'none' }} />
        <div style={{ display: 'grid', gap: 2, minWidth: 0, flex: 1 }}>
          <span style={{ fontFamily: 'var(--ff-ui)', fontSize: 13, color: 'var(--fg)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            The Quiet Orchard · S01E03
          </span>
          <span style={{ fontFamily: 'var(--ff-ui)', fontSize: 12, color: 'var(--fg-muted)' }}>playing on Living Room TV</span>
        </div>
        <Pause size={20} color="var(--fg)" aria-hidden="true" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0', borderTop: '1px solid var(--border)' }}>
        <Home {...navIcon} aria-hidden="true" />
        <Search {...navIcon} aria-hidden="true" />
        <Library {...navIcon} aria-hidden="true" />
        <User {...navIcon} aria-hidden="true" />
      </div>
    </div>
  );
}

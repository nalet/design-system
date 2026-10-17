import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useRef, useState, type CSSProperties } from 'react';
import { RotateCw } from 'lucide-react';
import {
  Button,
  DataTable,
  DateCell,
  FilterBar,
  Icon,
  IconButton,
  IdentifierCell,
  Input,
  Select,
  StatusCell,
  Text,
  Toolbar,
  defineStates,
  tokens,
  type DataTableColumn,
} from '../../src';
// the same hook the data table, filter bar and toolbar measure themselves with.
import { useElementWidth } from '../../src/lib/useElementWidth';

/**
 * space and layout, rendered from the shipped tokens and components.
 * the scale is 4-base only: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64, resolved live
 * from the --s-* css custom properties.
 */

const meta: Meta = {
  title: 'Foundations/space & grid',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'the 4-base space scale, control heights, density, and how components respond to their own width.' } },
  },
};
export default meta;

type Story = StoryObj;

const label: CSSProperties = { fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg-muted)' };
const noop = () => undefined;

/** the eight steps, read from the typed tokens and drawn with the css variables. */
export const Scale: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)', width: '100%', maxWidth: 560 }}>
      {Object.entries(tokens.space).map(([key, px]) => (
        <div
          key={key}
          style={{ display: 'grid', gridTemplateColumns: '4rem 3rem minmax(0, 1fr)', alignItems: 'center', gap: 'var(--s-3)' }}
        >
          <span style={{ ...label, color: 'var(--fg)' }}>--{key}</span>
          <span style={label}>{px}</span>
          <span style={{ width: `var(--${key})`, height: 16, background: 'var(--cloud-blue)' }} />
        </div>
      ))}
    </div>
  ),
};

const SIZES = [
  { size: 'sm', px: 28, icon: 12 },
  { size: 'md', px: 34, icon: 16 },
  { size: 'lg', px: 42, icon: 20 },
] as const;

/** every control comes in the same three heights, so a row of them lines up. */
export const ControlHeights: Story = {
  name: 'control heights',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-4)', width: '100%' }}>
      {SIZES.map(({ size, px, icon }) => (
        <div key={size} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--s-2)' }}>
          <span style={{ ...label, width: '5rem' }}>
            {size} · {px}px
          </span>
          <div style={{ width: 220 }}>
            <Input inputSize={size} aria-label="host" placeholder="storage-01.example.com" />
          </div>
          <div style={{ width: 132 }}>
            <Select
              selectSize={size}
              aria-label="zone"
              options={[
                { label: 'zone a', value: 'a' },
                { label: 'zone b', value: 'b' },
              ]}
            />
          </div>
          <Button size={size}>check now</Button>
          <IconButton size={size} label="refresh">
            <Icon icon={RotateCw} size={icon} />
          </IconButton>
        </div>
      ))}
    </div>
  ),
};

type VolumeState = 'healthy' | 'degraded' | 'offline';

interface Volume {
  id: string;
  name: string;
  host: string;
  state: VolumeState;
  size: string;
  zone: string;
  checked: string;
}

const VOLUME_STATES = defineStates<VolumeState>({
  healthy: { state: 'success', text: 'healthy' },
  degraded: { state: 'warning', text: 'degraded' },
  offline: { state: 'error', text: 'offline' },
});

const DETAIL: Record<VolumeState, string> = {
  healthy: '',
  degraded: 'one disk is slow; reads still work',
  offline: 'not answering since 12 oct',
};

/** the fixed "today" of these examples, so relative dates never drift. */
const NOW = new Date('2026-10-17T12:00:00Z');

const VOLUMES: Volume[] = [
  { id: 'v1', name: 'storage-01', host: 'storage-01.example.com', state: 'healthy', size: '412 gb', zone: 'zone a', checked: '2026-10-17T02:00:00Z' },
  { id: 'v2', name: 'storage-02', host: 'storage-02.example.com', state: 'degraded', size: '1.2 tb', zone: 'zone a', checked: '2026-10-16T02:00:00Z' },
  { id: 'v3', name: 'storage-03', host: 'storage-03.example.com', state: 'healthy', size: '96 gb', zone: 'zone b', checked: '2026-10-17T02:00:00Z' },
  { id: 'v4', name: 'db-0', host: 'db-0.example.com', state: 'offline', size: '240 gb', zone: 'zone b', checked: '2026-10-12T02:00:00Z' },
  { id: 'v5', name: 'worker-2', host: 'worker-2.example.com', state: 'healthy', size: '64 gb', zone: 'zone c', checked: '2026-10-15T02:00:00Z' },
];

/** high (the default) always shows; low pops in at 720px and below, medium at 480px and below. */
const COLUMNS: DataTableColumn<Volume>[] = [
  { id: 'name', header: 'volume', cell: (v) => <IdentifierCell title={v.name} text={v.host} /> },
  { id: 'state', header: 'state', cell: (v) => <StatusCell {...VOLUME_STATES[v.state]} detail={DETAIL[v.state]} /> },
  { id: 'size', header: 'size', align: 'right', importance: 'medium', cell: (v) => <Text variant="code">{v.size}</Text> },
  { id: 'zone', header: 'zone', importance: 'low', cell: (v) => v.zone },
  { id: 'checked', header: 'last checked', importance: 'low', cell: (v) => <DateCell value={v.checked} now={NOW} /> },
];

/** the same rows at both densities. */
export const Density: Story = {
  name: 'density',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-5)', width: '100%' }}>
      <div style={{ display: 'grid', gap: 'var(--s-2)' }}>
        <span style={label}>default · cells 8px 12px</span>
        <DataTable<Volume> aria-label="volumes" columns={COLUMNS} rows={VOLUMES.slice(0, 3)} rowKey={(v) => v.id} stickyHeader={false} />
      </div>
      <div style={{ display: 'grid', gap: 'var(--s-2)' }}>
        <span style={label}>dense · cells 4px 8px</span>
        <DataTable<Volume> aria-label="volumes, dense" dense columns={COLUMNS} rows={VOLUMES.slice(0, 3)} rowKey={(v) => v.id} stickyHeader={false} />
      </div>
    </div>
  ),
};

function useVolumeFilters() {
  const [q, setQ] = useState('');
  const [state, setState] = useState('');
  const [zone, setZone] = useState('');
  const rows = useMemo(
    () =>
      VOLUMES.filter(
        (v) =>
          (!q || `${v.name} ${v.host}`.includes(q.trim().toLowerCase())) &&
          (!state || v.state === state) &&
          (!zone || v.zone === zone),
      ),
    [q, state, zone],
  );
  const filtered = !!(q || state || zone);
  return {
    rows,
    bar: {
      search: { value: q, onChange: setQ, placeholder: 'search volumes', label: 'search volumes' },
      filters: [
        {
          type: 'select' as const,
          id: 'state',
          label: 'state',
          value: state,
          onChange: setState,
          options: [
            { value: '', label: 'all' },
            { value: 'healthy', label: 'healthy' },
            { value: 'degraded', label: 'degraded' },
            { value: 'offline', label: 'offline' },
          ],
        },
        {
          type: 'select' as const,
          id: 'zone',
          label: 'zone',
          value: zone,
          onChange: setZone,
          options: [
            { value: '', label: 'any zone' },
            { value: 'zone a', label: 'zone a' },
            { value: 'zone b', label: 'zone b' },
            { value: 'zone c', label: 'zone c' },
          ],
        },
      ],
      resultCount: filtered ? `${rows.length} of ${VOLUMES.length}` : `${VOLUMES.length}`,
      onClearAll: () => {
        setQ('');
        setState('');
        setZone('');
      },
    },
  };
}

/**
 * a toolbar, a filter bar and a data table in one container. the slider sets the
 * container's width; each component measures its own width and changes on its own.
 */
export const Responsive: Story = {
  name: 'by their own width',
  render: function Responsive() {
    const [width, setWidth] = useState(960);
    const boxRef = useRef<HTMLDivElement>(null);
    const measured = useElementWidth(boxRef);
    const { rows, bar } = useVolumeFilters();
    return (
      <div style={{ display: 'grid', gap: 'var(--s-4)', width: '100%' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--s-3)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)', ...label, color: 'var(--fg-2)' }}>
            container width
            <input
              type="range"
              min={320}
              max={960}
              step={8}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              style={{ width: 240, accentColor: 'var(--cloud-blue)', colorScheme: 'dark' }}
            />
          </label>
          <span style={{ ...label, color: 'var(--fg)', fontVariantNumeric: 'tabular-nums' }}>{measured ?? width}px</span>
        </div>
        <div ref={boxRef} style={{ width, maxWidth: '100%', display: 'grid', gap: 'var(--s-3)' }}>
          <FilterBar {...bar} />
          <Toolbar
            label="volumes"
            heading={rows.length === 1 ? '1 volume' : `${rows.length} volumes`}
            actions={[
              { id: 'add', label: 'add volume', emphasized: true, onSelect: noop },
              { id: 'check', label: 'check all now', onSelect: noop },
              { id: 'export', label: 'export csv', onSelect: noop },
            ]}
          />
          <DataTable<Volume> aria-label="volumes" columns={COLUMNS} rows={rows} rowKey={(v) => v.id} stickyHeader={false} />
        </div>
      </div>
    );
  },
};

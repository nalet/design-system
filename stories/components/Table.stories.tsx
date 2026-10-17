import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Table,
  type TableProps,
  type TableColumn,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Stack,
} from '../../src';

interface Workload {
  name: string;
  status: string;
  cpu: string;
  restarts: number;
  labels: string[];
}

const workloads: Workload[] = [
  { name: 'api-7f9c', status: 'running', cpu: '0.42', restarts: 0, labels: ['http'] },
  { name: 'worker-2', status: 'running', cpu: '1.18', restarts: 2, labels: ['gpu', 'batch'] },
  { name: 'queue-44ae', status: 'restarting', cpu: '0.03', restarts: 7, labels: [] },
  { name: 'db-0', status: 'running', cpu: '0.61', restarts: 0, labels: ['stateful'] },
];

const columns: TableColumn<Workload>[] = [
  { key: 'name', header: 'workload' },
  { key: 'status', header: 'status' },
  { key: 'cpu', header: 'cpu (cores)', align: 'right' },
  { key: 'restarts', header: 'restarts', align: 'right' },
];

const meta: Meta<TableProps<Workload>> = {
  title: 'Components/data display/table',
  component: Table,
  args: {
    columns,
    rows: workloads,
    dense: false,
    empty: 'no workloads in this project',
  },
  argTypes: {
    columns: {
      control: false,
      description: 'The columns, in order: key, header, and optional render, align and width.',
    },
    rows: { control: 'object', description: 'The records, one per row. Empty shows the empty row.' },
    rowKey: { control: false },
    dense: { control: 'boolean' },
    empty: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A hairline-grid table for reading records: mono cells, lowercase mono headers, no zebra. Pass columns and rows, or build one from the primitives. For sorting, selection or keyboard navigation use the data table.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<TableProps<Workload>>;

export const Playground: Story = {
  render: (args) => <Table {...args} aria-label="workloads" />,
};

export const Basic: Story = {
  render: () => (
    <Table<Workload> aria-label="workloads" columns={columns} rows={workloads} rowKey={(r) => r.name} />
  ),
};

export const Dense: Story = {
  render: () => (
    <Table<Workload>
      aria-label="workloads"
      columns={columns}
      rows={workloads}
      rowKey={(r) => r.name}
      dense
    />
  ),
};

export const CustomCells: Story = {
  name: 'custom cells',
  render: () => {
    const cols: TableColumn<Workload>[] = [
      { key: 'name', header: 'workload' },
      {
        key: 'labels',
        header: 'labels',
        render: (r) =>
          r.labels.length ? (
            <Stack direction="horizontal" gap={4} wrap inline>
              {r.labels.map((l) => (
                <Badge key={l}>{l}</Badge>
              ))}
            </Stack>
          ) : (
            <span style={{ color: 'var(--fg-dim)' }}>none</span>
          ),
      },
      { key: 'cpu', header: 'cpu (cores)', align: 'right' },
      {
        key: 'restarts',
        header: 'restarts',
        align: 'right',
        render: (r) => (r.restarts > 0 ? `${r.restarts} in 24h` : '0'),
      },
    ];
    return <Table<Workload> aria-label="workloads" columns={cols} rows={workloads} rowKey={(r) => r.name} />;
  },
};

export const Empty: Story = {
  render: () => (
    <Table<Workload>
      aria-label="workloads"
      columns={columns}
      rows={[]}
      empty="no workloads in this project"
    />
  ),
};

interface Space {
  volume: string;
  used: number;
  free: number;
}

const space: Space[] = [
  { volume: 'storage-01', used: 412, free: 612 },
  { volume: 'storage-02', used: 96, free: 928 },
  { volume: 'storage-03', used: 780, free: 244 },
];

/** Hand-built from the primitives: a grouped header the columns API can't express. */
export const Primitives: Story = {
  name: 'primitives',
  render: () => (
    <div className="nc-table__scroll">
      <table className="nc-table" aria-label="space by volume">
        <Thead>
          <Tr>
            <Th scope="col" rowSpan={2}>
              volume
            </Th>
            <Th scope="col" colSpan={2} style={{ textAlign: 'center' }}>
              space (gb)
            </Th>
          </Tr>
          <Tr>
            <Th scope="col" style={{ textAlign: 'right' }}>
              used
            </Th>
            <Th scope="col" style={{ textAlign: 'right' }}>
              free
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {space.map((s) => (
            <Tr key={s.volume}>
              <Td>{s.volume}</Td>
              <Td style={{ textAlign: 'right' }}>{s.used}</Td>
              <Td style={{ textAlign: 'right' }}>{s.free}</Td>
            </Tr>
          ))}
        </Tbody>
      </table>
    </div>
  ),
};

interface Placement {
  name: string;
  node: string;
  cpu: string;
  memory: string;
  restarts: number;
  age: string;
  image: string;
}

const placements: Placement[] = [
  { name: 'api-7f9c', node: 'worker-1', cpu: '0.42', memory: '312', restarts: 0, age: '4d', image: 'registry.example.com/api:2.4.1' },
  { name: 'worker-2', node: 'worker-2', cpu: '1.18', memory: '2048', restarts: 2, age: '4d', image: 'registry.example.com/worker:2.4.1' },
  { name: 'db-0', node: 'worker-3', cpu: '0.61', memory: '4096', restarts: 0, age: '19d', image: 'registry.example.com/db:16.2' },
];

const placementColumns: TableColumn<Placement>[] = [
  { key: 'name', header: 'workload' },
  { key: 'node', header: 'node' },
  { key: 'cpu', header: 'cpu (cores)', align: 'right' },
  { key: 'memory', header: 'memory (mib)', align: 'right' },
  { key: 'restarts', header: 'restarts', align: 'right' },
  { key: 'age', header: 'age', align: 'right' },
  { key: 'image', header: 'image' },
];

/** Wider than its container: the frame scrolls sideways, the page doesn't. */
export const Overflow: Story = {
  name: 'overflow',
  render: () => (
    <div style={{ width: 360 }}>
      <Table<Placement>
        aria-label="placements"
        columns={placementColumns}
        rows={placements}
        rowKey={(r) => r.name}
      />
    </div>
  ),
};

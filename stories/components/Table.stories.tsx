import type { Meta, StoryObj } from '@storybook/react';
import { Table, type TableProps, type TableColumn, Badge } from '../../src';

interface Pod {
  name: string;
  status: string;
  cpu: string;
  restarts: number;
}

const pods: Pod[] = [
  { name: 'chino-api-7f9c', status: 'running', cpu: '0.42', restarts: 0 },
  { name: 'chino-stream-2b1d', status: 'running', cpu: '1.18', restarts: 2 },
  { name: 'arr-gateway-44ae', status: 'crashloop', cpu: '0.03', restarts: 7 },
  { name: 'postgres-0', status: 'running', cpu: '0.61', restarts: 0 },
];

const columns: TableColumn<Pod>[] = [
  { key: 'name', header: 'pod' },
  { key: 'status', header: 'status' },
  { key: 'cpu', header: 'cpu', align: 'right' },
  { key: 'restarts', header: 'restarts', align: 'right' },
];

const meta: Meta<TableProps<Pod>> = {
  title: 'Components/table',
  component: Table,
  args: {
    columns,
    rows: pods,
    dense: false,
  },
  argTypes: {
    dense: { control: 'boolean' },
    columns: { table: { disable: true } },
    rows: { table: { disable: true } },
    rowKey: { table: { disable: true } },
    empty: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'hairline-grid data table with mono headers; pass columns and rows, or render custom cells and a dense terminal layout.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<TableProps<Pod>>;

export const Playground: Story = {};

export const Basic: Story = {
  render: () => (
    <Table<Pod> columns={columns} rows={pods} rowKey={(r) => r.name} />
  ),
};

export const Dense: Story = {
  render: () => (
    <Table<Pod> columns={columns} rows={pods} rowKey={(r) => r.name} dense />
  ),
};

export const CustomCells: Story = {
  render: () => {
    const cols: TableColumn<Pod>[] = [
      { key: 'name', header: 'pod' },
      {
        key: 'status',
        header: 'status',
        render: (r) => (
          <Badge tone={r.status === 'running' ? 'green' : 'amber'} dot>
            {r.status}
          </Badge>
        ),
      },
      { key: 'cpu', header: 'cpu', align: 'right', render: (r) => `${r.cpu}` },
      { key: 'restarts', header: 'restarts', align: 'right' },
    ];
    return <Table<Pod> columns={cols} rows={pods} rowKey={(r) => r.name} />;
  },
};

export const Empty: Story = {
  render: () => (
    <Table<Pod> columns={columns} rows={[]} empty="no pods scheduled" />
  ),
};

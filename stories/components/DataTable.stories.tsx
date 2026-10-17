import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import {
  ActionMenu,
  Button,
  DataTable,
  IllustratedMessage,
  type DataTableColumn,
  type DataTableProps,
  type DataTableSort,
} from '../../src';
import { makeBacklog, code, type BacklogItem } from '../_data/backlog';
import { BACKLOG_COLUMNS, backlogGroup, backlogGroupLabel, onItsWay } from '../_data/status';

const ALL = makeBacklog();
const SERIES_40 = ALL.filter((b) => b.kind === 'series').slice(0, 40);

const meta: Meta<DataTableProps<BacklogItem>> = {
  title: 'Components/data display/data table',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'the interactive table: sorting, selection, grouping, growing, pop-in and a row-focus keyboard model.',
      },
    },
  },
  argTypes: {
    columns: { control: false },
    rows: { control: false },
    rowKey: { control: false },
    sort: { control: false },
    onSortChange: { control: false },
    selected: { control: false },
    onSelectionChange: { control: false },
    isRowSelectable: { control: false },
    rowLabel: { control: false },
    groupBy: { control: false },
    groupHeader: { control: false },
    groupAction: { control: false },
    collapsedGroups: { control: false },
    onCollapsedGroupsChange: { control: false },
    defaultCollapsedGroups: { control: false },
    formatGrowing: { control: false },
    onRowPress: { control: false },
    rowHighlight: { control: false },
    empty: { control: false },
    growingResetKey: { control: false },
    dense: { control: 'boolean' },
    loading: { control: 'boolean' },
    stickyHeader: { control: 'boolean' },
    growing: { control: 'number' },
  },
};
export default meta;

type Story = StoryObj<DataTableProps<BacklogItem>>;

const withActions = (onPick: (b: BacklogItem) => void): DataTableColumn<BacklogItem>[] => [
  ...BACKLOG_COLUMNS,
  {
    id: 'actions',
    header: <span className="nc-sr-only">actions</span>,
    align: 'right',
    width: 44,
    cell: (b) => (
      <ActionMenu
        label={`actions for ${b.kind === 'movie' ? b.title : code(b)}`}
        items={[
          { id: 'pick', label: 'pick a release', onSelect: () => onPick(b) },
          { id: 'grab', label: 'grab now', onSelect: () => onPick(b), disabled: onItsWay(b) },
        ]}
      />
    ),
  },
];

function useTable(rows: readonly BacklogItem[]) {
  const [sort, setSort] = useState<DataTableSort | null>({ columnId: 'aired', direction: 'descending' });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  return { sort, onSortChange: setSort, selected, onSelectionChange: setSelected, rows };
}

export const Playground: Story = {
  args: { dense: false, loading: false, stickyHeader: true },
  render: function Playground(args) {
    const t = useTable(SERIES_40);
    const [pressed, setPressed] = useState('');
    const columns = useMemo(() => withActions((b) => setPressed(`${b.title} ${code(b)}`)), []);
    return (
      <div style={{ display: 'grid', gap: 'var(--s-2)' }}>
        <DataTable<BacklogItem>
          {...args}
          aria-label="missing episodes"
          columns={columns}
          rowKey={(b) => b.id}
          rowLabel={code}
          selectable
          isRowSelectable={(b) => !onItsWay(b)}
          rowHighlight={(b) => (b.state === 'failed' ? 'error' : undefined)}
          {...t}
        />
        <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>
          {t.selected.size} selected{pressed ? ` · last action: ${pressed}` : ''}
        </span>
      </div>
    );
  },
};

export const Sorting: Story = {
  render: function Sorting() {
    const t = useTable(SERIES_40.slice(0, 12));
    return <DataTable<BacklogItem> aria-label="missing episodes" columns={BACKLOG_COLUMNS} rowKey={(b) => b.id} {...t} />;
  },
};

export const Selection: Story = {
  render: function Selection() {
    const t = useTable(SERIES_40.slice(0, 12));
    return (
      <DataTable<BacklogItem>
        aria-label="missing episodes"
        columns={BACKLOG_COLUMNS}
        rowKey={(b) => b.id}
        rowLabel={code}
        selectable
        isRowSelectable={(b) => !onItsWay(b)}
        {...t}
      />
    );
  },
};

export const Grouped: Story = {
  render: function Grouped() {
    const t = useTable(ALL.slice(0, 160));
    return (
      <DataTable<BacklogItem>
        aria-label="missing episodes"
        columns={BACKLOG_COLUMNS}
        rowKey={(b) => b.id}
        rowLabel={code}
        selectable
        groupBy={backlogGroup}
        groupHeader={(g) => backlogGroupLabel(g.key, g.rows.length)}
        groupAction={(g) => (
          <Button size="sm" variant="ghost" onClick={() => t.onSelectionChange(new Set([...t.selected, ...g.rows.map((b) => b.id)]))}>
            select all {g.rows.length}
          </Button>
        )}
        {...t}
      />
    );
  },
};

export const Growing: Story = {
  render: function Growing() {
    const t = useTable(ALL);
    return (
      <DataTable<BacklogItem>
        aria-label="missing episodes"
        columns={BACKLOG_COLUMNS}
        rowKey={(b) => b.id}
        rowLabel={code}
        selectable
        groupBy={backlogGroup}
        groupHeader={(g) => backlogGroupLabel(g.key, g.rows.length)}
        growing={100}
        {...t}
      />
    );
  },
};

export const PopIn: Story = {
  name: 'pop-in (narrow)',
  render: function PopIn() {
    const t = useTable(SERIES_40.slice(0, 10));
    return (
      <div style={{ width: 380 }}>
        <DataTable<BacklogItem>
          aria-label="missing episodes"
          columns={BACKLOG_COLUMNS}
          rowKey={(b) => b.id}
          rowLabel={code}
          selectable
          {...t}
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => (
    <DataTable<BacklogItem>
      aria-label="missing episodes"
      columns={BACKLOG_COLUMNS}
      rows={[]}
      rowKey={(b) => b.id}
      empty={<IllustratedMessage illustration="done" size="sm" title="nothing missing" description="every aired episode is in the library." headingLevel={3} />}
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <DataTable<BacklogItem> aria-label="missing episodes" columns={BACKLOG_COLUMNS} rows={SERIES_40.slice(0, 6)} rowKey={(b) => b.id} loading />
  ),
};

const THREE_THOUSAND = makeBacklog({ episodes: 2860, series: 120, movies: 140, seed: 11 });

/**
 * every row rendered at once — no growing — to measure the worst case. the a11y
 * panel is off here: axe over ~80,000 nodes takes seconds and would be measured
 * instead of the table. the same table is checked at 100 rows in "growing".
 */
export const ThreeThousandRows: Story = {
  name: '3,000 rows, grouped, no growing',
  parameters: { a11y: { disable: true } },
  render: function Large() {
    const t = useTable(THREE_THOUSAND);
    return (
      <DataTable<BacklogItem>
        aria-label="missing episodes"
        columns={BACKLOG_COLUMNS}
        rowKey={(b) => b.id}
        rowLabel={code}
        selectable
        groupBy={backlogGroup}
        groupHeader={(g) => backlogGroupLabel(g.key, g.rows.length)}
        {...t}
      />
    );
  },
};


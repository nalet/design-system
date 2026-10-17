// the data table's guideline examples that its stories don't cover: rows that
// open on press, a dense table, and the do and don't tables. their columns
// hold render functions, so they are written here, in react. small tables in a
// frame: their headers don't stick.
import { useState } from 'react';
import {
  ActionMenu,
  Button,
  DataTable,
  IdentifierCell,
  IllustratedMessage,
  StatusCell,
  type DataTableColumn,
} from '@nalet/design-system';
import { code, makeBacklog, type BacklogItem } from '@stories/_data/backlog';
import { BACKLOG_COLUMNS, BACKLOG_STATES } from '@stories/_data/status';

const SERIES = makeBacklog().filter((b) => b.kind === 'series');
const FIVE = SERIES.slice(0, 5);
const THREE = FIVE.slice(0, 3);
const MIXED = SERIES.slice(6, 9);

const EPISODE: DataTableColumn<BacklogItem> = { id: 'item', header: 'episode', cell: (b) => <IdentifierCell title={code(b)} /> };
const STATE: DataTableColumn<BacklogItem> = { id: 'state', header: 'state', cell: (b) => <StatusCell {...BACKLOG_STATES[b.state]} /> };

const MENU: DataTableColumn<BacklogItem> = {
  id: 'actions',
  header: <span className="nc-sr-only">actions</span>,
  align: 'right',
  width: 44,
  cell: (b) => (
    <ActionMenu
      label={`actions for ${code(b)}`}
      items={[
        { id: 'grab', label: 'grab now', onSelect: () => undefined },
        { id: 'search', label: 'search again', onSelect: () => undefined },
      ]}
    />
  ),
};

const BUTTONS: DataTableColumn<BacklogItem> = {
  id: 'actions',
  header: <span className="nc-sr-only">actions</span>,
  align: 'right',
  cell: () => (
    <span style={{ display: 'inline-flex', gap: 'var(--s-1)' }}>
      <Button size="sm">grab now</Button>
      <Button size="sm">search again</Button>
    </span>
  ),
};

const failed = (b: BacklogItem) => (b.state === 'failed' ? 'error' : undefined);

/** rows that open on press; the checkbox still selects. interactive: hydrate it. */
export function RowPress() {
  const [opened, setOpened] = useState('nothing yet');
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  return (
    <div style={{ display: 'grid', gap: 'var(--s-2)', width: '100%' }}>
      <DataTable<BacklogItem>
        aria-label="missing episodes that open on press"
        columns={BACKLOG_COLUMNS}
        rows={FIVE}
        rowKey={(b) => b.id}
        rowLabel={code}
        selectable
        selected={selected}
        onSelectionChange={setSelected}
        onRowPress={(b) => setOpened(code(b))}
        stickyHeader={false}
      />
      <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>
        opened: {opened} · {selected.size} selected
      </span>
    </div>
  );
}

/** the dense density. */
export function DenseTable() {
  return (
    <DataTable<BacklogItem>
      dense
      aria-label="missing episodes, dense"
      columns={BACKLOG_COLUMNS}
      rows={FIVE}
      rowKey={(b) => b.id}
      stickyHeader={false}
    />
  );
}

/** do: one action menu per row, named by the row. interactive: hydrate it. */
export function MenuPerRow() {
  return (
    <DataTable<BacklogItem>
      aria-label="missing episodes, with a menu per row"
      columns={[EPISODE, STATE, MENU]}
      rows={THREE}
      rowKey={(b) => b.id}
      stickyHeader={false}
    />
  );
}

/** don't: a row of buttons on every row. */
export function ButtonsPerRow() {
  return (
    <DataTable<BacklogItem>
      aria-label="missing episodes, with buttons per row"
      columns={[EPISODE, STATE, BUTTONS]}
      rows={THREE}
      rowKey={(b) => b.id}
      stickyHeader={false}
    />
  );
}

/** do: the state in words, and a highlight on the row that failed. */
export function StatesInWords() {
  return (
    <DataTable<BacklogItem>
      aria-label="missing episodes, with states"
      columns={[EPISODE, STATE]}
      rows={MIXED}
      rowKey={(b) => b.id}
      rowHighlight={failed}
      stickyHeader={false}
    />
  );
}

/** don't: the highlight with no words. */
export function ColourOnly() {
  return (
    <DataTable<BacklogItem>
      aria-label="missing episodes, colour only"
      columns={[EPISODE]}
      rows={MIXED}
      rowKey={(b) => b.id}
      rowHighlight={failed}
      stickyHeader={false}
    />
  );
}

/** do: an empty list says what is true. */
export function NothingMissing() {
  return (
    <DataTable<BacklogItem>
      aria-label="missing episodes, none"
      columns={[EPISODE, STATE]}
      rows={[]}
      rowKey={(b) => b.id}
      empty={
        <IllustratedMessage
          illustration="done"
          size="sm"
          headingLevel={3}
          title="nothing missing"
          description="every aired episode is in the library."
        />
      }
      stickyHeader={false}
    />
  );
}

/** don't: an empty list with no empty state. */
export function NoEmptyState() {
  return (
    <DataTable<BacklogItem>
      aria-label="missing episodes, bare"
      columns={[EPISODE, STATE]}
      rows={[]}
      rowKey={(b) => b.id}
      stickyHeader={false}
    />
  );
}

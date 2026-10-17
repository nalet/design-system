// the do and don't tables of the selection pattern: one action menu per row,
// against a row of buttons. their cells are react, so they are written here.
import { ActionMenu, Button, DataTable, IdentifierCell, StatusCell, toast, type DataTableColumn } from '@nalet/design-system';
import { code, makeBacklog, type BacklogItem } from '@stories/_data/backlog';
import { BACKLOG_STATES } from '@stories/_data/status';

const ROWS = makeBacklog()
  .filter((b) => b.kind === 'series')
  .slice(0, 3);

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
        { id: 'grab', label: 'grab now', onSelect: () => toast(`${code(b)} queued`, { state: 'success' }) },
        { id: 'search', label: 'search again', onSelect: () => toast(`searching for ${code(b)} again`, { state: 'information' }) },
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

/** one action menu per row, named by the row. interactive: hydrate it. */
export function RowMenus() {
  return (
    <DataTable
      aria-label="missing episodes, with a menu per row"
      columns={[EPISODE, STATE, MENU]}
      rows={ROWS}
      rowKey={(b) => b.id}
      stickyHeader={false}
    />
  );
}

/** the same rows with buttons on each: the anti-pattern. */
export function RowButtons() {
  return (
    <DataTable
      aria-label="missing episodes, with buttons per row"
      columns={[EPISODE, STATE, BUTTONS]}
      rows={ROWS}
      rowKey={(b) => b.id}
      stickyHeader={false}
    />
  );
}

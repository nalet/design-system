// the three table cells in the data table they are made for. the columns hold
// render functions, so the table is written here, in react, and rendered as
// static html.
import { DataTable, DateCell, IdentifierCell, StatusCell, type DataTableColumn, type ObjectState } from '@nalet/design-system';
import { STORY_NOW } from '@stories/_data/backlog';

interface Episode {
  id: string;
  code: string;
  name: string | null;
  aired: string | null;
  state: ObjectState;
  text: string;
  detail: string;
}

const ROWS: Episode[] = [
  { id: 'a', code: 'S04E07', name: 'The Long Way Round', aired: '2026-10-12T20:00:00Z', state: 'neutral', text: 'missing', detail: 'nothing found · again in 6h' },
  { id: 'b', code: 'S04E08', name: 'Low Tide', aired: '2026-10-16T20:00:00Z', state: 'error', text: 'needs attention', detail: 'no release passed the quality profile: every one was below 720p' },
  { id: 'c', code: 'S04E09', name: null, aired: null, state: 'information', text: 'on its way', detail: 'waiting for the catalog' },
];

const COLUMNS: DataTableColumn<Episode>[] = [
  { id: 'item', header: 'episode', cell: (r) => <IdentifierCell title={r.code} text={r.name} /> },
  { id: 'aired', header: 'aired', cell: (r) => <DateCell value={r.aired} now={STORY_NOW} /> },
  { id: 'state', header: 'state', cell: (r) => <StatusCell state={r.state} text={r.text} detail={r.detail} /> },
];

/** an identifier, a date and a status cell in each row of a data table. */
export function CellsInATable() {
  return <DataTable<Episode> aria-label="missing episodes" columns={COLUMNS} rows={ROWS} rowKey={(r) => r.id} stickyHeader={false} />;
}

// the sample backlog's status vocabulary — written once, as the status
// vocabulary pattern asks — and the columns every backlog story shares.
import { DateCell, IdentifierCell, StatusCell, defineStates, type DataTableColumn } from '../../src';
import { STORY_NOW, code, type BacklogItem, type BacklogState } from './backlog';

export const BACKLOG_STATES = defineStates<BacklogState>({
  wanted: { state: 'neutral', text: 'missing' },
  queued: { state: 'information', text: 'on its way' },
  grabbed: { state: 'information', text: 'on its way' },
  downloaded: { state: 'information', text: 'on its way' },
  waiting: { state: 'information', text: 'on its way' },
  failed: { state: 'error', text: 'needs attention' },
});

const SEARCH: Record<NonNullable<BacklogItem['search']>, string> = {
  none: 'not searched yet',
  found: 'found a release',
  nothing: 'nothing found · again in 6h',
  error: 'search failed · again in 2h',
};

export function backlogDetail(b: BacklogItem): string {
  switch (b.state) {
    case 'failed':
      return b.reason ?? '';
    case 'queued':
      return 'queued for a search and grab';
    case 'grabbed':
      return 'grabbed';
    case 'downloaded':
      return 'downloaded';
    case 'waiting':
      return 'waiting for the catalog';
    default:
      return b.search ? SEARCH[b.search] : '';
  }
}

export const onItsWay = (b: BacklogItem) => BACKLOG_STATES[b.state].state === 'information';

export const BACKLOG_COLUMNS: DataTableColumn<BacklogItem>[] = [
  {
    id: 'item',
    header: 'episode',
    cell: (b) => <IdentifierCell title={b.kind === 'movie' ? b.title : code(b)} />,
    sortValue: (b) => (b.kind === 'movie' ? b.title : `${b.title} ${code(b)}`),
  },
  {
    id: 'aired',
    header: 'aired',
    cell: (b) => <DateCell value={b.aired} now={STORY_NOW} />,
    sortValue: (b) => b.aired,
    firstSortDirection: 'descending',
    importance: 'low',
  },
  {
    id: 'state',
    header: 'state',
    cell: (b) => <StatusCell {...BACKLOG_STATES[b.state]} detail={backlogDetail(b)} />,
    sortValue: (b) => b.state,
  },
];

/** series and season, or "movies": the sample backlog's groups. */
export const backlogGroup = (b: BacklogItem) =>
  b.kind === 'movie' ? 'movies' : `${b.title}\u0000S${String(b.season).padStart(2, '0')}`;

export const backlogGroupLabel = (key: string, count: number) => {
  if (key === 'movies') return `movies · ${count.toLocaleString('en')} missing`;
  const [title, season] = key.split('\u0000');
  return `${title} · ${season} · ${count.toLocaleString('en')} missing`;
};

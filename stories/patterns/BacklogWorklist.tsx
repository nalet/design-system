// the worklist page layout, assembled end to end on made-up data: what the
// pattern page shows live. every piece is the real library; only the data and
// the "server" (local state) are pretend.
import { useMemo, useState, type ReactNode } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import {
  ActionMenu,
  Banner,
  Button,
  DataTable,
  EmptyState,
  FilterBar,
  Icon,
  Modal,
  SelectionToolbar,
  Table,
  Text,
  Worklist,
  formatCount,
  toast,
  type DataTableColumn,
  type DataTableSort,
  type FilterTab,
} from '../../src';
import { STORY_NOW, code, makeBacklog, seriesNames, type BacklogItem } from '../_data/backlog';
import { BACKLOG_COLUMNS, backlogGroup, backlogGroupLabel, onItsWay } from '../_data/status';

type Tab = 'missing' | 'way' | 'attention' | 'unaired' | 'unknown';

const DAY = 86_400_000;
const UNAIRED = 132;
const UNKNOWN_TITLES = seriesNames(240)
  .slice(120, 225)
  .map((title, i) => ({
    id: `u${i}`,
    title,
    item: `3f2a${String(1000 + i).padStart(4, '0')}-5b7d-4c11-9e02-6a1d0b8f4c21`,
  }));

function airedBucket(b: BacklogItem): 'week' | 'month' | 'older' {
  const days = (STORY_NOW.getTime() - new Date(b.aired).getTime()) / DAY;
  return days <= 7 ? 'week' : days <= 30 ? 'month' : 'older';
}

const grabbable = (b: BacklogItem) => b.state === 'wanted' || b.state === 'failed';

export interface BacklogWorklistProps {
  /** Which data to show: the full backlog, nothing missing, or holdings unknown for everything. */
  variant?: 'backlog' | 'empty' | 'unknown';
}

export function BacklogWorklist({ variant = 'backlog' }: BacklogWorklistProps) {
  const [items, setItems] = useState<BacklogItem[]>(() => (variant === 'backlog' ? makeBacklog() : []));
  const [tab, setTab] = useState<Tab>('missing');
  const [q, setQ] = useState('');
  const [kind, setKind] = useState('');
  const [aired, setAired] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<DataTableSort | null>({ columnId: 'aired', direction: 'descending' });
  const [bannerOpen, setBannerOpen] = useState(true);
  const [picking, setPicking] = useState<BacklogItem | null>(null);
  const unknownCount = variant === 'empty' ? 0 : UNKNOWN_TITLES.length;

  const queue = (ids: string[]) => {
    const can = new Set(items.filter((b) => ids.includes(b.id) && grabbable(b)).map((b) => b.id));
    setItems((prev) => prev.map((b) => (can.has(b.id) ? { ...b, state: 'queued', reason: undefined } : b)));
    // what was queued leaves the selection; a single-row grab keeps the rest of it.
    setSelected((prev) => new Set([...prev].filter((id) => !ids.includes(id))));
    const skipped = ids.length - can.size;
    toast(
      `${formatCount(can.size)} ${can.size === 1 ? 'episode' : 'episodes'} queued${skipped ? ` · ${formatCount(skipped)} skipped: held already or under way` : ''}`,
      { state: 'success' },
    );
  };

  const counts = useMemo(
    () => ({
      missing: items.length,
      way: items.filter(onItsWay).length,
      attention: items.filter((b) => b.state === 'failed').length,
    }),
    [items],
  );

  const inTab = useMemo(
    () =>
      tab === 'way' ? items.filter(onItsWay) : tab === 'attention' ? items.filter((b) => b.state === 'failed') : items,
    [items, tab],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return inTab.filter(
      (b) =>
        (!kind || b.kind === kind) &&
        (!aired || airedBucket(b) === aired) &&
        (!needle || b.title.toLowerCase().includes(needle) || code(b).toLowerCase().includes(needle)),
    );
  }, [inTab, q, kind, aired]);

  // act on what is visible: a filter that hides a selected row drops it from the selection.
  const inView = useMemo(() => new Set(filtered.map((b) => b.id)), [filtered]);
  const selectedInView = useMemo(() => new Set([...selected].filter((id) => inView.has(id))), [selected, inView]);
  const grabbableInView = useMemo(() => filtered.filter(grabbable), [filtered]);

  const filtersActive = !!(q || kind || aired);
  const clearFilters = () => {
    setQ('');
    setKind('');
    setAired('');
  };

  const columns = useMemo<DataTableColumn<BacklogItem>[]>(
    () => [
      ...BACKLOG_COLUMNS,
      {
        id: 'actions',
        header: <span className="nc-sr-only">actions</span>,
        align: 'right',
        width: 44,
        cell: (b) => (
          <ActionMenu
            label={`actions for ${b.kind === 'movie' ? b.title : `${b.title} ${code(b)}`}`}
            items={[
              { id: 'pick', label: 'pick a release', onSelect: () => setPicking(b), disabled: !grabbable(b) },
              { id: 'grab', label: 'grab now', onSelect: () => queue([b.id]), disabled: !grabbable(b) },
            ]}
          />
        ),
      },
    ],
    // queue closes over items; the columns follow it.
    [items],
  );

  const tabs: FilterTab[] = [
    { id: 'missing', label: 'missing', count: counts.missing },
    { id: 'way', label: 'on their way', count: counts.way, state: counts.way ? 'information' : undefined },
    { id: 'attention', label: 'needs attention', count: counts.attention, state: counts.attention ? 'error' : undefined },
    { id: 'unaired', label: 'not yet aired', count: variant === 'backlog' ? UNAIRED : 0 },
    ...(unknownCount ? [{ id: 'unknown', label: "can't be checked", count: unknownCount, state: 'warning' as const }] : []),
  ];

  const message =
    unknownCount && bannerOpen && tab !== 'unknown' ? (
      <Banner
        state="warning"
        onDismiss={() => setBannerOpen(false)}
        actions={
          <>
            <Button size="sm" variant="ghost" onClick={() => setTab('unknown')}>
              show them
            </Button>
            <Button size="sm" variant="ghost" onClick={() => toast('Asking the catalog again — the list follows', { state: 'information' })}>
              ask the catalog again
            </Button>
          </>
        }
        details={`the catalog holds a title of this name without an identity (item ${UNKNOWN_TITLES[0].item}, "${UNKNOWN_TITLES[0].title}"): what it holds of it cannot be known until that item carries one`}
      >
        {formatCount(unknownCount)} titles can&apos;t be checked: the catalog holds them without an identity.
      </Banner>
    ) : null;

  let body: ReactNode;
  if (variant === 'unknown' && tab !== 'unknown') {
    body = (
      <EmptyState
        illustration="unknown"
        title="nothing can be checked yet"
        description={`The library's holdings are unknown for all ${formatCount(unknownCount)} titles, so nothing is known to be missing.`}
        actions={<Button variant="primary">ask the catalog again</Button>}
      />
    );
  } else if (tab === 'unknown') {
    body = (
      <DataTable
        aria-label="titles that can't be checked"
        columns={[
          { id: 'title', header: 'title', cell: (t) => t.title, sortValue: (t) => t.title },
          { id: 'why', header: 'why', cell: () => <Text variant="muted">The catalog holds it without an identity</Text> },
          { id: 'item', header: 'catalog item', importance: 'low', cell: (t) => <code style={{ fontSize: 11, color: 'var(--fg-dim)' }}>{t.item}</code> },
        ]}
        rows={UNKNOWN_TITLES}
        rowKey={(t) => t.id}
        growing={100}
      />
    );
  } else if (tab === 'unaired') {
    body = (
      <EmptyState
        illustration="empty"
        title={`${formatCount(variant === 'backlog' ? UNAIRED : 0)} not yet aired`}
        description="Episodes that have not aired are not missing yet. Each joins this list on the day it airs."
      />
    );
  } else if (items.length === 0) {
    body = (
      <EmptyState illustration="done" title="nothing missing" description="Every aired, monitored episode and movie is in the library." />
    );
  } else if (filtered.length === 0) {
    body = filtersActive ? (
      <EmptyState
        illustration="search"
        title="no matches"
        description="Nothing in this list fits the search and filters."
        actions={<Button onClick={clearFilters}>clear filters</Button>}
      />
    ) : (
      <EmptyState illustration="done" title={tab === 'attention' ? 'nothing needs attention' : 'nothing on its way'} />
    );
  } else {
    body = (
      <DataTable<BacklogItem>
        aria-label="missing episodes and movies"
        columns={columns}
        rows={filtered}
        rowKey={(b) => b.id}
        rowLabel={(b) => (b.kind === 'movie' ? b.title : `${b.title} ${code(b)}`)}
        sort={sort}
        onSortChange={setSort}
        selectable
        isRowSelectable={grabbable}
        selected={selectedInView}
        onSelectionChange={setSelected}
        groupBy={backlogGroup}
        groupHeader={(g) => backlogGroupLabel(g.key, g.rows.length)}
        groupAction={(g) => {
          const can = g.rows.filter(grabbable);
          return can.length ? (
            <Button size="sm" variant="ghost" onClick={() => queue(can.map((b) => b.id))}>
              grab all {formatCount(can.length)}
            </Button>
          ) : null;
        }}
        rowHighlight={(b) => (b.state === 'failed' ? 'error' : undefined)}
        growing={100}
        growingResetKey={`${tab}|${q}|${kind}|${aired}`}
      />
    );
  }

  const showList = tab !== 'unaired' && tab !== 'unknown' && variant !== 'unknown' && items.length > 0;
  const tabNoun = tab === 'way' ? 'on their way' : tab === 'attention' ? 'need attention' : 'missing';

  return (
    <>
      <Worklist
        title="missing"
        subtitle="Aired, monitored and not in the library"
        headerInfo={
          <>
            <span>holdings last asked 3h ago</span>
            <span>the sweep only searches; grabbing on its own is off</span>
          </>
        }
        tabs={tabs}
        activeTab={tab}
        onTabChange={(id) => {
          setTab(id as Tab);
          setSelected(new Set());
        }}
        tabsLabel="filter missing by state"
        messages={message}
        filterBar={
          showList ? (
            <FilterBar
              search={{ value: q, onChange: setQ, placeholder: 'search titles', label: 'search titles' }}
              filters={[
                {
                  type: 'select',
                  id: 'kind',
                  label: 'kind',
                  value: kind,
                  onChange: setKind,
                  options: [
                    { value: '', label: 'all' },
                    { value: 'series', label: 'series' },
                    { value: 'movie', label: 'movies' },
                  ],
                },
                {
                  type: 'select',
                  id: 'aired',
                  label: 'aired',
                  value: aired,
                  onChange: setAired,
                  options: [
                    { value: '', label: 'any time' },
                    { value: 'week', label: 'this week' },
                    { value: 'month', label: 'this month' },
                    { value: 'older', label: 'older' },
                  ],
                },
              ]}
              resultCount={filtersActive ? `${formatCount(filtered.length)} of ${formatCount(inTab.length)}` : undefined}
              onClearAll={clearFilters}
            />
          ) : undefined
        }
        toolbar={
          showList && filtered.length > 0 ? (
            <SelectionToolbar
              label="missing episodes and movies"
              heading={`${formatCount(filtered.length)} ${tabNoun}`}
              selectedCount={selectedInView.size}
              onClearSelection={() => setSelected(new Set())}
              selectAll={
                selectedInView.size > 0 && selectedInView.size < grabbableInView.length
                  ? {
                      label: `select all ${formatCount(grabbableInView.length)}`,
                      onSelect: () => setSelected(new Set(grabbableInView.map((b) => b.id))),
                    }
                  : null
              }
              primaryAction={(n) =>
                n
                  ? {
                      label: `grab ${formatCount(n)} selected`,
                      icon: <Icon icon={Download} size={14} />,
                      onSelect: () => queue([...selectedInView]),
                    }
                  : null
              }
              actions={[
                {
                  id: 'refresh',
                  label: 'ask the catalog again',
                  icon: <Icon icon={RefreshCw} size={14} />,
                  overflow: true,
                  onSelect: () => toast('Asking the catalog again — the list follows', { state: 'information' }),
                },
              ]}
            />
          ) : undefined
        }
      >
        {body}
      </Worklist>
      {picking ? (
        <Modal open onClose={() => setPicking(null)} width={720} title={`releases · ${picking.title} ${code(picking)}`}>
          <Table
            dense
            columns={[
              { key: 'name', header: 'release' },
              { key: 'size', header: 'size', align: 'right' },
              {
                key: 'pick',
                header: '',
                align: 'right',
                render: (r) => (
                  <Button
                    size="sm"
                    variant={r.best ? 'primary' : 'default'}
                    onClick={() => {
                      setPicking(null);
                      queue([picking.id]);
                    }}
                  >
                    grab
                  </Button>
                ),
              },
            ]}
            rows={[
              { name: `${picking.title.replace(/ /g, '.')}.${code(picking)}.1080p.web`, size: '2.1 gb', best: true, pick: '' },
              { name: `${picking.title.replace(/ /g, '.')}.${code(picking)}.720p.web`, size: '1.0 gb', best: false, pick: '' },
            ]}
            rowKey={(r) => r.name}
          />
        </Modal>
      ) : null}
    </>
  );
}

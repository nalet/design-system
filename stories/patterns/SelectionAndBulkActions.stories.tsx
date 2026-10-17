import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Download } from 'lucide-react';
import {
  ActionMenu,
  Button,
  DataTable,
  Icon,
  SelectionToolbar,
  Toaster,
  formatCount,
  toast,
  type DataTableColumn,
} from '../../src';
import { code, makeBacklog, type BacklogItem } from '../_data/backlog';
import { BACKLOG_COLUMNS, backlogGroup, backlogGroupLabel, onItsWay } from '../_data/status';

// made-up data: one invented show's backlog, flat, and the next one by season.
const SERIES = makeBacklog().filter((b) => b.kind === 'series');
const FLAT = SERIES.slice(0, 40);
const SECOND_TITLE = [...new Set(SERIES.map((b) => b.title))][1];
const BY_SEASON = SERIES.filter((b) => b.title === SECOND_TITLE);

/** Rows the growing table shows before "show more". */
const PAGE = 10;

/** A missing or failed episode can be grabbed; one already on its way cannot. */
const grabbable = (b: BacklogItem) => !onItsWay(b);
const episodes = (n: number) => `${formatCount(n)} ${n === 1 ? 'episode' : 'episodes'}`;

const meta: Meta = {
  title: 'Patterns/selection and bulk actions',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Select rows in a data table, act on all of them with the one emphasized action of the selection toolbar, act on one row from its action menu, and say what happened in a toast.',
      },
    },
  },
  // one toaster per page: a docs page, or a page that embeds the story
  // (parameters.embedded, the guidelines site), mounts its own; a story only
  // brings one when it is viewed on its own.
  decorators: [
    (Story, context) => (
      <>
        <Story />
        {context.viewMode === 'docs' || context.parameters.embedded ? null : <Toaster />}
      </>
    ),
  ],
};
export default meta;

type Story = StoryObj;

/**
 * The list's state and its actions. `queue` grabs the rows it can, drops them
 * from the selection (they can no longer be selected) and says what happened,
 * counting what it skipped. It reads the rows through a ref, so the columns
 * that call it are made once and the rows' cells don't re-render on every change.
 */
function useBacklog(initial: readonly BacklogItem[]) {
  const [items, setItems] = useState<BacklogItem[]>(() => [...initial]);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const itemsRef = useRef(items);
  useLayoutEffect(() => {
    itemsRef.current = items;
  });

  const queue = useCallback((ids: Iterable<string>, name?: string) => {
    const asked = new Set(ids);
    const can = new Set(itemsRef.current.filter((b) => asked.has(b.id) && grabbable(b)).map((b) => b.id));
    setItems((prev) =>
      prev.map((b) => (can.has(b.id) ? { ...b, state: 'queued' as const, reason: undefined, search: undefined } : b)),
    );
    setSelected((prev) => {
      if (![...can].some((id) => prev.has(id))) return prev;
      const next = new Set(prev);
      for (const id of can) next.delete(id);
      return next;
    });
    const skipped = asked.size - can.size;
    const done = name && can.size === 1 ? `${name} queued` : `${episodes(can.size)} queued`;
    toast(`${done}${skipped ? ` · ${formatCount(skipped)} skipped: on their way already` : ''}`, { state: 'success' });
  }, []);

  const searchAgain = useCallback((name: string) => {
    toast(`Searching for ${name} again`, { state: 'information' });
  }, []);

  return { items, selected, setSelected, queue, searchAgain };
}

/** One action menu per row, in the last column. Never a row of buttons. */
function useColumns(queue: (ids: Iterable<string>, name?: string) => void, searchAgain: (name: string) => void) {
  return useMemo<DataTableColumn<BacklogItem>[]>(
    () => [
      ...BACKLOG_COLUMNS,
      {
        id: 'actions',
        header: <span className="nc-sr-only">actions</span>,
        align: 'right',
        width: 44,
        cell: (b) => (
          <ActionMenu
            label={`actions for ${code(b)}`}
            items={[
              { id: 'grab', label: 'grab now', disabled: !grabbable(b), onSelect: () => queue([b.id], code(b)) },
              { id: 'search', label: 'search again', onSelect: () => searchAgain(code(b)) },
            ]}
          />
        ),
      },
    ],
    [queue, searchAgain],
  );
}

/** The toolbar and the table read as one block: the table's top border sits under the toolbar's. */
const attached = { marginTop: -1 } as const;

export const SelectAndAct: Story = {
  name: 'select and act',
  render: function SelectAndAct() {
    const { items, selected, setSelected, queue, searchAgain } = useBacklog(FLAT);
    const columns = useColumns(queue, searchAgain);
    const selectable = items.filter(grabbable);
    // the header checkbox selects every visible row. this list shows its first
    // page until "show more", so once that page is selected, offer the whole list.
    const firstPage = items.slice(0, PAGE).filter(grabbable);
    const pageSelected = firstPage.length > 0 && firstPage.every((b) => selected.has(b.id));
    const offerAll = pageSelected && selected.size < selectable.length;
    return (
      <div style={{ display: 'grid' }}>
        <SelectionToolbar
          label="missing episodes"
          heading={`${SERIES[0].title} · ${formatCount(items.length)} missing`}
          selectedCount={selected.size}
          onClearSelection={() => setSelected(new Set())}
          selectAll={
            offerAll
              ? {
                  label: `select all ${formatCount(selectable.length)}`,
                  onSelect: () => setSelected(new Set(selectable.map((b) => b.id))),
                }
              : null
          }
          primaryAction={(n) =>
            n
              ? {
                  label: `grab ${formatCount(n)} selected`,
                  icon: <Icon icon={Download} size={14} />,
                  onSelect: () => {
                    queue(selected);
                    setSelected(new Set());
                  },
                }
              : null
          }
          actions={[
            {
              id: 'search',
              label: 'search the whole list again',
              overflow: true,
              onSelect: () => toast(`Searching for ${episodes(items.length)} again`, { state: 'information' }),
            },
          ]}
        />
        <div style={attached}>
          <DataTable<BacklogItem>
            aria-label="missing episodes"
            columns={columns}
            rows={items}
            rowKey={(b) => b.id}
            rowLabel={code}
            selectable
            selected={selected}
            onSelectionChange={setSelected}
            isRowSelectable={grabbable}
            rowHighlight={(b) => (b.state === 'failed' ? 'error' : undefined)}
            growing={PAGE}
          />
        </div>
      </div>
    );
  },
};

export const GroupActions: Story = {
  name: 'group actions',
  render: function GroupActions() {
    const { items, selected, setSelected, queue, searchAgain } = useBacklog(BY_SEASON);
    const columns = useColumns(queue, searchAgain);
    return (
      <div style={{ display: 'grid' }}>
        <SelectionToolbar
          label="missing episodes"
          heading={`${SECOND_TITLE} · ${formatCount(items.length)} missing`}
          selectedCount={selected.size}
          onClearSelection={() => setSelected(new Set())}
          primaryAction={(n) =>
            n
              ? {
                  label: `grab ${formatCount(n)} selected`,
                  icon: <Icon icon={Download} size={14} />,
                  onSelect: () => {
                    queue(selected);
                    setSelected(new Set());
                  },
                }
              : null
          }
        />
        <div style={attached}>
          <DataTable<BacklogItem>
            aria-label="missing episodes"
            columns={columns}
            rows={items}
            rowKey={(b) => b.id}
            rowLabel={code}
            selectable
            selected={selected}
            onSelectionChange={setSelected}
            isRowSelectable={grabbable}
            groupBy={backlogGroup}
            groupHeader={(g) => backlogGroupLabel(g.key, g.rows.length)}
            groupAction={(g) => {
              // the action counts what it will act on: the season's rows that can be grabbed.
              const can = g.rows.filter(grabbable);
              return can.length ? (
                <Button size="sm" variant="ghost" onClick={() => queue(can.map((b) => b.id))}>
                  grab all {formatCount(can.length)}
                </Button>
              ) : null;
            }}
          />
        </div>
      </div>
    );
  },
};

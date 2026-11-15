import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useMemo, useState } from 'react';
import {
  DataTable,
  DateCell,
  FilterTabs,
  IdentifierCell,
  Language,
  SelectionToolbar,
  StatusCell,
  counted,
  filterTabId,
  useLanguage,
  type Counted,
  type DataTableColumn,
  type LanguageProps,
} from '../../src';
import { STORY_NOW } from '../_data/backlog';

const meta: Meta<LanguageProps> = {
  title: 'React/language',
  component: Language,
  args: { lang: 'de' },
  argTypes: {
    lang: { control: 'select', options: ['en', 'en-US', 'de', 'de-CH'] },
    words: { control: false },
    children: { control: false },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Says the language of a page, or of a part of it, once. Every component inside writes its counts and dates in that language and takes its own words from the set for it.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<LanguageProps>;

// ---- the example: a list of backups ---------------------------------------------

interface Backup {
  id: string;
  volume: string;
  taken: string;
  gigabytes: number;
  failed: boolean;
}

// 2,500 made-up backups, the same on every render: the first few a day or a
// few apart, the rest a day apart; every 24th failed, 105 in all.
const FIRST = ['2026-10-17T08:00:00Z', '2026-10-16T08:00:00Z', '2026-10-12T08:00:00Z', '2026-08-30T08:00:00Z'];
const BACKUPS: Backup[] = Array.from({ length: 2500 }, (_, i) => ({
  id: `b${i}`,
  volume: `data-${String((i % 12) + 1).padStart(2, '0')}`,
  taken: FIRST[i] ?? new Date(Date.parse('2026-08-30T08:00:00Z') - (i - 3) * 86_400_000).toISOString(),
  gigabytes: [12.4, 3.1, 48, 0.9][i % 4],
  failed: i % 24 === 3,
}));

/**
 * The app's own words: the package can't know them, so the app keeps a set per
 * language, as the package does for its own, and writes its counts with the
 * same helpers.
 */
interface OwnWords {
  list: string;
  filter: string;
  all: string;
  failed: string;
  backups: Counted;
  verify: Counted;
  volume: string;
  taken: string;
  size: string;
  state: string;
  kept: string;
  failedWhy: string;
}

const OWN: Record<string, OwnWords> = {
  en: {
    list: 'backups',
    filter: 'filter backups by state',
    all: 'all',
    failed: 'failed',
    backups: { one: '{n} backup', other: '{n} backups' },
    verify: { one: 'verify {n} selected', other: 'verify {n} selected' },
    volume: 'volume',
    taken: 'taken',
    size: 'size',
    state: 'state',
    kept: 'kept',
    failedWhy: 'the volume was in use',
  },
  de: {
    list: 'sicherungen',
    filter: 'sicherungen nach zustand filtern',
    all: 'alle',
    failed: 'fehlgeschlagen',
    backups: { one: '{n} sicherung', other: '{n} sicherungen' },
    verify: { one: '{n} ausgewählte prüfen', other: '{n} ausgewählte prüfen' },
    volume: 'volume',
    taken: 'erstellt',
    size: 'größe',
    state: 'zustand',
    kept: 'vorhanden',
    failedWhy: 'das volume war in gebrauch',
  },
};

/**
 * A list of backups: tabs with counts, a toolbar with a selection, and a table
 * that grows, with a date in every row. Nothing here names a language: the
 * components take it from the `Language` around them.
 */
function Backups() {
  const { lang } = useLanguage();
  const own = OWN[lang.toLowerCase().split('-')[0]] ?? OWN.en;
  const tabs = useId();
  const panel = useId();
  const [tab, setTab] = useState('all');
  const [selected, setSelected] = useState<Set<string>>(() => new Set(['b0', 'b2']));
  const rows = useMemo(() => (tab === 'failed' ? BACKUPS.filter((b) => b.failed) : BACKUPS), [tab]);
  const columns = useMemo<DataTableColumn<Backup>[]>(() => {
    // a number with its unit: the app writes it with the browser's own formatter, in the same language.
    const size = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 });
    // in a narrow table every column but the first pops in under the volume's name.
    return [
      { id: 'volume', header: own.volume, cell: (b) => <IdentifierCell title={b.volume} /> },
      { id: 'taken', header: own.taken, importance: 'medium', cell: (b) => <DateCell value={b.taken} now={STORY_NOW} /> },
      { id: 'size', header: own.size, importance: 'medium', align: 'right', cell: (b) => `${size.format(b.gigabytes)} GB` },
      {
        id: 'state',
        header: own.state,
        importance: 'medium',
        cell: (b) =>
          b.failed ? (
            <StatusCell state="error" text={own.failed} detail={own.failedWhy} />
          ) : (
            <StatusCell state="success" text={own.kept} />
          ),
      },
    ];
  }, [lang, own]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 'var(--s-3)' }}>
      <FilterTabs
        label={own.filter}
        idPrefix={tabs}
        panelId={panel}
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'all', label: own.all, count: BACKUPS.length },
          { id: 'failed', label: own.failed, count: BACKUPS.filter((b) => b.failed).length, state: 'error' },
        ]}
      />
      <div
        id={panel}
        role="tabpanel"
        aria-labelledby={filterTabId(tabs, tab)}
        style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 'var(--s-3)' }}
      >
        <SelectionToolbar
          label={own.list}
          heading={counted(own.backups, rows.length, lang)}
          selectedCount={selected.size}
          onClearSelection={() => setSelected(new Set())}
          primaryAction={(n) => (n ? { label: counted(own.verify, n, lang), onSelect: () => setSelected(new Set()) } : null)}
        />
        <DataTable<Backup>
          aria-label={own.list}
          columns={columns}
          rows={rows}
          rowKey={(b) => b.id}
          rowLabel={(b) => b.volume}
          selectable
          selected={selected}
          onSelectionChange={setSelected}
          growing={4}
          growingResetKey={tab}
          stickyHeader={false}
        />
      </div>
    </div>
  );
}

// ---- the stories -----------------------------------------------------------------

export const Playground: Story = {
  render: (args) => (
    <Language {...args}>
      <Backups />
    </Language>
  ),
};

/** On an English page: "2,500", "12 oct 2026", "5d ago", "2 selected", "4 of 2,500". */
export const English: Story = {
  args: { lang: 'en' },
  render: Playground.render,
};

/** The same list inside German: "2.500", "12. okt. 2026", "vor 5 tagen", "2 ausgewählt", "4 von 2.500". */
export const German: Story = {
  args: { lang: 'de' },
  render: Playground.render,
};

/** Single texts replaced, for this part of the page; every other text stays the built-in one. */
export const OwnTexts: Story = {
  name: 'own texts',
  args: {
    lang: 'en',
    words: {
      toolbar: { clear: 'select none' },
      dataTable: { shownOfTotal: 'showing {shown} of {total}', showMore: { one: 'load {n} more', other: 'load {n} more' } },
    },
  },
  render: Playground.render,
};

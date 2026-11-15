import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { DataTable, type DataTableColumn, type DataTableSort } from './DataTable';
import { StatusCell, DateCell, IdentifierCell, relativeDay } from './cells';
import { ActionMenu } from '../ActionMenu/ActionMenu';
import { Language } from '../../lib/language';
import { expectNoAxeViolations } from '../../test/axe';

interface Ep {
  id: string;
  show: string;
  code: string;
  aired: string;
  state: 'wanted' | 'failed';
}

const EPS: Ep[] = [
  { id: 'a1', show: 'The Example Show', code: 'S04E07', aired: '2026-10-12', state: 'wanted' },
  { id: 'a2', show: 'The Example Show', code: 'S04E08', aired: '2026-10-14', state: 'failed' },
  { id: 'b1', show: 'Copper Valley', code: 'S01E02', aired: '2026-09-01', state: 'wanted' },
  { id: 'b2', show: 'Copper Valley', code: 'S01E03', aired: '2026-09-08', state: 'wanted' },
  { id: 'b3', show: 'Copper Valley', code: 'S01E04', aired: '2026-09-15', state: 'wanted' },
];

const NOW = new Date('2026-10-17T12:00:00');

const COLUMNS: DataTableColumn<Ep>[] = [
  { id: 'code', header: 'episode', cell: (r) => <IdentifierCell title={r.code} />, sortValue: (r) => r.code },
  {
    id: 'aired',
    header: 'aired',
    cell: (r) => <DateCell value={r.aired} now={NOW} />,
    sortValue: (r) => r.aired,
    firstSortDirection: 'descending',
    importance: 'low',
  },
  {
    id: 'state',
    header: 'state',
    cell: (r) =>
      r.state === 'failed' ? (
        <StatusCell state="error" text="needs attention" detail="no release passed the profile" />
      ) : (
        <StatusCell state="neutral" text="missing" />
      ),
  },
  { id: 'actions', header: <span className="nc-sr-only">actions</span>, cell: (r) => <ActionMenu label={`actions for ${r.code}`} items={[{ id: 'p', label: 'pick a release', onSelect: () => undefined }]} /> },
];

function Harness(props: Partial<React.ComponentProps<typeof DataTable<Ep>>> & { initialSelected?: string[] }) {
  const { initialSelected = [], ...rest } = props;
  const [selected, setSelected] = React.useState<Set<string>>(new Set(initialSelected));
  const [sort, setSort] = React.useState<DataTableSort | null>(null);
  return (
    <DataTable<Ep>
      aria-label="missing episodes"
      columns={COLUMNS}
      rows={EPS}
      rowKey={(r) => r.id}
      rowLabel={(r) => r.code}
      selectable
      selected={selected}
      onSelectionChange={setSelected}
      sort={sort}
      onSortChange={setSort}
      {...rest}
    />
  );
}

const bodyRows = () => screen.getAllByRole('row').slice(1);
const codes = () => bodyRows().map((r) => within(r).queryByText(/S\d\dE\d\d/)?.textContent ?? `[${r.textContent}]`);

describe('DataTable', () => {
  it('is a grid with a named header row and row headers', () => {
    render(<Harness />);
    const grid = screen.getByRole('grid', { name: 'missing episodes' });
    expect(grid).toHaveAttribute('aria-multiselectable', 'true');
    expect(grid).toHaveAttribute('aria-rowcount', String(EPS.length + 1));
    expect(screen.getAllByRole('rowheader')).toHaveLength(EPS.length);
  });

  it('sorts by a column, with aria-sort on its header only', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'aired' }));
    const aired = screen.getByRole('columnheader', { name: 'aired' });
    expect(aired).toHaveAttribute('aria-sort', 'descending');
    expect(screen.getByRole('columnheader', { name: 'episode' })).not.toHaveAttribute('aria-sort');
    expect(codes()).toEqual(['S04E08', 'S04E07', 'S01E04', 'S01E03', 'S01E02']);
    await user.click(screen.getByRole('button', { name: 'aired' }));
    expect(aired).toHaveAttribute('aria-sort', 'ascending');
    expect(codes()[0]).toBe('S01E02');
  });

  it('selects a row, all visible rows, and a shift range', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const all = screen.getByRole('checkbox', { name: 'select every visible row' });
    await user.click(screen.getByRole('checkbox', { name: 'select S04E07' }));
    expect(screen.getByRole('checkbox', { name: 'select S04E07' })).toBeChecked();
    expect((all as HTMLInputElement).indeterminate).toBe(true);
    // shift-click selects the range from the last toggled row.
    fireEvent.click(screen.getByRole('checkbox', { name: 'select S01E03' }), { shiftKey: true });
    expect(['S04E07', 'S04E08', 'S01E02', 'S01E03'].every((c) => (screen.getByRole('checkbox', { name: `select ${c}` }) as HTMLInputElement).checked)).toBe(true);
    expect(screen.getByRole('checkbox', { name: 'select S01E04' })).not.toBeChecked();
    await user.click(all);
    expect(all).toBeChecked();
    expect(bodyRows().every((r) => r.getAttribute('aria-selected') === 'true')).toBe(true);
    await user.click(all);
    expect(bodyRows().some((r) => r.getAttribute('aria-selected') === 'true')).toBe(false);
  });

  it('keeps rows that cannot be selected out of every selection', async () => {
    const user = userEvent.setup();
    render(<Harness isRowSelectable={(r) => r.state !== 'failed'} />);
    expect(screen.getByRole('checkbox', { name: 'select S04E08' })).toBeDisabled();
    await user.click(screen.getByRole('checkbox', { name: 'select every visible row' }));
    expect(screen.getByRole('checkbox', { name: 'select S04E08' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'select every visible row' })).toBeChecked();
  });

  it('has one tab stop; arrows move row focus; space selects; enter presses', async () => {
    const user = userEvent.setup();
    const onRowPress = vi.fn();
    render(<Harness onRowPress={onRowPress} />);
    const rows = bodyRows();
    expect(rows.map((r) => r.tabIndex)).toEqual([0, -1, -1, -1, -1]);
    // the controls of rows that are not active are out of the tab order.
    expect(within(rows[1]).getByRole('checkbox').tabIndex).toBe(-1);
    rows[0].focus();
    await user.keyboard('{ArrowDown}');
    expect(rows[1]).toHaveFocus();
    expect(rows[1].tabIndex).toBe(0);
    expect(rows[0].tabIndex).toBe(-1);
    expect(within(rows[1]).getByRole('checkbox').tabIndex).toBe(0);
    await user.keyboard(' ');
    expect(rows[1]).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{Shift>}{ArrowDown}{ArrowDown}{/Shift}');
    expect(rows.slice(1, 4).every((r) => r.getAttribute('aria-selected') === 'true')).toBe(true);
    await user.keyboard('{End}');
    expect(rows[4]).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onRowPress).toHaveBeenCalledWith(EPS[4]);
    await user.keyboard('{Home}');
    expect(rows[0]).toHaveFocus();
  });

  it('groups into a treegrid with collapsible group rows', async () => {
    const user = userEvent.setup();
    render(
      <Harness
        groupBy={(r) => r.show}
        groupHeader={(g) => `${g.key} · ${g.rows.length} missing`}
        groupAction={(g) => <button type="button">grab all {g.rows.length}</button>}
      />,
    );
    const grid = screen.getByRole('treegrid', { name: 'missing episodes' });
    expect(grid).toHaveAttribute('aria-rowcount', String(1 + 2 + EPS.length));
    const group = screen.getByRole('row', { name: /the example show · 2 missing/i });
    expect(group).toHaveAttribute('aria-expanded', 'true');
    expect(group).toHaveAttribute('aria-level', '1');
    expect(screen.getByRole('row', { name: /S04E07/ })).toHaveAttribute('aria-level', '2');
    // ← collapses, → expands, a click toggles.
    group.focus();
    await user.keyboard('{ArrowLeft}');
    expect(group).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('row', { name: /S04E07/ })).toBeNull();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('row', { name: /S04E07/ })).toBeInTheDocument();
    await user.click(within(group).getByText(/the example show/i));
    expect(group).toHaveAttribute('aria-expanded', 'false');
    // the group action does not toggle the group.
    await user.click(screen.getByRole('button', { name: 'grab all 3' }));
    expect(screen.getByRole('row', { name: /copper valley/i })).toHaveAttribute('aria-expanded', 'true');
  });

  it('grows: shows n rows, then more on request, with "n of m"', async () => {
    const user = userEvent.setup();
    render(<Harness growing={2} />);
    expect(bodyRows()).toHaveLength(2);
    expect(screen.getByText('2 of 5')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'show 2 more' }));
    expect(bodyRows()).toHaveLength(4);
    await user.click(screen.getByRole('button', { name: 'show 1 more' }));
    expect(bodyRows()).toHaveLength(5);
    expect(screen.queryByRole('button', { name: /show \d+ more/ })).toBeNull();
    expect(screen.getByText('5 of 5')).toBeInTheDocument();
  });

  it('starts growing over when its reset key changes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Harness growing={2} growingResetKey="a" />);
    await user.click(screen.getByRole('button', { name: 'show 2 more' }));
    expect(bodyRows()).toHaveLength(4);
    rerender(<Harness growing={2} growingResetKey="b" />);
    expect(bodyRows()).toHaveLength(2);
  });

  it('shows its empty content without rows', () => {
    render(<Harness rows={[]} empty={<p>Nothing missing.</p>} />);
    expect(screen.getByText('Nothing missing.')).toBeInTheDocument();
  });

  // 2,500 rows, so a count needs its separator.
  const MANY: Ep[] = Array.from({ length: 2500 }, (_, i) => ({
    id: `m${i}`,
    show: i < 1200 ? 'The Example Show' : 'Copper Valley',
    code: `S01E${String(i + 1).padStart(4, '0')}`,
    aired: '2026-10-12',
    state: 'wanted',
  }));

  it('reads as before in English: its own words, and its counts with their separator', () => {
    const { unmount } = render(<Harness rows={MANY} growing={2} />);
    expect(screen.getByRole('checkbox', { name: 'select every visible row' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'select S01E0001' })).toBeInTheDocument();
    expect(screen.getByText('2 of 2,500')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'show 2 more' })).toBeInTheDocument();
    unmount();
    // rows without a name, and groups without a label of their own.
    render(<Harness rows={MANY} growing={3} rowLabel={undefined} groupBy={(r) => r.show} defaultCollapsedGroups={['The Example Show']} />);
    expect(screen.getByRole('row', { name: 'The Example Show · 1,200' })).toBeInTheDocument();
    expect(screen.getByRole('row', { name: 'Copper Valley · 1,300' })).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox', { name: 'select row' })).toHaveLength(3);
    expect(screen.getByText('3 of 2,500')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'show 3 more' })).toBeInTheDocument();
  });

  it('reads in German inside a German part of the page, and a function of the app still wins', () => {
    const page = (props: React.ComponentProps<typeof Harness>) => (
      <Language lang="de">
        <Harness rows={MANY} {...props} />
      </Language>
    );
    const first = render(page({ growing: 2 }));
    expect(screen.getByRole('checkbox', { name: 'alle sichtbaren zeilen auswählen' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'S01E0001 auswählen' })).toBeInTheDocument();
    expect(screen.getByText('2 von 2.500')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2 weitere anzeigen' })).toBeInTheDocument();
    first.rerender(page({ growing: 2, formatGrowing: (shown, total) => `${shown} / ${total}` }));
    expect(screen.getByText('2 / 2500')).toBeInTheDocument();
    first.unmount();
    render(page({ growing: 3, rowLabel: undefined, groupBy: (r) => r.show, defaultCollapsedGroups: ['The Example Show'] }));
    expect(screen.getByRole('row', { name: 'The Example Show · 1.200' })).toBeInTheDocument();
    expect(screen.getByRole('row', { name: 'Copper Valley · 1.300' })).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox', { name: 'zeile auswählen' })).toHaveLength(3);
    expect(screen.getByText('3 von 2.500')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3 weitere anzeigen' })).toBeInTheDocument();
  });

  it('has no axe violations: flat, selected, grouped, collapsed, empty', async () => {
    const { container, rerender } = render(<Harness initialSelected={['a1']} growing={3} />);
    await expectNoAxeViolations(container);
    rerender(<Harness groupBy={(r) => r.show} defaultCollapsedGroups={['Copper Valley']} />);
    await expectNoAxeViolations(container);
    rerender(<Harness rows={[]} empty={<p>Nothing missing.</p>} />);
    await expectNoAxeViolations(container);
  });
});

describe('cells', () => {
  it('says how long ago, compact and spoken', () => {
    const now = new Date('2026-10-17T12:00:00');
    expect(relativeDay(new Date('2026-10-17T01:00:00'), now)).toEqual({ short: 'today', long: 'today' });
    expect(relativeDay(new Date('2026-10-16T23:00:00'), now).short).toBe('yesterday');
    expect(relativeDay(new Date('2026-10-12T10:00:00'), now)).toEqual({ short: '5d ago', long: '5 days ago' });
    expect(relativeDay(new Date('2026-09-01T10:00:00'), now).short).toBe('7w ago');
    expect(relativeDay(new Date('2026-10-20T10:00:00'), now)).toEqual({ short: 'in 3d', long: 'in 3 days' });
  });

  it('dates read absolute and relative; an empty one says so', () => {
    const { container, rerender } = render(<DateCell value="2026-10-12T10:00:00" now={new Date('2026-10-17T12:00:00')} />);
    expect(container.querySelector('time')).toHaveAttribute('datetime');
    expect(container.textContent).toBe('12 Oct 20265d ago, 5 days ago');
    rerender(<DateCell value={null} />);
    expect(container.textContent).toBe('—no date');
  });

  it('writes an English month in three letters, the same in every engine', () => {
    const date = '2026-09-15T10:00:00';
    const { container, rerender } = render(<DateCell value={date} relative={false} />);
    expect(container.querySelector('time')).toHaveTextContent(/^15 Sep 2026$/);
    // other languages are written the way the engine writes them.
    rerender(<DateCell value={date} relative={false} locale="de-CH" />);
    const german = new Intl.DateTimeFormat('de-CH', { day: 'numeric', month: 'short', year: 'numeric' });
    expect(container.querySelector('time')).toHaveTextContent(german.format(new Date(date)));
  });

  it('says how long ago in another language in that language’s own forms, with the same thresholds', () => {
    const now = new Date('2026-10-17T12:00:00');
    const ago = (days: number) => new Date(now.getTime() - days * 86_400_000);
    expect(relativeDay(ago(0), now, 'de')).toEqual({ short: 'heute', long: 'heute' });
    expect(relativeDay(ago(1), now, 'de')).toEqual({ short: 'gestern', long: 'gestern' });
    expect(relativeDay(ago(-1), now, 'de')).toEqual({ short: 'morgen', long: 'morgen' });
    expect(relativeDay(ago(5), now, 'de')).toEqual({ short: 'vor 5 Tagen', long: 'vor 5 Tagen' });
    expect(relativeDay(ago(-3), now, 'de').long).toBe('in 3 Tagen');
    // days up to 13, then weeks, months from 60 days, years from 730.
    expect(relativeDay(ago(13), now, 'de').long).toBe('vor 13 Tagen');
    expect(relativeDay(ago(14), now, 'de').long).toBe('vor 2 Wochen');
    expect(relativeDay(ago(59), now, 'de').long).toBe('vor 8 Wochen');
    expect(relativeDay(ago(60), now, 'de').long).toBe('vor 2 Monaten');
    expect(relativeDay(ago(729), now, 'de').long).toBe('vor 24 Monaten');
    expect(relativeDay(ago(730), now, 'de').long).toBe('vor 2 Jahren');
    // the short form is the language's narrow one, whatever the engine holds for it.
    expect(relativeDay(ago(49), now, 'de').short).toBe(
      new Intl.RelativeTimeFormat('de', { numeric: 'auto', style: 'narrow' }).format(-7, 'week'),
    );
  });

  it('keeps the English forms for English with a region, and for a language tag it cannot read', () => {
    const now = new Date('2026-10-17T12:00:00');
    const then = new Date('2026-10-12T10:00:00');
    expect(relativeDay(then, now, 'en')).toEqual({ short: '5d ago', long: '5 days ago' });
    expect(relativeDay(then, now, 'en-US')).toEqual({ short: '5d ago', long: '5 days ago' });
    expect(relativeDay(then, now, 'not a tag')).toEqual({ short: '5d ago', long: '5 days ago' });
    expect(relativeDay(new Date('2026-08-29T10:00:00'), now, 'en-GB')).toEqual({ short: '7w ago', long: '7 weeks ago' });
    expect(relativeDay(new Date('2025-02-17T10:00:00'), now, 'en')).toEqual({ short: '20mo ago', long: '20 months ago' });
    expect(relativeDay(new Date('2024-10-17T10:00:00'), now, 'en')).toEqual({ short: '2y ago', long: '2 years ago' });
  });

  it('reads as before in English: the day before the month, how long ago in the short forms', () => {
    const now = new Date('2026-10-17T12:00:00');
    const { container, rerender } = render(<DateCell value="2026-10-12T10:00:00" now={now} />);
    expect(container.querySelector('time')).toHaveTextContent(/^12 Oct 2026$/);
    expect(container.querySelector('.nc-cell-date__rel')!.textContent).toBe('5d ago, 5 days ago');
    rerender(<DateCell value="2026-10-16T10:00:00" now={now} />);
    expect(container.textContent).toBe('16 Oct 2026yesterday, yesterday');
    rerender(<DateCell value="" />);
    expect(container.textContent).toBe('—no date');
  });

  it('a date cell reads in German inside a German part of the page: the date, how long ago and no date', () => {
    const now = new Date('2026-10-17T12:00:00');
    const cell = (value: string | null) => (
      <Language lang="de">
        <DateCell value={value} now={now} />
      </Language>
    );
    const { container, rerender } = render(cell('2026-10-12T10:00:00'));
    expect(container.querySelector('time')).toHaveTextContent(/^12\. Okt\. 2026$/);
    expect(container.querySelector('time')).toHaveAttribute('title', expect.stringContaining('Montag, 12. Oktober 2026'));
    expect(container.querySelector('.nc-cell-date__rel [aria-hidden="true"]')).toHaveTextContent(/^vor 5 Tagen$/);
    expect(container.querySelector('.nc-cell-date__rel .nc-sr-only')).toHaveTextContent(/^, vor 5 Tagen$/);
    rerender(cell('2026-10-16T10:00:00'));
    expect(container.querySelector('.nc-cell-date__rel [aria-hidden="true"]')).toHaveTextContent(/^gestern$/);
    rerender(cell('2026-10-17T08:00:00'));
    expect(container.querySelector('.nc-cell-date__rel [aria-hidden="true"]')).toHaveTextContent(/^heute$/);
    rerender(cell('2026-10-18T08:00:00'));
    expect(container.querySelector('.nc-cell-date__rel [aria-hidden="true"]')).toHaveTextContent(/^morgen$/);
    rerender(cell(null));
    expect(container.textContent).toBe('—kein datum');
  });

  it('a date cell follows the language of the page, and its own locale before that', () => {
    const now = new Date('2026-10-17T12:00:00');
    document.documentElement.lang = 'de';
    try {
      const { container, rerender } = render(<DateCell value="2026-10-12T10:00:00" now={now} />);
      expect(container.textContent).toBe('12. Okt. 2026vor 5 Tagen, vor 5 Tagen');
      // the cell's own locale says otherwise: the date and how long ago are English again.
      rerender(<DateCell value="2026-10-12T10:00:00" now={now} locale="en-GB" />);
      expect(container.textContent).toBe('12 Oct 20265d ago, 5 days ago');
      rerender(<DateCell value="2026-10-12T10:00:00" now={now} locale="en-US" />);
      expect(container.textContent).toBe('Oct 12, 20265d ago, 5 days ago');
    } finally {
      document.documentElement.removeAttribute('lang');
    }
    // and a German cell on an English page.
    const { container } = render(<DateCell value="2026-10-12T10:00:00" now={now} locale="de" />);
    expect(container.textContent).toBe('12. Okt. 2026vor 5 Tagen, vor 5 Tagen');
  });

  it('a date cell falls back to English for a language tag it cannot read', () => {
    const { container } = render(
      <Language lang="not a tag">
        <DateCell value="2026-10-12T10:00:00" now={new Date('2026-10-17T12:00:00')} />
      </Language>,
    );
    expect(container.textContent).toBe('12 Oct 20265d ago, 5 days ago');
  });

  it('a status cell keeps its whole reason in the dom', () => {
    render(<StatusCell state="error" text="needs attention" detail="no release passed the profile: all below 720p" />);
    expect(screen.getByText('no release passed the profile: all below 720p')).toHaveAttribute('title');
  });

  it('leaves aria-selected off rows that cannot be selected', () => {
    render(<Harness isRowSelectable={(r) => r.state !== 'failed'} />);
    const failed = screen.getByRole('row', { name: /S04E08/ });
    expect(failed).not.toHaveAttribute('aria-selected');
    expect(screen.getByRole('row', { name: /S04E07/ })).toHaveAttribute('aria-selected', 'false');
  });

  it('keeps focus in the table when the focused row leaves the list', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Harness />);
    const row = screen.getByRole('row', { name: /S01E04/ });
    row.focus();
    await user.keyboard('{ArrowUp}');
    const focused = document.activeElement as HTMLElement;
    expect(focused).toHaveAttribute('data-kind', 'row');
    rerender(<Harness rows={EPS.filter((e) => e.id !== focused.getAttribute('data-key'))} />);
    expect(document.activeElement).not.toBe(document.body);
    expect((document.activeElement as HTMLElement).closest('table')).not.toBeNull();
  });
});

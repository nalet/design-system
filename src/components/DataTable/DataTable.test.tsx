import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { DataTable, type DataTableColumn, type DataTableSort } from './DataTable';
import { StatusCell, DateCell, IdentifierCell, relativeDay } from './cells';
import { ActionMenu } from '../ActionMenu/ActionMenu';
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

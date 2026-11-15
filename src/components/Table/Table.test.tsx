import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Table, type TableColumn } from './Table';
import { Language } from '../../lib/language';
import { expectNoAxeViolations } from '../../test/axe';

interface Volume {
  name: string;
  size: string;
}

const COLUMNS: TableColumn<Volume>[] = [
  { key: 'name', header: 'name' },
  { key: 'size', header: 'size', align: 'right' },
];
const ROWS: Volume[] = [
  { name: 'data-01', size: '12.4 GB' },
  { name: 'data-02', size: '3.1 GB' },
];

// jsdom lays nothing out: a stand-in ResizeObserver, and a frame narrower than
// its table, so the frame is the region that scrolls.
function wideTable() {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.spyOn(Element.prototype, 'scrollWidth', 'get').mockReturnValue(800);
  vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(400);
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Table', () => {
  it('shows its rows under their headers', () => {
    render(<Table aria-label="volumes" columns={COLUMNS} rows={ROWS} />);
    expect(screen.getByRole('table', { name: 'volumes' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['name', 'size']);
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.queryByRole('region')).toBeNull();
  });

  it('reads as before in English: "no rows", and "table" for a frame that scrolls without a name', () => {
    wideTable();
    render(<Table columns={COLUMNS} rows={[]} />);
    expect(screen.getByRole('cell', { name: 'no rows' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'table' })).toHaveAttribute('tabindex', '0');
  });

  it('reads in German inside a German part of the page, and the table’s own words still win', () => {
    wideTable();
    const { rerender } = render(
      <Language lang="de">
        <Table columns={COLUMNS} rows={[]} />
      </Language>,
    );
    expect(screen.getByRole('cell', { name: 'keine zeilen' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'tabelle' })).toBeInTheDocument();
    rerender(
      <Language lang="de">
        <Table aria-label="volumes" columns={COLUMNS} rows={[]} empty="keine volumes" />
      </Language>,
    );
    expect(screen.getByRole('cell', { name: 'keine volumes' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'volumes' })).toBeInTheDocument();
  });

  it('leaves the empty row blank when it is given nothing to say', () => {
    const { container } = render(<Table columns={COLUMNS} rows={[]} empty={null} />);
    expect(container.querySelector('.nc-table__empty')).toBeEmptyDOMElement();
  });

  it('has no axe violations, with rows and without', async () => {
    const { container, rerender } = render(<Table aria-label="volumes" columns={COLUMNS} rows={ROWS} />);
    await expectNoAxeViolations(container);
    rerender(<Table aria-label="volumes" columns={COLUMNS} rows={[]} />);
    await expectNoAxeViolations(container);
  });
});

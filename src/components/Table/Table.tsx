import * as React from 'react';
import { cx } from '../../lib/cx';
import './Table.css';

export interface TableColumn<Row> {
  /** column key, used for the cell value when no `render` is given. */
  key: keyof Row & string;
  /** header label, lowercase. */
  header: React.ReactNode;
  /** custom cell renderer. */
  render?: (row: Row, index: number) => React.ReactNode;
  /** text alignment. default left. */
  align?: 'left' | 'right' | 'center';
  /** fixed/min width. */
  width?: string | number;
}

export interface TableProps<Row> extends React.TableHTMLAttributes<HTMLTableElement> {
  columns: TableColumn<Row>[];
  rows: Row[];
  /** stable key per row. defaults to the row index. */
  rowKey?: (row: Row, index: number) => React.Key;
  /** tighter cell padding. */
  dense?: boolean;
  /** shown when rows is empty. */
  empty?: React.ReactNode;
}

/**
 * Table — a hairline-grid data table with mono headers. square, no zebra by
 * default (terminal rows). pass `columns` + `rows`, or use the primitives.
 */
export function Table<Row>({
  columns,
  rows,
  rowKey,
  dense,
  empty = 'no rows',
  className,
  ...rest
}: TableProps<Row>) {
  return (
    <div className="nc-table__scroll">
      <table className={cx('nc-table', dense && 'nc-table--dense', className)} {...rest}>
        <thead className="nc-table__head">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className="nc-table__th"
                style={{ textAlign: c.align ?? 'left', width: c.width }}
                scope="col"
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="nc-table__empty" colSpan={columns.length}>
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={rowKey ? rowKey(row, i) : i} className="nc-table__tr">
                {columns.map((c) => (
                  <td key={c.key} className="nc-table__td" style={{ textAlign: c.align ?? 'left' }}>
                    {c.render ? c.render(row, i) : (row[c.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* low-level primitives for hand-built tables */
export const Thead = (p: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead {...p} className={cx('nc-table__head', p.className)} />
);
export const Tbody = (p: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...p} />;
export const Tr = (p: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...p} className={cx('nc-table__tr', p.className)} />
);
export const Th = (p: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th {...p} className={cx('nc-table__th', p.className)} />
);
export const Td = (p: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td {...p} className={cx('nc-table__td', p.className)} />
);

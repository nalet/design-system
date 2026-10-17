// specimens for the motion page: each motion of the library in a labelled box,
// and the rows a busy data table runs its rule over.
import type { ReactNode } from 'react';
import { DataTable } from '@nalet/design-system';

export function Specimen({ name, note, children }: { name: string; note: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        alignContent: 'space-between',
        gap: 'var(--s-3)',
        minWidth: 0,
        padding: 'var(--s-3)',
        background: 'var(--bg-2)',
        border: '1px solid var(--border)',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--s-2)', minHeight: 56, minWidth: 0 }}>
        {children}
      </div>
      <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg)' }}>
        {name}
        <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 'var(--s-1)' }}>{note}</div>
      </div>
    </div>
  );
}

export function SpecimenGrid({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 14rem), 1fr))',
        gap: 'var(--s-3)',
        width: '100%',
      }}
    >
      {children}
    </div>
  );
}

const ROWS = [
  { id: 'a', name: 'storage-01' },
  { id: 'b', name: 'storage-02' },
];

/** a data table that is refreshing: the rows stay, under the running rule. */
export function BusyTable({ label = 'volumes' }: { label?: string }) {
  return (
    <div style={{ width: '100%' }}>
      <DataTable
        aria-label={label}
        columns={[{ id: 'name', header: 'volume', cell: (v: (typeof ROWS)[number]) => v.name }]}
        rows={ROWS}
        rowKey={(v) => v.id}
        loading
        stickyHeader={false}
      />
    </div>
  );
}

// a search that matches nothing, live: the filter bar stays, the table's body
// says which kind of empty this is, and "clear filters" brings the list back.
// interactive: hydrate it (client:visible).
import { useState } from 'react';
import { Button, DataTable, FilterBar, IllustratedMessage, formatCount } from '@nalet/design-system';
import { code, makeBacklog } from '@stories/_data/backlog';
import { BACKLOG_COLUMNS } from '@stories/_data/status';

const ROWS = makeBacklog()
  .filter((b) => b.kind === 'series')
  .slice(0, 12);

export function NoMatches() {
  const [q, setQ] = useState('lantern');
  const needle = q.trim().toLowerCase();
  const rows = needle ? ROWS.filter((b) => `${b.title} ${code(b)}`.toLowerCase().includes(needle)) : ROWS;
  return (
    <div style={{ display: 'grid', gap: 'var(--s-3)', width: '100%' }}>
      <FilterBar
        search={{ value: q, onChange: setQ, placeholder: 'search titles', label: 'search titles' }}
        resultCount={needle ? `${formatCount(rows.length)} of ${formatCount(ROWS.length)}` : undefined}
        onClearAll={() => setQ('')}
      />
      <DataTable
        aria-label="missing episodes"
        columns={BACKLOG_COLUMNS}
        rows={rows}
        rowKey={(b) => b.id}
        empty={
          <IllustratedMessage
            illustration="search"
            size="sm"
            headingLevel={2}
            title="no matches"
            description={`Nothing in this list fits “${q.trim()}”. Clear the search, or try another word.`}
            actions={
              <Button size="sm" onClick={() => setQ('')}>
                clear filters
              </Button>
            }
          />
        }
      />
    </div>
  );
}

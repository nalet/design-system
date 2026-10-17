// the do and don't examples of the filter bar page: a bar with a search and one
// facet that keeps its own values, and a made-up count of what is left.
// interactive: hydrate it (client:visible); its props are plain values.
import { useState } from 'react';
import { FilterBar, type FilterSelectDef } from '@nalet/design-system';

interface DemoBarProps {
  /** the landmark's name. */
  label: string;
  /** what the search finds: "volumes". */
  noun: string;
  /** how many items the list holds. */
  total: number;
  /** the facet's name, and its id. */
  facet: string;
  options: FilterSelectDef['options'];
  /** the facet's first value; clear all goes back to it. */
  initial?: string;
  /** show the result count. */
  count?: boolean;
}

export function DemoBar({ label, noun, total, facet, options, initial = '', count = true }: DemoBarProps) {
  const [q, setQ] = useState('');
  const [value, setValue] = useState(initial);
  const set = (q ? 1 : 0) + (value ? 1 : 0);
  const left = Math.max(1, Math.round(total / (1 + set * 3)));
  return (
    <FilterBar
      label={label}
      search={{ value: q, onChange: setQ, placeholder: `search ${noun}`, label: `search ${noun}` }}
      filters={[{ type: 'select', id: facet, label: facet, value, onChange: setValue, options }]}
      resultCount={count ? (set ? `${left} of ${total}` : String(total)) : undefined}
      onClearAll={() => {
        setQ('');
        setValue(initial);
      }}
    />
  );
}

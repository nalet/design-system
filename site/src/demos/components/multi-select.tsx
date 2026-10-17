// the do and don't examples of the multi select page. a multi select holds no
// value of its own (value and onChange), so each example keeps its value here.
// interactive: hydrate it (client:visible); its props are plain values.
import { useState } from 'react';
import { MultiSelect, type MultiSelectOption } from '@nalet/design-system';

/** the `state` facet of the examples, with a count per option. */
export const STATES: MultiSelectOption[] = [
  { value: 'missing', label: 'missing', count: 2318 },
  { value: 'way', label: 'on its way', count: 182 },
  { value: 'attention', label: 'needs attention', count: 3 },
];

/** more options than a small panel holds, for the "many options" example. */
export const SERIES: MultiSelectOption[] = [
  'The Quiet Harbour',
  'Copper Valley',
  'Northern Orchard',
  'Silver Engine',
  'Hollow Garden',
  'Amber Station',
  'Distant Meridian',
  'Paper Circuit',
  'Iron Archive',
  'The Lantern',
].map((t) => ({ value: t, label: t }));

/** a multi select that keeps its own value, with room under it for the panel. */
export function DemoMulti({
  label,
  options,
  initial = [],
}: {
  label: string;
  options: MultiSelectOption[];
  /** the values chosen at first. */
  initial?: string[];
}) {
  const [value, setValue] = useState<string[]>(initial);
  return (
    <div style={{ minHeight: 200 }}>
      <MultiSelect label={label} options={options} value={value} onChange={setValue} />
    </div>
  );
}

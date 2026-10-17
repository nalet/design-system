// the do and don't examples of the filter tabs page: a row that keeps its own
// selection, the first tab chosen. interactive: hydrate it (client:visible);
// its props are plain values.
import { useState } from 'react';
import { FilterTabs, type FilterTab } from '@nalet/design-system';

export function DemoTabs({ label, tabs }: { label: string; tabs: FilterTab[] }) {
  const [value, setValue] = useState(tabs[0].id);
  return <FilterTabs label={label} tabs={tabs} value={value} onChange={setValue} />;
}

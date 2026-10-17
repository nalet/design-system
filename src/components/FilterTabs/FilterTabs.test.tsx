import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { FilterTabs, filterTabId, type FilterTab } from './FilterTabs';
import { expectNoAxeViolations } from '../../test/axe';

const TABS: FilterTab[] = [
  { id: 'all', label: 'missing', count: 2500 },
  { id: 'way', label: 'on their way', count: 12, state: 'information' },
  { id: 'attention', label: 'needs attention', count: 3, state: 'error' },
];

function Harness({ onChange }: { onChange?: (id: string) => void }) {
  const [value, setValue] = React.useState('all');
  return (
    <>
      <FilterTabs
        tabs={TABS}
        value={value}
        onChange={(id) => {
          setValue(id);
          onChange?.(id);
        }}
        label="filter missing"
        panelId="panel"
        idPrefix="ft"
      />
      <div id="panel" role="tabpanel" aria-labelledby={filterTabId('ft', value)}>
        list
      </div>
    </>
  );
}

describe('FilterTabs', () => {
  it('is a tablist whose tabs name their count and control the panel', () => {
    render(<Harness />);
    expect(screen.getByRole('tablist', { name: 'filter missing' })).toBeInTheDocument();
    const tab = screen.getByRole('tab', { name: 'missing 2,500' });
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(tab).toHaveAttribute('aria-controls', 'panel');
    expect(screen.getByRole('tabpanel', { name: 'missing 2,500' })).toBeInTheDocument();
  });

  it('selects with click and with the arrow keys, one tab stop', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    await user.click(screen.getByRole('tab', { name: /needs attention/ }));
    expect(onChange).toHaveBeenLastCalledWith('attention');
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: /missing/ })).toHaveFocus();
    expect(screen.getByRole('tab', { name: /missing/ })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{End}');
    expect(onChange).toHaveBeenLastCalledWith('attention');
    expect(screen.getAllByRole('tab').filter((t) => t.tabIndex === 0)).toHaveLength(1);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Harness />);
    await expectNoAxeViolations(container);
  });
});

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { FilterBar } from './FilterBar';
import { expectNoAxeViolations } from '../../test/axe';

function Harness({ onClear }: { onClear?: () => void }) {
  const [q, setQ] = React.useState('');
  const [kind, setKind] = React.useState('');
  const [aired, setAired] = React.useState<string[]>([]);
  return (
    <FilterBar
      search={{ value: q, onChange: setQ, placeholder: 'search titles', label: 'search titles' }}
      filters={[
        {
          type: 'select',
          id: 'kind',
          label: 'kind',
          value: kind,
          onChange: setKind,
          options: [
            { value: '', label: 'all' },
            { value: 'series', label: 'series' },
            { value: 'movie', label: 'movies' },
          ],
        },
        {
          type: 'multiselect',
          id: 'aired',
          label: 'aired',
          value: aired,
          onChange: setAired,
          options: [
            { value: 'week', label: 'this week', count: 40 },
            { value: 'month', label: 'this month', count: 210 },
          ],
        },
      ]}
      resultCount={q ? '3 of 2,500' : '2,500'}
      onClearAll={() => {
        setQ('');
        setKind('');
        setAired([]);
        onClear?.();
      }}
    />
  );
}

describe('FilterBar', () => {
  it('is a search landmark with a labelled field, facets and a live count', async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    expect(screen.getByRole('search', { name: 'filters' })).toBeInTheDocument();
    const field = screen.getByRole('searchbox', { name: 'search titles' });
    await user.type(field, 'lantern');
    expect(field).toHaveValue('lantern');
    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent('3 of 2,500');
    await user.keyboard('{Escape}');
    expect(field).toHaveValue('');
  });

  it('clears everything, and is only clearable while something is set', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<Harness onClear={onClear} />);
    const clearAll = screen.getByRole('button', { name: 'clear all' });
    expect(clearAll).toBeDisabled();
    await user.selectOptions(screen.getByRole('combobox', { name: 'kind' }), 'movie');
    expect(clearAll).toBeEnabled();
    await user.click(clearAll);
    expect(onClear).toHaveBeenCalledOnce();
    expect(screen.getByRole('combobox', { name: 'kind' })).toHaveValue('');
  });

  it('multi select: a disclosure of checkboxes, esc closes it back to the trigger', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: /aired/ });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.click(screen.getByRole('checkbox', { name: /this week/ }));
    expect(trigger).toHaveTextContent('this week');
    await user.click(screen.getByRole('checkbox', { name: /this month/ }));
    expect(trigger).toHaveTextContent('2 chosen');
    await user.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('has no axe violations, with the multi select open', async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    await user.click(screen.getByRole('button', { name: /aired/ }));
    await expectNoAxeViolations(container);
  });
});

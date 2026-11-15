import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { FilterBar, type FilterBarProps } from './FilterBar';
import { Language } from '../../lib/language';
import { expectNoAxeViolations } from '../../test/axe';

function Harness({
  onClear,
  searchLabel = 'search titles',
  ...rest
}: { onClear?: () => void; searchLabel?: string | null } & Partial<FilterBarProps>) {
  const [q, setQ] = React.useState('');
  const [kind, setKind] = React.useState('');
  const [aired, setAired] = React.useState<string[]>([]);
  return (
    <FilterBar
      search={{ value: q, onChange: setQ, placeholder: 'search titles', label: searchLabel ?? undefined }}
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
      {...rest}
    />
  );
}

// jsdom has no ResizeObserver, so a bar always lays out wide. this one says
// the bar is 360 wide as soon as it is observed, as a phone would.
function aNarrowBar() {
  class Narrow {
    constructor(private readonly onResize: ResizeObserverCallback) {}
    observe() {
      act(() => this.onResize([{ contentRect: { width: 360 } } as ResizeObserverEntry], this as unknown as ResizeObserver));
    }
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal('ResizeObserver', Narrow);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

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

  it('moves focus to the search after clear all, which then disables itself', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(screen.getByRole('searchbox', { name: 'search titles' }), 'x');
    await user.click(screen.getByRole('button', { name: 'clear all' }));
    expect(screen.getByRole('searchbox', { name: 'search titles' })).toHaveFocus();
    expect(screen.getByRole('button', { name: 'clear all' })).toBeDisabled();
  });

  it('names a multi select by its facet and summary, with a space between', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'aired any' });
    await user.click(trigger);
    await user.click(screen.getByRole('checkbox', { name: 'this week 40' }));
    expect(screen.getByRole('button', { name: 'aired this week' })).toBeInTheDocument();
  });
});

describe('FilterBar, its own words', () => {
  it('names the landmark and the search itself where the page gives no name', () => {
    render(<Harness searchLabel={null} />);
    expect(screen.getByRole('search', { name: 'filters' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'search' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'clear all' })).toBeInTheDocument();
  });

  it('takes them from the page\'s language', () => {
    render(
      <Language lang="de">
        <Harness searchLabel={null} />
      </Language>,
    );
    expect(screen.getByRole('search', { name: 'filter' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'suche' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'alle zurücksetzen' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'aired alle' })).toBeInTheDocument();
  });

  it('lets a name the page gives win', () => {
    render(
      <Language lang="de">
        <Harness label="titel filtern" searchLabel="titel suchen" />
      </Language>,
    );
    expect(screen.getByRole('search', { name: 'titel filtern' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'titel suchen' })).toBeInTheDocument();
  });
});

describe('FilterBar, narrow', () => {
  it('folds the facets behind a button that counts the ones that are set', async () => {
    aNarrowBar();
    const user = userEvent.setup();
    render(<Harness />);
    const toggle = screen.getByRole('button', { name: 'filters' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('combobox', { name: 'kind' })).toBeNull();
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await user.selectOptions(screen.getByRole('combobox', { name: 'kind' }), 'movie');
    expect(screen.getByRole('button', { name: 'filters · 1' })).toBe(toggle);
    await user.click(screen.getByRole('button', { name: /aired/ }));
    await user.click(screen.getByRole('checkbox', { name: /this week/ }));
    expect(screen.getByRole('button', { name: 'filters · 2' })).toBe(toggle);
  });

  it('says it in the page\'s language', async () => {
    aNarrowBar();
    const user = userEvent.setup();
    render(
      <Language lang="de">
        <Harness />
      </Language>,
    );
    const toggle = screen.getByRole('button', { name: 'filter' });
    await user.click(toggle);
    await user.selectOptions(screen.getByRole('combobox', { name: 'kind' }), 'movie');
    expect(screen.getByRole('button', { name: 'filter · 1' })).toBe(toggle);
  });

  it('has no axe violations, folded and open', async () => {
    aNarrowBar();
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    await expectNoAxeViolations(container);
    await user.click(screen.getByRole('button', { name: 'filters' }));
    await expectNoAxeViolations(container);
  });
});

describe('FilterBar, the large size', () => {
  it('draws every control medium unless asked', () => {
    const { container } = render(<Harness />);
    expect(container.querySelector('.nc-filterbar')).toHaveClass('nc-filterbar--md');
    expect(container.querySelector('.nc-input')).toHaveClass('nc-input--md');
    expect(container.querySelector('.nc-select')).toHaveClass('nc-select--md');
    expect(container.querySelector('.nc-multiselect')).toHaveClass('nc-multiselect--md');
    expect(screen.getByRole('button', { name: 'clear all' })).toHaveClass('nc-btn--md');
  });

  it('draws every control large at lg', () => {
    const { container } = render(<Harness size="lg" />);
    expect(container.querySelector('.nc-filterbar')).toHaveClass('nc-filterbar--lg');
    expect(container.querySelector('.nc-input')).toHaveClass('nc-input--lg');
    expect(container.querySelector('.nc-select')).toHaveClass('nc-select--lg');
    expect(container.querySelector('.nc-multiselect')).toHaveClass('nc-multiselect--lg');
    expect(screen.getByRole('button', { name: 'clear all' })).toHaveClass('nc-btn--lg');
  });

  it('draws the filters button large too', () => {
    aNarrowBar();
    render(<Harness size="lg" />);
    expect(screen.getByRole('button', { name: 'filters' })).toHaveClass('nc-btn--lg');
  });

  it('has no axe violations at lg', async () => {
    const { container } = render(<Harness size="lg" />);
    await expectNoAxeViolations(container);
  });

  it('puts the cursor in the search from anywhere on its box', async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    // the glyph before the field is part of the field's label.
    await user.click(container.querySelector('.nc-input__affix')!);
    expect(screen.getByRole('searchbox', { name: 'search titles' })).toHaveFocus();
  });
});

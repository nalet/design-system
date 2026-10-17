import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { SelectionToolbar, Toolbar } from './Toolbar';
import { expectNoAxeViolations } from '../../test/axe';

describe('Toolbar', () => {
  it('is a named toolbar with one emphasized action, the rest default or overflow', async () => {
    const user = userEvent.setup();
    const exportCsv = vi.fn();
    render(
      <Toolbar
        label="missing episodes"
        heading="2,500 missing"
        actions={[
          { id: 'grab', label: 'grab 8 selected', emphasized: true, onSelect: () => undefined },
          { id: 'refresh', label: 'refresh', onSelect: () => undefined },
          { id: 'export', label: 'export csv', overflow: true, onSelect: exportCsv },
        ]}
      />,
    );
    expect(screen.getByRole('toolbar', { name: 'missing episodes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'grab 8 selected' })).toHaveClass('nc-btn--primary');
    expect(screen.getByRole('button', { name: 'refresh' })).toHaveClass('nc-btn--default');
    expect(screen.queryByRole('button', { name: 'export csv' })).toBeNull();
    await user.click(screen.getByRole('button', { name: 'more actions' }));
    await user.click(screen.getByRole('menuitem', { name: 'export csv' }));
    expect(exportCsv).toHaveBeenCalledOnce();
  });

  it('emphasizes only the first of several, and says so', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <Toolbar
        label="t"
        actions={[
          { id: 'a', label: 'first', emphasized: true, onSelect: () => undefined },
          { id: 'b', label: 'second', emphasized: true, onSelect: () => undefined },
        ]}
      />,
    );
    expect(screen.getByRole('button', { name: 'first' })).toHaveClass('nc-btn--primary');
    expect(screen.getByRole('button', { name: 'second' })).not.toHaveClass('nc-btn--primary');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('has one tab stop and moves with the arrow keys', async () => {
    const user = userEvent.setup();
    render(
      <Toolbar
        label="t"
        actions={[
          { id: 'a', label: 'one', emphasized: true, onSelect: () => undefined },
          { id: 'b', label: 'two', onSelect: () => undefined },
          { id: 'c', label: 'three', onSelect: () => undefined },
        ]}
      />,
    );
    const [one, two, three] = ['one', 'two', 'three'].map((n) => screen.getByRole('button', { name: n }));
    expect([one, two, three].map((b) => b.tabIndex)).toEqual([0, -1, -1]);
    await user.tab();
    expect(one).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(two).toHaveFocus();
    await user.keyboard('{End}');
    expect(three).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(one).toHaveFocus();
    expect([one, two, three].map((b) => b.tabIndex)).toEqual([0, -1, -1]);
  });
});

describe('SelectionToolbar', () => {
  it('shows the heading until something is selected, then the count, clear and the action for it', async () => {
    const user = userEvent.setup();
    const clear = vi.fn();
    const grab = vi.fn();
    const props = {
      label: 'missing episodes',
      heading: '2,500 missing',
      onClearSelection: clear,
      primaryAction: (n: number) => (n ? { label: `grab ${n} selected`, onSelect: grab } : null),
    };
    const { container, rerender } = render(<SelectionToolbar {...props} selectedCount={0} />);
    expect(screen.getByText('2,500 missing')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /grab/ })).toBeNull();
    rerender(<SelectionToolbar {...props} selectedCount={8} />);
    expect(container.querySelector('.nc-seltoolbar__number')).toHaveTextContent('8 selected');
    await user.click(screen.getByRole('button', { name: 'grab 8 selected' }));
    expect(grab).toHaveBeenCalledOnce();
    await user.click(screen.getByRole('button', { name: 'clear' }));
    expect(clear).toHaveBeenCalledOnce();
  });

  it('announces a change of the selection politely', () => {
    const { container, rerender } = render(<SelectionToolbar label="t" selectedCount={0} />);
    const live = container.querySelector('[aria-live="polite"]')!;
    expect(live).toHaveTextContent('');
    rerender(<SelectionToolbar label="t" selectedCount={3} />);
    expect(live).toHaveTextContent('3 selected');
    rerender(<SelectionToolbar label="t" selectedCount={0} />);
    expect(live).toHaveTextContent('selection cleared');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <SelectionToolbar
        label="missing episodes"
        selectedCount={8}
        onClearSelection={() => undefined}
        selectAll={{ label: 'select all 2,500', onSelect: () => undefined }}
        primaryAction={(n) => ({ label: `grab ${n} selected`, onSelect: () => undefined })}
        actions={[{ id: 'r', label: 'refresh', onSelect: () => undefined }]}
      />,
    );
    await expectNoAxeViolations(container);
  });

  it('keeps focus in the toolbar when the control that had it goes away', async () => {
    const user = userEvent.setup();
    function Harness() {
      const [n, setN] = React.useState(3);
      return (
        <SelectionToolbar
          label="missing episodes"
          heading="2,500 missing"
          selectedCount={n}
          onClearSelection={() => setN(0)}
          primaryAction={(c) => (c ? { label: `grab ${c} selected`, onSelect: () => setN(0) } : null)}
        />
      );
    }
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'clear' }));
    expect(screen.queryByRole('button', { name: 'clear' })).toBeNull();
    expect(screen.getByRole('toolbar', { name: 'missing episodes' })).toHaveFocus();
  });
});

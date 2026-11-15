import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { MultiSelect, type MultiSelectProps } from './MultiSelect';
import { Language } from '../../lib/language';
import { expectNoAxeViolations } from '../../test/axe';

const STATES: MultiSelectProps['options'] = [
  { value: 'missing', label: 'missing', count: 2318 },
  { value: 'way', label: 'on its way', count: 182 },
  { value: 'attention', label: 'needs attention', count: 3 },
];

const LISTS: MultiSelectProps['options'] = ['Watchlist', 'Rainy Sundays', 'Film club'].map((t) => ({
  value: t,
  label: t,
}));

function Harness({
  initial = [],
  ...rest
}: { initial?: string[] } & Partial<MultiSelectProps>) {
  const [value, setValue] = React.useState<string[]>(initial);
  return (
    <>
      <MultiSelect label="state" options={STATES} value={value} onChange={setValue} {...rest} />
      <button type="button">after</button>
    </>
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('MultiSelect', () => {
  it('is a disclosure: a trigger that says what is chosen, and a group of checkboxes', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'state any' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).not.toHaveAttribute('aria-haspopup');
    const panel = document.getElementById(trigger.getAttribute('aria-controls')!)!;
    expect(panel).not.toBeVisible();
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(panel).toBeVisible();
    // opening doesn't move focus.
    expect(trigger).toHaveFocus();
    const group = screen.getByRole('group', { name: 'state' });
    expect(within(group).getAllByRole('checkbox')).toHaveLength(3);
    await user.click(screen.getByRole('checkbox', { name: 'on its way 182' }));
    expect(screen.getByRole('button', { name: 'state on its way' })).toBe(trigger);
    await user.click(screen.getByRole('checkbox', { name: 'missing 2,318' }));
    expect(screen.getByRole('button', { name: 'state 2 chosen' })).toBe(trigger);
  });

  it('closes on esc with focus back on the trigger, on a press outside, and when focus leaves', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'state any' });
    await user.click(trigger);
    await user.tab();
    expect(screen.getByRole('checkbox', { name: 'missing 2,318' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'after' }));
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'after' })).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('clears every choice, and puts focus back on the trigger', async () => {
    const user = userEvent.setup();
    render(<Harness initial={['way', 'attention']} />);
    const trigger = screen.getByRole('button', { name: 'state 2 chosen' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'clear state' }));
    expect(screen.getByRole('button', { name: 'state any' })).toBe(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
    // clear is there only while something is chosen.
    await user.click(trigger);
    expect(screen.queryByRole('button', { name: 'clear state' })).toBeNull();
  });

  it('takes its own words and its counts from the page\'s language', async () => {
    const user = userEvent.setup();
    render(
      <Language lang="de">
        <Harness />
      </Language>,
    );
    const trigger = screen.getByRole('button', { name: 'state alle' });
    await user.click(trigger);
    // a count is written the German way.
    await user.click(screen.getByRole('checkbox', { name: 'missing 2.318' }));
    await user.click(screen.getByRole('checkbox', { name: 'on its way 182' }));
    expect(screen.getByRole('button', { name: 'state 2 ausgewählt' })).toBe(trigger);
    expect(screen.getByRole('button', { name: 'state zurücksetzen' })).toBeInTheDocument();
  });

  it('lets a prop, or the page\'s own words, replace its words', () => {
    render(
      <>
        <Harness emptyText="all states" />
        <Language words={{ multiSelect: { any: 'everything', clear: 'reset {name}' } }}>
          <MultiSelect label="kind" options={STATES} value={[]} onChange={() => undefined} />
          <MultiSelect label="aired" options={STATES} value={['way']} onChange={() => undefined} />
        </Language>
      </>,
    );
    expect(screen.getByRole('button', { name: 'state all states' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'kind everything' })).toBeInTheDocument();
    expect(screen.getByText('reset aired')).toBeInTheDocument();
  });

  it('can\'t be opened while disabled', async () => {
    const user = userEvent.setup();
    render(<Harness disabled />);
    const trigger = screen.getByRole('button', { name: 'state any' });
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('comes in three sizes', () => {
    const { container } = render(
      <>
        <Harness size="sm" />
        <Harness />
        <Harness size="lg" />
      </>,
    );
    const sizes = Array.from(container.querySelectorAll('.nc-multiselect')).map((el) => el.className);
    expect(sizes[0]).toContain('nc-multiselect--sm');
    expect(sizes[1]).toContain('nc-multiselect--md');
    expect(sizes[2]).toContain('nc-multiselect--lg');
  });

  it('has no axe violations: closed, open, with values chosen, and large', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <Harness />
        <Harness initial={['way']} size="lg" label="aired" />
      </>,
    );
    await expectNoAxeViolations(container);
    await user.click(screen.getByRole('button', { name: 'state any' }));
    await expectNoAxeViolations(container);
    await user.click(screen.getByRole('button', { name: 'aired on its way' }));
    await expectNoAxeViolations(container);
  });
});

describe('MultiSelect, an action under the options', () => {
  function Lists({ onCreate, initial = [] }: { onCreate: () => void; initial?: string[] }) {
    return (
      <Harness
        label="lists"
        options={LISTS}
        initial={initial}
        action={{ label: 'create a list', onSelect: onCreate }}
      />
    );
  }

  it('is in the foot, under the options, whether or not anything is chosen', async () => {
    const user = userEvent.setup();
    const { container } = render(<Lists onCreate={() => undefined} />);
    await user.click(screen.getByRole('button', { name: 'lists any' }));
    const action = screen.getByRole('button', { name: 'create a list' });
    const foot = container.querySelector('.nc-multiselect__foot')!;
    expect(foot).toContainElement(action);
    // the foot is outside the part that scrolls.
    expect(container.querySelector('.nc-multiselect__list')).not.toContainElement(action);
    expect(screen.queryByRole('button', { name: 'clear lists' })).toBeNull();
    await user.click(screen.getByRole('checkbox', { name: 'Watchlist' }));
    expect(foot).toContainElement(screen.getByRole('button', { name: 'clear lists' }));
    expect(foot).toContainElement(screen.getByRole('button', { name: 'create a list' }));
  });

  it('comes after the checkboxes and before clear, for the keyboard', async () => {
    const user = userEvent.setup();
    render(<Lists onCreate={() => undefined} initial={['Watchlist']} />);
    const trigger = screen.getByRole('button', { name: 'lists Watchlist' });
    trigger.focus();
    await user.keyboard('{Enter}');
    await user.tab();
    expect(screen.getByRole('checkbox', { name: 'Watchlist' })).toHaveFocus();
    await user.tab();
    await user.tab();
    expect(screen.getByRole('checkbox', { name: 'Film club' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'create a list' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'clear lists' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'after' })).toHaveFocus();
  });

  it('closes the panel and puts focus back on the trigger before it runs', async () => {
    const user = userEvent.setup();
    let focusedWhenItRan: Element | null = null;
    const trigger = () => screen.getByRole('button', { name: /^lists/ });
    const onCreate = vi.fn(() => {
      focusedWhenItRan = document.activeElement;
    });
    render(<Lists onCreate={onCreate} initial={['Watchlist']} />);
    await user.click(trigger());
    await user.click(screen.getByRole('button', { name: 'create a list' }));
    expect(onCreate).toHaveBeenCalledOnce();
    // when the action ran, focus was already on the trigger: a dialog it
    // opens gives focus back there.
    expect(focusedWhenItRan).toBe(trigger());
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    expect(trigger()).toHaveFocus();
    // the choice is as it was.
    expect(trigger()).toHaveTextContent('Watchlist');
  });

  it('has no axe violations, open, with the action and clear', async () => {
    const user = userEvent.setup();
    const { container } = render(<Lists onCreate={() => undefined} initial={['Watchlist']} />);
    await user.click(screen.getByRole('button', { name: 'lists Watchlist' }));
    await expectNoAxeViolations(container);
  });
});

describe('MultiSelect, a long list of options', () => {
  // jsdom lays nothing out: give the trigger a place in a window, and the
  // panel and its options a height, as a browser would.
  function layout({ top, innerHeight, options, panel }: { top: number; innerHeight: number; options: number; panel: number }) {
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(innerHeight);
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      const isTrigger = this.classList.contains('nc-multiselect__trigger');
      return new DOMRect(0, isTrigger ? top : 0, 120, isTrigger ? 34 : 0);
    });
    // the options as tall as they want (scrollHeight), drawn at most 320 tall; the rest of the panel is 100.
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(function (this: HTMLElement) {
      return this.classList.contains('nc-multiselect__list') ? options : 0;
    });
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
      if (this.classList.contains('nc-multiselect__list')) return Math.min(options, 320);
      if (this.classList.contains('nc-multiselect__panel')) return Math.min(options, 320) + panel;
      return 0;
    });
  }

  async function open() {
    const user = userEvent.setup();
    const { container } = render(<Harness label="lists" options={LISTS} />);
    await user.click(screen.getByRole('button', { name: 'lists any' }));
    return {
      panel: container.querySelector<HTMLElement>('.nc-multiselect__panel')!,
      list: container.querySelector<HTMLElement>('.nc-multiselect__list')!,
    };
  }

  it('keeps the options in a part of their own, with the checkboxes in it', async () => {
    const { panel, list } = await open();
    expect(panel).toContainElement(list);
    expect(within(list).getAllByRole('checkbox')).toHaveLength(3);
    // nothing measured (as in a test): below the trigger, at its own height.
    expect(panel).not.toHaveClass('nc-multiselect__panel--above');
    expect(list.style.maxHeight).toBe('');
  });

  it('opens below the trigger while it fits there', async () => {
    // 700 of options, drawn 320 tall, and 100 of foot and padding: 420. below: 768 - 8 - (234 + 4) = 522.
    layout({ top: 200, innerHeight: 768, options: 700, panel: 100 });
    const { panel, list } = await open();
    expect(panel).not.toHaveClass('nc-multiselect__panel--above');
    expect(list.style.maxHeight).toBe('');
  });

  it('opens above when it wouldn\'t fit below and there is more room above', async () => {
    // below: 768 - 8 - (634 + 4) = 122; above: 600 - 4 - 8 = 588.
    layout({ top: 600, innerHeight: 768, options: 700, panel: 100 });
    const { panel, list } = await open();
    expect(panel).toHaveClass('nc-multiselect__panel--above');
    expect(list.style.maxHeight).toBe('');
  });

  it('scrolls the options sooner, to keep 8px from the window\'s edge', async () => {
    // below: 500 - 8 - (234 + 4) = 254, more than the 188 above; the options get 254 - 100.
    layout({ top: 200, innerHeight: 500, options: 700, panel: 100 });
    const { panel, list } = await open();
    expect(panel).not.toHaveClass('nc-multiselect__panel--above');
    expect(list.style.maxHeight).toBe('154px');
  });

  it('scrolls the options sooner above the trigger too', async () => {
    // above: 300 - 4 - 8 = 288, more than the 116 below; the options get 288 - 100.
    layout({ top: 300, innerHeight: 462, options: 700, panel: 100 });
    const { panel, list } = await open();
    expect(panel).toHaveClass('nc-multiselect__panel--above');
    expect(list.style.maxHeight).toBe('188px');
  });

  it('follows the window when it changes size', async () => {
    layout({ top: 200, innerHeight: 768, options: 700, panel: 100 });
    const { list } = await open();
    expect(list.style.maxHeight).toBe('');
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(500);
    fireEvent(window, new Event('resize'));
    expect(list.style.maxHeight).toBe('154px');
  });
});

describe('MultiSelect, on a tv', () => {
  function Tv() {
    return (
      <div data-nc-screen="tv">
        <Harness label="lists" options={LISTS} action={{ label: 'create a list', onSelect: () => undefined }} />
      </div>
    );
  }

  it('goes through the open panel with up and down, and stops at its ends', async () => {
    const user = userEvent.setup();
    render(<Tv />);
    const trigger = screen.getByRole('button', { name: 'lists any' });
    trigger.focus();
    // ok opens it; focus stays on the trigger.
    await user.keyboard('{Enter}');
    expect(trigger).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('checkbox', { name: 'Watchlist' })).toHaveFocus();
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
    expect(screen.getByRole('button', { name: 'create a list' })).toHaveFocus();
    // the last stop: down stays.
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'create a list' })).toHaveFocus();
    await user.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}');
    expect(trigger).toHaveFocus();
  });

  it('ticks a checkbox with ok, as space does', async () => {
    const user = userEvent.setup();
    render(<Tv />);
    const trigger = screen.getByRole('button', { name: 'lists any' });
    trigger.focus();
    await user.keyboard('{Enter}{ArrowDown}{ArrowDown}{Enter}');
    expect(screen.getByRole('checkbox', { name: 'Rainy Sundays' })).toBeChecked();
    expect(trigger).toHaveTextContent('Rainy Sundays');
    // back closes it, with focus on the trigger.
    await user.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('leaves the arrows and enter alone on other screens', async () => {
    const user = userEvent.setup();
    render(<Harness label="lists" options={LISTS} />);
    const trigger = screen.getByRole('button', { name: 'lists any' });
    await user.click(trigger);
    await user.keyboard('{ArrowDown}');
    expect(trigger).toHaveFocus();
    await user.tab();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('checkbox', { name: 'Watchlist' })).not.toBeChecked();
  });
});

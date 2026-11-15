import * as React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TopBar, type TopBarProps, type TopBarResultGroup } from './TopBar';
import { UserMenu } from '../UserMenu/UserMenu';
import { Language } from '../../lib/language';
import { expectNoAxeViolations } from '../../test/axe';

// jsdom measures nothing: a stand-in ResizeObserver says how wide the bar is.
let barWidth = 1200;
const observers = new Set<FakeResizeObserver>();
class FakeResizeObserver {
  constructor(private readonly callback: ResizeObserverCallback) {
    observers.add(this);
  }
  observe() {
    this.report();
  }
  unobserve() {}
  disconnect() {
    observers.delete(this);
  }
  report() {
    this.callback([{ contentRect: { width: barWidth } } as ResizeObserverEntry], this as unknown as ResizeObserver);
  }
}
function resizeTo(width: number) {
  barWidth = width;
  act(() => observers.forEach((o) => o.report()));
}

beforeEach(() => {
  barWidth = 1200;
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);
});
afterEach(() => {
  vi.unstubAllGlobals();
  observers.clear();
});

/** the names of everything in the bar that takes the focus, in order. */
const stopsOf = (bar: HTMLElement) =>
  Array.from(bar.querySelectorAll('a[href], input, button')).map((el) => el.getAttribute('aria-label'));

const RESULTS: TopBarResultGroup[] = [
  { title: 'apps', results: [{ id: 'downloads', label: 'downloads', href: '#downloads' }] },
  {
    title: 'in downloads',
    results: [
      { id: 'harbour', label: 'The Quiet Harbour', detail: 'queued' },
      { id: 'down-east', label: 'Down East', detail: 'done' },
    ],
  },
];

/** a bar whose search holds its own word, as an app's would. */
function Bar({
  results,
  onSelect,
  ...props
}: Omit<Partial<TopBarProps>, 'results' | 'onSelect'> & { results?: TopBarResultGroup[]; onSelect?: (id: string) => void }) {
  const [query, setQuery] = React.useState('');
  const wired = results?.map((g) => ({
    ...g,
    results: g.results.map((r) => ({ ...r, onSelect: () => onSelect?.(r.id) })),
  }));
  return (
    <TopBar
      product="platform"
      app="downloads"
      search={{ value: query, onChange: setQuery, label: 'search apps', results: wired }}
      unread={2}
      onNotifications={() => undefined}
      userMenu={<UserMenu name="Ada Urban" email="ada.urban@example.org" onSignOut={() => undefined} />}
      {...props}
    />
  );
}

describe('TopBar', () => {
  it('is the page’s header, and its product’s name a link named after where it goes', () => {
    render(<Bar homeHref="/home" />);
    const bar = screen.getByRole('banner');
    const home = within(bar).getByRole('link', { name: 'platform, home' });
    expect(home).toHaveAttribute('href', '/home');
    expect(home).toHaveTextContent('platform');
    // the chevron is decoration.
    expect(home.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows the open app’s name after a slash that is not read', () => {
    render(<Bar />);
    const app = screen.getByText('downloads').parentElement!;
    expect(app).toHaveTextContent('/downloads');
    expect(app.querySelector('[aria-hidden="true"]')).toHaveTextContent('/');
  });

  it('holds its parts in order: the names, the search, the notifications, the user menu', () => {
    render(<Bar />);
    const stops = stopsOf(screen.getByRole('banner'));
    expect(stops).toEqual(['platform, home', 'search apps', 'notifications, 2 unread', 'au, user menu']);
  });

  it('starts with the product’s mark alone, then the search, when the search sits at the start', () => {
    render(<Bar searchPlacement="start" />);
    const bar = screen.getByRole('banner');
    const stops = stopsOf(bar);
    expect(stops).toEqual(['platform, home', 'search apps', 'notifications, 2 unread', 'au, user menu']);
    const mark = within(bar).getByRole('link', { name: 'platform, home' });
    expect(mark).toHaveAttribute('title', 'platform, home');
    expect(mark).toHaveTextContent(/^p$/);
    expect(screen.queryByText('downloads')).toBeNull();
  });

  it('gives the search a region and a field named after what it finds, and reports what is typed', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TopBar product="platform" search={{ value: '', onChange, label: 'search apps' }} />);
    expect(screen.getByRole('search', { name: 'search apps' })).toBeInTheDocument();
    const field = screen.getByRole('searchbox', { name: 'search apps' });
    expect(field).toHaveAttribute('placeholder', 'search apps…');
    await user.type(field, 'd');
    expect(onChange).toHaveBeenCalledWith('d');
  });

  it('has no search, no bell and no user menu unless it is given them', () => {
    render(<TopBar product="platform" />);
    expect(screen.queryByRole('search')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('names the bell with its count, shows the count, and reports a press', async () => {
    const user = userEvent.setup();
    const onNotifications = vi.fn();
    const { rerender } = render(<TopBar product="platform" unread={2500} onNotifications={onNotifications} />);
    const bell = screen.getByRole('button', { name: 'notifications, 2,500 unread' });
    expect(bell).toHaveTextContent('2,500');
    expect(bell).not.toHaveAttribute('aria-expanded');
    await user.click(bell);
    expect(onNotifications).toHaveBeenCalledOnce();
    rerender(<TopBar product="platform" unread={0} onNotifications={onNotifications} notificationsExpanded />);
    const quiet = screen.getByRole('button', { name: 'notifications' });
    expect(quiet).toHaveTextContent('');
    expect(quiet).toHaveAttribute('aria-expanded', 'true');
  });

  describe('the / key', () => {
    it('moves the focus to the search from anywhere on the page', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Bar />
          <button type="button">elsewhere</button>
          <input type="checkbox" aria-label="a checkbox" />
        </>,
      );
      screen.getByRole('button', { name: 'elsewhere' }).focus();
      await user.keyboard('/');
      const field = screen.getByRole('searchbox');
      expect(field).toHaveFocus();
      expect(field).toHaveValue('');
      screen.getByRole('checkbox').focus();
      await user.keyboard('/');
      expect(field).toHaveFocus();
    });

    it('is left alone while the person types in a field, a text area, a select or anything editable', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Bar />
          <input aria-label="a field" />
          <textarea aria-label="a text area" />
          <select aria-label="a select">
            <option>one</option>
          </select>
          <div contentEditable suppressContentEditableWarning aria-label="a note" role="textbox" tabIndex={0} />
        </>,
      );
      const search = screen.getByRole('searchbox');
      for (const name of ['a field', 'a text area', 'a select', 'a note']) {
        screen.getByLabelText(name).focus();
        await user.keyboard('/');
        expect(search).not.toHaveFocus();
      }
      expect(screen.getByLabelText('a field')).toHaveValue('/');
      // in the search itself, it is a slash.
      search.focus();
      await user.keyboard('a/b');
      expect(search).toHaveValue('a/b');
    });
  });

  it('leaves the / key alone under a dialog that blocks the page', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Bar />
        <div role="dialog" aria-modal="true" aria-label="a question">
          <button type="button">cancel</button>
        </div>
      </>,
    );
    screen.getByRole('button', { name: 'cancel' }).focus();
    await user.keyboard('/');
    expect(screen.getByRole('button', { name: 'cancel' })).toHaveFocus();
  });

  describe('the results', () => {
    it('are a list under the field that opens with a typed word, in the app’s groups', async () => {
      const user = userEvent.setup();
      render(<Bar results={RESULTS} />);
      const field = screen.getByRole('combobox', { name: 'search apps' });
      expect(field).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('listbox')).toBeNull();
      await user.type(field, 'down');
      expect(field).toHaveAttribute('aria-expanded', 'true');
      const list = screen.getByRole('listbox', { name: 'results' });
      expect(field).toHaveAttribute('aria-controls', list.id);
      expect(within(list).getAllByRole('group').map((g) => g.getAttribute('aria-labelledby') && g.firstElementChild!.textContent)).toEqual([
        'apps',
        'in downloads',
      ]);
      expect(within(list).getAllByRole('option').map((o) => o.textContent)).toEqual([
        'downloads',
        'The Quiet Harbourqueued',
        'Down Eastdone',
      ]);
      expect(within(list).getByRole('option', { name: 'downloads' })).toHaveAttribute('href', '#downloads');
    });

    it('says how many there are while the person types', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<Bar results={RESULTS} />);
      const status = screen.getByRole('status');
      expect(status).toHaveTextContent('');
      await user.type(screen.getByRole('combobox'), 'down');
      expect(status).toHaveTextContent('3 results');
      rerender(<Bar results={[{ title: 'apps', results: RESULTS[0].results }]} />);
      expect(status).toHaveTextContent('1 result');
    });

    it('says a count the page gives, where the page answers instead of a list', () => {
      render(<TopBar product="platform" search={{ value: 'down', onChange: () => undefined, resultCount: 12 }} />);
      expect(screen.getByRole('status')).toHaveTextContent('12 results');
      expect(screen.getByRole('searchbox', { name: 'search' })).toBeInTheDocument();
    });

    it('says so when nothing was found', async () => {
      const user = userEvent.setup();
      render(<Bar results={[]} />);
      const field = screen.getByRole('combobox');
      await user.type(field, 'zzz');
      expect(screen.getByText('no results')).toBeVisible();
      expect(screen.getByRole('status')).toHaveTextContent('0 results');
      // nothing to pick: no list, and the field says it has none open.
      expect(screen.queryByRole('listbox')).toBeNull();
      expect(field).toHaveAttribute('aria-expanded', 'false');
      await user.keyboard('{Escape}');
      expect(screen.queryByText('no results')).toBeNull();
      expect(field).toHaveValue('zzz');
    });

    it('are picked with the arrow keys and chosen with enter, the focus staying in the field', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<Bar results={RESULTS} onSelect={onSelect} />);
      const field = screen.getByRole('combobox');
      await user.type(field, 'down');
      const options = screen.getAllByRole('option');
      expect(field).not.toHaveAttribute('aria-activedescendant');
      await user.keyboard('{ArrowDown}');
      expect(field).toHaveAttribute('aria-activedescendant', options[0].id);
      expect(options[0]).toHaveAttribute('aria-selected', 'true');
      await user.keyboard('{ArrowUp}');
      expect(field).toHaveAttribute('aria-activedescendant', options[2].id);
      await user.keyboard('{ArrowDown}{ArrowDown}');
      expect(field).toHaveAttribute('aria-activedescendant', options[1].id);
      expect(field).toHaveFocus();
      await user.keyboard('{Enter}');
      expect(onSelect).toHaveBeenCalledWith('harbour');
      expect(screen.queryByRole('listbox')).toBeNull();
      expect(field).toHaveFocus();
    });

    it('are chosen with a press', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<Bar results={RESULTS} onSelect={onSelect} />);
      await user.type(screen.getByRole('combobox'), 'down');
      await user.click(screen.getByRole('option', { name: /Down East/ }));
      expect(onSelect).toHaveBeenCalledWith('down-east');
      expect(screen.queryByRole('listbox')).toBeNull();
    });

    it('close on esc, and a second esc empties the field', async () => {
      const user = userEvent.setup();
      render(<Bar results={RESULTS} />);
      const field = screen.getByRole('combobox');
      await user.type(field, 'down');
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('listbox')).toBeNull();
      expect(field).toHaveValue('down');
      await user.keyboard('{Escape}');
      expect(field).toHaveValue('');
      expect(field).toHaveFocus();
    });

    it('close when the focus leaves the search, and come back with it', async () => {
      const user = userEvent.setup();
      render(<Bar results={RESULTS} />);
      const field = screen.getByRole('combobox');
      await user.type(field, 'down');
      await user.tab();
      expect(screen.queryByRole('listbox')).toBeNull();
      await user.tab({ shift: true });
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('hand enter to the app when none is picked', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<TopBar product="platform" search={{ value: 'down', onChange: () => undefined, onSubmit }} />);
      screen.getByRole('searchbox').focus();
      await user.keyboard('{Enter}');
      expect(onSubmit).toHaveBeenCalledWith('down');
    });
  });

  describe('a narrow bar', () => {
    it('folds the search into an icon just before the notifications, and starts with the product’s name', () => {
      render(<Bar searchPlacement="start" />);
      resizeTo(390);
      const stops = stopsOf(screen.getByRole('banner'));
      expect(stops).toEqual(['platform, home', 'search', 'notifications, 2 unread', 'au, user menu']);
      expect(screen.queryByRole('search')).toBeNull();
      expect(screen.getByRole('link', { name: 'platform, home' })).toHaveTextContent('platform');
      // the product's name alone: the app's own header says where people are.
      expect(screen.queryByText('downloads')).toBeNull();
    });

    it('is narrow below its threshold, which can be moved', () => {
      render(<Bar narrowBelow={480} />);
      resizeTo(599);
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
      resizeTo(479);
      expect(screen.queryByRole('searchbox')).toBeNull();
      resizeTo(480);
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('opens the field across the whole bar with the focus in it, and the close button gives the bar back', async () => {
      const user = userEvent.setup();
      render(<Bar />);
      resizeTo(390);
      await user.click(screen.getByRole('button', { name: 'search' }));
      const field = screen.getByRole('searchbox', { name: 'search apps' });
      expect(field).toHaveFocus();
      // the field and its way back are all the bar holds.
      expect(screen.queryByRole('link')).toBeNull();
      expect(screen.getAllByRole('button').map((b) => b.getAttribute('aria-label'))).toEqual(['close search']);
      await user.keyboard('down');
      await user.click(screen.getByRole('button', { name: 'close search' }));
      expect(screen.queryByRole('searchbox')).toBeNull();
      expect(screen.getByRole('button', { name: 'search' })).toHaveFocus();
      // the word went with the field: nothing stays searched for out of sight.
      await user.click(screen.getByRole('button', { name: 'search' }));
      expect(screen.getByRole('searchbox')).toHaveValue('');
    });

    it('closes the field on esc and returns the focus to the icon', async () => {
      const user = userEvent.setup();
      render(<Bar results={RESULTS} />);
      resizeTo(390);
      await user.click(screen.getByRole('button', { name: 'search' }));
      await user.keyboard('down');
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      // the first esc closes the list, the second the field.
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('listbox')).toBeNull();
      expect(screen.getByRole('combobox')).toHaveFocus();
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('combobox')).toBeNull();
      expect(screen.getByRole('button', { name: 'search' })).toHaveFocus();
    });

    it('gives the bar back when a result is chosen', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<Bar results={RESULTS} onSelect={onSelect} />);
      resizeTo(390);
      await user.click(screen.getByRole('button', { name: 'search' }));
      await user.keyboard('down{ArrowDown}{Enter}');
      expect(onSelect).toHaveBeenCalledWith('downloads');
      expect(screen.queryByRole('combobox')).toBeNull();
      expect(screen.getByRole('button', { name: 'search' })).toHaveFocus();
      expect(screen.getByRole('link', { name: 'platform, home' })).toBeInTheDocument();
    });

    it('keeps a field that has the focus when its last letter goes', async () => {
      const user = userEvent.setup();
      render(<Bar />);
      resizeTo(1200);
      const field = screen.getByRole('searchbox');
      await user.type(field, 'd');
      resizeTo(390);
      await user.keyboard('{Backspace}');
      expect(screen.getByRole('searchbox')).toHaveFocus();
      expect(screen.getByRole('searchbox')).toHaveValue('');
    });

    it('opens the field on the / key', async () => {
      const user = userEvent.setup();
      render(<Bar />);
      resizeTo(390);
      await user.keyboard('/');
      expect(screen.getByRole('searchbox')).toHaveFocus();
    });

    it('folds an empty field back when the focus leaves it, and keeps one that holds a word', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Bar />
          <button type="button">elsewhere</button>
        </>,
      );
      resizeTo(390);
      await user.click(screen.getByRole('button', { name: 'search' }));
      await user.click(screen.getByRole('button', { name: 'elsewhere' }));
      expect(screen.queryByRole('searchbox')).toBeNull();
      await user.click(screen.getByRole('button', { name: 'search' }));
      await user.keyboard('down');
      await user.click(screen.getByRole('button', { name: 'elsewhere' }));
      expect(screen.getByRole('searchbox')).toHaveValue('down');
    });

    it('keeps the field, and the focus in it, when the bar gets wide again', async () => {
      const user = userEvent.setup();
      render(<Bar />);
      resizeTo(390);
      await user.click(screen.getByRole('button', { name: 'search' }));
      const field = screen.getByRole('searchbox');
      resizeTo(1200);
      expect(screen.getByRole('searchbox')).toBe(field);
      expect(field).toHaveFocus();
      expect(screen.getByRole('link', { name: 'platform, home' })).toBeInTheDocument();
    });
  });

  it('takes its words from the page’s language', async () => {
    const user = userEvent.setup();
    render(
      <Language lang="de">
        <Bar results={[]} unread={2500} />
      </Language>,
    );
    expect(screen.getByRole('link', { name: 'platform, startseite' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'benachrichtigungen, 2.500 ungelesen' })).toHaveTextContent('2.500');
    await user.type(screen.getByRole('combobox'), 'zzz');
    expect(screen.getByText('keine ergebnisse')).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('0 ergebnisse');
    resizeTo(390);
    expect(screen.getByRole('button', { name: 'suche schließen' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'suche schließen' }));
    expect(screen.getByRole('button', { name: 'suchen' })).toHaveFocus();
  });

  it('names a search without a label "search", with a placeholder to match', () => {
    render(<TopBar product="platform" search={{ value: '', onChange: () => undefined }} />);
    expect(screen.getByRole('searchbox', { name: 'search' })).toHaveAttribute('placeholder', 'search…');
  });

  it('moves between its controls with the left and right arrows on a tv', async () => {
    const user = userEvent.setup();
    render(
      <div data-nc-screen="tv">
        <Bar />
      </div>,
    );
    const home = screen.getByRole('link', { name: 'platform, home' });
    const field = screen.getByRole('searchbox');
    home.focus();
    await user.keyboard('{ArrowRight}');
    expect(field).toHaveFocus();
    // inside the field's text, the arrows move the caret.
    await user.keyboard('ab{ArrowLeft}');
    expect(field).toHaveFocus();
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(screen.getByRole('button', { name: 'notifications, 2 unread' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'au, user menu' })).toHaveFocus();
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(field).toHaveFocus();
  });

  it('leaves the arrows alone on a screen for a pointer and a keyboard', async () => {
    const user = userEvent.setup();
    render(<Bar />);
    const home = screen.getByRole('link', { name: 'platform, home' });
    home.focus();
    await user.keyboard('{ArrowRight}');
    expect(home).toHaveFocus();
  });

  describe('axe', () => {
    it('finds nothing in a bar with an app open', async () => {
      const { container } = render(<Bar />);
      await expectNoAxeViolations(container);
    });

    it('finds nothing with the search at the start', async () => {
      const { container } = render(<Bar searchPlacement="start" />);
      await expectNoAxeViolations(container);
    });

    it('finds nothing with the results open, one picked, and with none found', async () => {
      const user = userEvent.setup();
      const { container, rerender } = render(<Bar results={RESULTS} />);
      await expectNoAxeViolations(container);
      await user.type(screen.getByRole('combobox'), 'down');
      await user.keyboard('{ArrowDown}');
      await expectNoAxeViolations(container);
      rerender(<Bar results={[]} />);
      expect(screen.getByText('no results')).toBeVisible();
      await expectNoAxeViolations(container);
    });

    it('finds nothing in a narrow bar, with its field folded and open', async () => {
      const user = userEvent.setup();
      const { container } = render(<Bar />);
      resizeTo(390);
      await expectNoAxeViolations(container);
      await user.click(screen.getByRole('button', { name: 'search' }));
      await expectNoAxeViolations(container);
    });

    it('finds nothing with the user menu open', async () => {
      const user = userEvent.setup();
      const { container } = render(<Bar />);
      await user.click(screen.getByRole('button', { name: 'au, user menu' }));
      await expectNoAxeViolations(container);
    });
  });
});

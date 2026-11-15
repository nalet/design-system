import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Rail, type RailProps } from './Rail';
import { Language } from '../../lib/language';
import type { NavigateHandler, NavigationItem } from '../../lib/navigation';
import { expectNoAxeViolations } from '../../test/axe';

const icon = <svg viewBox="0 0 24 24" width="1.5rem" height="1.5rem" />;
const view = (name: string): NavigationItem => ({ href: `/${name}`, name, icon });

const VIEWS = ['home', 'films', 'series', 'watchlist'].map(view);
const SETTINGS = view('settings');
const MARK = { href: '/', product: 'Video' };

const link = (name: string) => screen.getByRole('link', { name });
/** the focus, moved the way a page's own arrow keys move it. */
const focus = (el: HTMLElement) => act(() => el.focus());

function wide(props: Partial<RailProps> = {}) {
  return render(<Rail views={VIEWS} foot={SETTINGS} mark={MARK} current="/films" {...props} />);
}

/** a tv: the rail beside a page with one thing that takes the focus. */
function tv(props: Partial<RailProps> = {}) {
  return render(
    <div data-nc-screen="tv">
      <Rail
        head={[{ ...view('account'), name: 'Alex Urban', keepCase: true }, view('search')]}
        views={VIEWS}
        foot={[{ ...view('notifications'), count: 2, label: 'notifications, 2 unread' }, SETTINGS]}
        current="/films"
        {...props}
      />
      <button type="button">play</button>
    </div>,
  );
}

describe('Rail', () => {
  it('is a navigation landmark named views, each view a link named after it', () => {
    wide();
    const nav = screen.getByRole('navigation', { name: 'views' });
    expect(nav).toContainElement(link('films'));
    expect(link('films')).toHaveAttribute('href', '/films');
    // the name is the link's tooltip too, and its icon is decoration.
    expect(link('films')).toHaveAttribute('title', 'films');
    expect(link('films').querySelector('svg')?.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(screen.getAllByRole('list')).toHaveLength(2);
  });

  it('marks the current view as the current page, and as current on a screen inside it', () => {
    const { rerender } = wide();
    expect(link('films')).toHaveAttribute('aria-current', 'page');
    expect(link('films')).toHaveClass('nc-rail__item--current');
    expect(link('home')).not.toHaveAttribute('aria-current');

    rerender(<Rail views={VIEWS} foot={SETTINGS} current="/watchlist" inside />);
    expect(link('watchlist')).toHaveAttribute('aria-current', 'true');

    // a screen that is none of the views: none is current.
    rerender(<Rail views={VIEWS} foot={SETTINGS} />);
    expect(document.querySelector('[aria-current]')).toBeNull();

    // settings, at the foot, is the current one while it is open.
    rerender(<Rail views={VIEWS} foot={SETTINGS} current="/settings" />);
    expect(link('settings')).toHaveAttribute('aria-current', 'page');
  });

  it('is one tab stop: on the current view, or on the first where none is current', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <>
        <Rail views={VIEWS} foot={SETTINGS} current="/films" />
        <button type="button">play</button>
      </>,
    );
    await user.tab();
    expect(link('films')).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'play' })).toHaveFocus();

    rerender(
      <>
        <Rail views={VIEWS} foot={SETTINGS} />
        <button type="button">play</button>
      </>,
    );
    await user.tab({ shift: true });
    expect(link('home')).toHaveFocus();
  });

  it('moves with the up and down arrow keys, home and end, settings included', async () => {
    const user = userEvent.setup();
    wide();
    await user.tab(); // the mark is a stop of its own, before the views
    expect(link('Video home')).toHaveFocus();
    await user.tab();
    expect(link('films')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(link('series')).toHaveFocus();
    await user.keyboard('{End}');
    expect(link('settings')).toHaveFocus();
    await user.keyboard('{ArrowDown}'); // past the last, on at the first
    expect(link('home')).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(link('settings')).toHaveFocus();
    await user.keyboard('{Home}');
    expect(link('home')).toHaveFocus();
    // moving opens nothing: films is still the current view.
    expect(link('films')).toHaveAttribute('aria-current', 'page');
  });

  it('keeps the stop where the focus is, and gives it back to the current view once the focus leaves', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">search</button>
        <Rail views={VIEWS} foot={SETTINGS} current="/films" />
      </>,
    );
    await user.tab();
    await user.tab();
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(link('watchlist')).toHaveFocus();
    expect(link('watchlist')).toHaveAttribute('tabindex', '0');
    expect(link('films')).toHaveAttribute('tabindex', '-1');
    // shift+tab leaves the rail in one press, however far the arrows went.
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'search' })).toHaveFocus();
    expect(link('films')).toHaveAttribute('tabindex', '0');
  });

  it('lets a router take a press over, and leaves a press that opens the view elsewhere alone', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn<NavigateHandler>((e) => e.preventDefault());
    wide({ onNavigate });
    await user.click(link('series'));
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate.mock.calls[0][1]).toBe('/series');
    await user.click(link('Video home'));
    expect(onNavigate.mock.calls[1][1]).toBe('/');
    // with a key that opens a new tab, the browser keeps the press.
    onNavigate.mockClear();
    const stay = (e: Event) => e.preventDefault(); // jsdom can't open a link; the page keeps it from trying
    document.addEventListener('click', stay);
    fireEvent.click(link('series'), { ctrlKey: true });
    fireEvent.click(link('series'), { metaKey: true });
    fireEvent.click(link('series'), { button: 1 });
    document.removeEventListener('click', stay);
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('draws the product’s mark as a link home, named after the product', () => {
    wide();
    const mark = link('Video home');
    expect(mark).toHaveAttribute('href', '/');
    expect(mark).toHaveAttribute('title', 'Video home');
    // the chevron and the first letter are decoration.
    expect(mark.querySelector('.nc-rail__letter')).toHaveTextContent('V');
    expect(mark.querySelector('.nc-rail__letter')).toHaveAttribute('aria-hidden', 'true');
    expect(mark.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('takes its words from the page’s language, and a label of its own first', () => {
    const { rerender } = render(
      <Language lang="de">
        <Rail views={VIEWS} mark={MARK} />
      </Language>,
    );
    expect(screen.getByRole('navigation', { name: 'ansichten' })).toBeInTheDocument();
    expect(link('Video startseite')).toHaveAttribute('title', 'Video startseite');
    rerender(
      <Language lang="de">
        <Rail views={VIEWS} label="bereiche" />
      </Language>,
    );
    expect(screen.getByRole('navigation', { name: 'bereiche' })).toBeInTheDocument();
  });

  it('shows a count on an icon, written in the page’s language, and reads the label', () => {
    render(
      <Language lang="de">
        <Rail views={VIEWS} foot={{ ...view('notifications'), count: 2500, label: 'notifications, 2500 unread' }} />
      </Language>,
    );
    const bell = link('notifications, 2500 unread');
    expect(bell.querySelector('.nc-rail__count')).toHaveTextContent('2.500');
    expect(bell.querySelector('.nc-rail__count')?.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(bell).toHaveAttribute('title', 'notifications');
    // no count, or none above zero: nothing is drawn.
    expect(link('home').querySelector('.nc-rail__count')).toBeNull();
  });

  it('warns about a sixth view', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(<Rail views={[...VIEWS, view('downloads'), view('music')]} />);
    expect(warn).toHaveBeenCalledWith('Rail: 6 views; a rail holds up to five.');
    warn.mockRestore();
  });

  describe('on a tv', () => {
    it('opens while the focus is in it, and closes when the focus leaves', async () => {
      const user = userEvent.setup();
      tv();
      const nav = screen.getByRole('navigation', { name: 'views' });
      expect(nav).not.toHaveClass('nc-rail--open');
      await user.tab();
      expect(link('films')).toHaveFocus();
      expect(nav).toHaveClass('nc-rail--open');
      await user.tab();
      expect(screen.getByRole('button', { name: 'play' })).toHaveFocus();
      expect(nav).not.toHaveClass('nc-rail--open');
    });

    it('can be kept open or closed', async () => {
      const user = userEvent.setup();
      const { rerender } = tv({ open: true });
      const nav = screen.getByRole('navigation', { name: 'views' });
      expect(nav).toHaveClass('nc-rail--open');
      rerender(
        <div data-nc-screen="tv">
          <Rail views={VIEWS} open={false} />
        </div>,
      );
      await user.tab();
      expect(screen.getByRole('navigation', { name: 'views' })).not.toHaveClass('nc-rail--open');
    });

    it('takes the focus on the current view, whichever item it reached first', () => {
      tv();
      const play = screen.getByRole('button', { name: 'play' });
      focus(play);
      // the page's own arrow keys found settings, the nearest item to its left.
      focus(link('settings'));
      expect(link('films')).toHaveFocus();
      // inside the rail, the focus goes where it is sent.
      focus(link('settings'));
      expect(link('settings')).toHaveFocus();
    });

    it('puts the focus back on the page with → or back, and says so', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      tv({ onClose });
      const play = screen.getByRole('button', { name: 'play' });
      const nav = screen.getByRole('navigation', { name: 'views' });
      focus(play);
      focus(link('films'));
      await user.keyboard('{ArrowDown}');
      expect(link('series')).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(play).toHaveFocus();
      expect(nav).not.toHaveClass('nc-rail--open');
      expect(onClose).toHaveBeenCalledTimes(1);

      focus(link('films'));
      await user.keyboard('{Escape}');
      expect(play).toHaveFocus();
      expect(onClose).toHaveBeenCalledTimes(2);
    });

    it('stops at its first and its last item', async () => {
      const user = userEvent.setup();
      tv();
      await user.tab();
      await user.keyboard('{End}');
      expect(link('settings')).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(link('settings')).toHaveFocus();
      await user.keyboard('{Home}');
      expect(link('Alex Urban')).toHaveFocus();
      await user.keyboard('{ArrowUp}');
      expect(link('Alex Urban')).toHaveFocus();
    });

    it('goes to the first view where none is current, past the person and the search', async () => {
      const user = userEvent.setup();
      tv({ current: undefined });
      await user.tab();
      expect(link('home')).toHaveFocus();
    });

    it('marks a person’s own name, so it keeps its capitals', () => {
      tv({ open: true });
      expect(screen.getByText('Alex Urban')).toHaveClass('nc-rail__name--keep');
      expect(screen.getByText('films')).not.toHaveClass('nc-rail__name--keep');
    });
  });

  it('has no axe violations on a wide screen', async () => {
    const { container } = wide();
    await expectNoAxeViolations(container);
  });

  it('has no axe violations on a screen inside a view, and on one that is none of them', async () => {
    const { container, rerender } = wide({ current: '/watchlist', inside: true });
    await expectNoAxeViolations(container);
    rerender(<Rail views={VIEWS} foot={SETTINGS} mark={MARK} />);
    await expectNoAxeViolations(container);
  });

  it('has no axe violations on a screen made for touch', async () => {
    const { container } = render(
      <div data-nc-screen="touch">
        <Rail views={[...VIEWS, view('downloads')]} current="/films" />
      </div>,
    );
    await expectNoAxeViolations(container);
  });

  it.each([false, true])('has no axe violations on a tv (open: %s)', async (open) => {
    const { container } = tv({ open });
    await expectNoAxeViolations(container);
  });
});

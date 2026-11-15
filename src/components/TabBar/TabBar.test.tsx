import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TabBar } from './TabBar';
import { Language } from '../../lib/language';
import type { NavigationItem } from '../../lib/navigation';
import { expectNoAxeViolations } from '../../test/axe';

const icon = <svg viewBox="0 0 24 24" width="1.5rem" height="1.5rem" />;
const view = (name: string): NavigationItem => ({ href: `/${name}`, name, icon });
const VIEWS = ['home', 'films', 'series', 'watchlist', 'downloads'].map(view);

const tab = (name: string) => screen.getByRole('link', { name });

describe('TabBar', () => {
  it('is a navigation landmark named views, each tab a link named after its view', () => {
    render(<TabBar views={VIEWS} current="/films" />);
    const nav = screen.getByRole('navigation', { name: 'views' });
    expect(nav).toContainElement(tab('films'));
    expect(tab('films')).toHaveAttribute('href', '/films');
    expect(tab('films')).toHaveAttribute('title', 'films');
    expect(tab('films').querySelector('svg')?.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
  });

  it('marks the current tab as the current page, as current on a screen inside it, and none on any other', () => {
    const { rerender } = render(<TabBar views={VIEWS} current="/films" />);
    expect(tab('films')).toHaveAttribute('aria-current', 'page');
    expect(tab('films')).toHaveClass('nc-tabbar__item--current');
    rerender(<TabBar views={VIEWS} current="/watchlist" inside />);
    expect(tab('watchlist')).toHaveAttribute('aria-current', 'true');
    expect(tab('films')).not.toHaveAttribute('aria-current');
    rerender(<TabBar views={VIEWS} />);
    expect(document.querySelector('[aria-current]')).toBeNull();
  });

  it('is one tab stop, and moves with the left and right arrow keys, home and end', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">play</button>
        <TabBar views={VIEWS} current="/films" />
      </>,
    );
    await user.tab();
    await user.tab();
    expect(tab('films')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(tab('series')).toHaveFocus();
    await user.keyboard('{End}');
    expect(tab('downloads')).toHaveFocus();
    await user.keyboard('{ArrowRight}'); // past the last, on at the first
    expect(tab('home')).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(tab('downloads')).toHaveFocus();
    await user.keyboard('{Home}');
    expect(tab('home')).toHaveFocus();
    // moving opens nothing, and one press of shift+tab leaves the bar.
    expect(tab('films')).toHaveAttribute('aria-current', 'page');
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'play' })).toHaveFocus();
    expect(tab('films')).toHaveAttribute('tabindex', '0');
  });

  it('puts the stop on the first tab where none is current', async () => {
    const user = userEvent.setup();
    render(<TabBar views={VIEWS} />);
    await user.tab();
    expect(tab('home')).toHaveFocus();
  });

  it('lets a router take a press over, and leaves a press that opens the view elsewhere alone', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn((e: React.MouseEvent) => e.preventDefault());
    render(<TabBar views={VIEWS} current="/films" onNavigate={onNavigate} />);
    await user.click(tab('watchlist'));
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate.mock.calls[0][1]).toBe('/watchlist');
    // pressing the current tab again reaches the router too.
    await user.click(tab('films'));
    expect(onNavigate.mock.calls[1][1]).toBe('/films');
    onNavigate.mockClear();
    const stay = (e: Event) => e.preventDefault(); // jsdom can't open a link; the page keeps it from trying
    document.addEventListener('click', stay);
    fireEvent.click(tab('watchlist'), { ctrlKey: true });
    fireEvent.click(tab('watchlist'), { shiftKey: true });
    document.removeEventListener('click', stay);
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('takes its landmark’s name from the page’s language, and a label of its own first', () => {
    const { rerender } = render(
      <Language lang="de">
        <TabBar views={VIEWS} />
      </Language>,
    );
    expect(screen.getByRole('navigation', { name: 'ansichten' })).toBeInTheDocument();
    rerender(<TabBar views={VIEWS} label="places" />);
    expect(screen.getByRole('navigation', { name: 'places' })).toBeInTheDocument();
  });

  it('shows a count on an icon and reads the label', () => {
    render(<TabBar views={[...VIEWS.slice(0, 4), { ...view('downloads'), count: 3, label: 'downloads, 3 ready' }]} />);
    expect(tab('downloads, 3 ready').querySelector('.nc-tabbar__count')).toHaveTextContent('3');
  });

  it('warns about a sixth tab', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(<TabBar views={[...VIEWS, view('settings')]} />);
    expect(warn).toHaveBeenCalledWith('TabBar: 6 views; a tab bar holds up to five.');
    warn.mockRestore();
  });

  it('has no axe violations with a current tab', async () => {
    const { container } = render(<TabBar views={VIEWS} current="/films" />);
    await expectNoAxeViolations(container);
  });

  it('has no axe violations on a screen inside a view, and on one that is none of them', async () => {
    const { container, rerender } = render(<TabBar views={VIEWS} current="/watchlist" inside />);
    await expectNoAxeViolations(container);
    rerender(<TabBar views={VIEWS} />);
    await expectNoAxeViolations(container);
  });

  it('has no axe violations on a screen made for touch', async () => {
    const { container } = render(
      <div data-nc-screen="touch">
        <TabBar views={VIEWS} current="/films" />
      </div>,
    );
    await expectNoAxeViolations(container);
  });
});

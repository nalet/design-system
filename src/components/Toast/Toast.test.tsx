import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { Toaster, toast, useToastPlacement, type ToastPlacement } from './Toast';
import { Language } from '../../lib/language';
import { expectNoAxeViolations } from '../../test/axe';

/** a screen that moves the toasts while it is open. */
function Player({ placement = 'top', bar }: { placement?: ToastPlacement | null; bar?: number }) {
  useToastPlacement(placement, bar);
  return <p>playing</p>;
}

afterEach(() => {
  act(() => toast.clear());
  vi.useRealTimers();
});

describe('toast', () => {
  it('renders into a polite live region that exists before the first toast', () => {
    render(<Toaster />);
    const list = screen.getByRole('region', { name: 'notifications' }).querySelector('ol')!;
    expect(list).toHaveAttribute('aria-live', 'polite');
    expect(list.children).toHaveLength(0);
    act(() => {
      toast('8 episodes queued', { state: 'success' });
    });
    expect(list).toHaveTextContent('8 episodes queued');
  });

  it('never takes focus', () => {
    render(
      <>
        <button type="button">grab</button>
        <Toaster />
      </>,
    );
    const button = screen.getByRole('button', { name: 'grab' });
    button.focus();
    act(() => {
      toast('Queued');
    });
    expect(document.activeElement).toBe(button);
    expect(screen.getByText('Queued').closest('li')!.querySelector('button, [tabindex]')).toBeNull();
  });

  it('leaves on its own after its duration', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => {
      toast('Queued', { duration: 1000 });
    });
    expect(screen.queryByText('Queued')).not.toBeNull();
    act(() => {
      vi.advanceTimersByTime(1001);
    });
    expect(screen.queryByText('Queued')).toBeNull();
  });

  it('keeps at most three, replaces by id, and dismisses on request', () => {
    render(<Toaster />);
    act(() => {
      for (const n of [1, 2, 3, 4]) toast(`Toast ${n}`);
    });
    expect(screen.queryByText('Toast 1')).toBeNull();
    expect(screen.getByText('Toast 4')).toBeInTheDocument();
    let id = '';
    act(() => {
      id = toast('First version', { id: 'same' });
      toast('Second version', { id: 'same' });
    });
    expect(screen.queryByText('First version')).toBeNull();
    expect(screen.getByText('Second version')).toBeInTheDocument();
    act(() => toast.dismiss(id));
    expect(screen.queryByText('Second version')).toBeNull();
  });

  it('warns when no toaster is mounted', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    toast('Nobody sees this');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('says the state of a warning or an error in words, before the message', () => {
    render(<Toaster />);
    act(() => {
      toast('6 queued · 2 skipped', { state: 'warning' });
      toast('Couldn’t save', { state: 'error' });
      toast('8 episodes queued', { state: 'success' });
    });
    const texts = Array.from(document.querySelectorAll('.nc-toast__text')).map((t) => t.textContent);
    expect(texts).toEqual(['warning: 6 queued · 2 skipped', 'error: Couldn’t save', '8 episodes queued']);
    expect(screen.getByText('warning:')).toHaveClass('nc-sr-only');
  });

  it('takes its own words from the page’s language; a label still wins', () => {
    const { rerender } = render(
      <Language lang="de">
        <Toaster />
      </Language>,
    );
    act(() => {
      toast('6 in der Warteschlange · 2 übersprungen', { state: 'warning' });
    });
    expect(screen.getByRole('region', { name: 'benachrichtigungen' })).toHaveTextContent(
      'warnung: 6 in der Warteschlange · 2 übersprungen',
    );
    rerender(
      <Language lang="de">
        <Toaster label="meldungen" />
      </Language>,
    );
    expect(screen.getByRole('region', { name: 'meldungen' })).toBeInTheDocument();
  });

  it('appears at the bottom, or at the top where the toaster says so', () => {
    const { rerender } = render(<Toaster />);
    const toaster = screen.getByRole('region', { name: 'notifications' });
    expect(toaster).toHaveClass('nc-toaster--bottom');
    rerender(<Toaster placement="top" />);
    expect(toaster).toHaveClass('nc-toaster--top');
    expect(toaster).not.toHaveClass('nc-toaster--bottom');
  });

  it('moves to the top while a screen that asks for it is open, and back when it closes', () => {
    function App({ playing }: { playing: boolean }) {
      return (
        <>
          {playing ? <Player /> : null}
          <Toaster />
        </>
      );
    }
    const { rerender } = render(<App playing={false} />);
    const toaster = screen.getByRole('region', { name: 'notifications' });
    act(() => {
      toast('Saved to watchlist', { state: 'success' });
    });
    expect(toaster).toHaveClass('nc-toaster--bottom');
    rerender(<App playing />);
    // the toaster moves, with every toast in it: the same toast, in the same list.
    expect(toaster).toHaveClass('nc-toaster--top');
    expect(toaster).toHaveTextContent('Saved to watchlist');
    act(() => {
      toast('Added to Film club', { state: 'success' });
    });
    const list = toaster.querySelector('ol')!;
    expect(list).toHaveAttribute('aria-live', 'polite');
    expect(Array.from(list.children).map((li) => li.textContent)).toEqual(['Saved to watchlist', 'Added to Film club']);
    rerender(<App playing={false} />);
    expect(toaster).toHaveClass('nc-toaster--bottom');
    expect(list.children).toHaveLength(2);
  });

  it('follows the screen that opened last, and a screen that asks for nothing moves nothing', () => {
    function App({ player, settings }: { player: boolean; settings: boolean }) {
      return (
        <>
          <Toaster placement="top" />
          <Player placement={null} />
          {player ? <Player placement="bottom" /> : null}
          {settings ? <Player placement="top" /> : null}
        </>
      );
    }
    const { rerender } = render(<App player={false} settings={false} />);
    const toaster = screen.getByRole('region', { name: 'notifications' });
    expect(toaster).toHaveClass('nc-toaster--top');
    rerender(<App player settings={false} />);
    expect(toaster).toHaveClass('nc-toaster--bottom');
    rerender(<App player settings />);
    expect(toaster).toHaveClass('nc-toaster--top');
    rerender(<App player settings={false} />);
    expect(toaster).toHaveClass('nc-toaster--bottom');
    rerender(<App player={false} settings={false} />);
    expect(toaster).toHaveClass('nc-toaster--top');
  });

  it('keeps the screen that opened last in charge when an earlier one asks for something else', () => {
    function App({ outer, inner }: { outer: { placement: ToastPlacement | null; bar?: number }; inner: boolean }) {
      return (
        <>
          <Toaster />
          <Player placement={outer.placement} bar={outer.bar} />
          {inner ? <Player placement="bottom" /> : null}
        </>
      );
    }
    const { rerender } = render(<App outer={{ placement: 'top' }} inner />);
    const toaster = screen.getByRole('region', { name: 'notifications' });
    expect(toaster).toHaveClass('nc-toaster--bottom');
    // the outer screen's bar changes: the inner one, opened last, still decides.
    rerender(<App outer={{ placement: 'top', bar: 48 }} inner />);
    expect(toaster).toHaveClass('nc-toaster--bottom');
    rerender(<App outer={{ placement: 'top', bar: 48 }} inner={false} />);
    expect(toaster).toHaveClass('nc-toaster--top');
    expect(toaster.style.getPropertyValue('--nc-toaster-bar')).toBe('3rem');
    // a screen that stops asking, while it stays open, moves nothing any more.
    rerender(<App outer={{ placement: null }} inner={false} />);
    expect(toaster).toHaveClass('nc-toaster--bottom');
    expect(toaster.style.getPropertyValue('--nc-toaster-bar')).toBe('');
  });

  it('keeps clear of a bar at its edge: the toaster’s own, or the open screen’s', () => {
    function App({ playing }: { playing: boolean }) {
      return (
        <>
          {playing ? <Player bar={48} /> : null}
          <Toaster offset={56} />
        </>
      );
    }
    const { rerender } = render(<App playing={false} />);
    const toaster = screen.getByRole('region', { name: 'notifications' });
    expect(toaster.style.getPropertyValue('--nc-toaster-bar')).toBe('3.5rem');
    rerender(<App playing />);
    expect(toaster).toHaveClass('nc-toaster--top');
    expect(toaster.style.getPropertyValue('--nc-toaster-bar')).toBe('3rem');
    rerender(<App playing={false} />);
    expect(toaster.style.getPropertyValue('--nc-toaster-bar')).toBe('3.5rem');
  });

  it('has no axe violations at the top', async () => {
    const { container } = render(<Toaster placement="top" />);
    act(() => {
      toast('Saved to watchlist', { state: 'success' });
      toast('6 queued · 2 skipped', { state: 'warning' });
    });
    await expectNoAxeViolations(container);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Toaster />);
    act(() => {
      toast('8 episodes queued', { state: 'success' });
      toast('Asking the catalog again', { state: 'information' });
    });
    await expectNoAxeViolations(container);
  });
});

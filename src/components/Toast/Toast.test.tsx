import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { Toaster, toast } from './Toast';
import { expectNoAxeViolations } from '../../test/axe';

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
      toast('queued');
    });
    expect(document.activeElement).toBe(button);
    expect(screen.getByText('queued').closest('li')!.querySelector('button, [tabindex]')).toBeNull();
  });

  it('leaves on its own after its duration', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => {
      toast('queued', { duration: 1000 });
    });
    expect(screen.queryByText('queued')).not.toBeNull();
    act(() => {
      vi.advanceTimersByTime(1001);
    });
    expect(screen.queryByText('queued')).toBeNull();
  });

  it('keeps at most three, replaces by id, and dismisses on request', () => {
    render(<Toaster />);
    act(() => {
      for (const n of [1, 2, 3, 4]) toast(`toast ${n}`);
    });
    expect(screen.queryByText('toast 1')).toBeNull();
    expect(screen.getByText('toast 4')).toBeInTheDocument();
    let id = '';
    act(() => {
      id = toast('first version', { id: 'same' });
      toast('second version', { id: 'same' });
    });
    expect(screen.queryByText('first version')).toBeNull();
    expect(screen.getByText('second version')).toBeInTheDocument();
    act(() => toast.dismiss(id));
    expect(screen.queryByText('second version')).toBeNull();
  });

  it('warns when no toaster is mounted', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    toast('nobody sees this');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Toaster />);
    act(() => {
      toast('8 episodes queued', { state: 'success' });
      toast('asking the catalog again', { state: 'information' });
    });
    await expectNoAxeViolations(container);
  });
});

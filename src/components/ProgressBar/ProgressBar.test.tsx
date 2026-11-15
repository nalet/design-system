import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProgressBar, type ProgressState } from './ProgressBar';
import { Field } from '../Field/Field';
import { Language } from '../../lib/language';
import { expectNoAxeViolations } from '../../test/axe';

// 1,364 of 2,200 MB: 62%, and 1.4 of 2.2 GB to one place
const copy = { label: 'Copying 3 files', value: 1364, max: 2200, amount: '1.4 of 2.2 GB' };

const fillOf = (container: HTMLElement) => container.querySelector<HTMLElement>('.nc-progress__fill')!;
const wordsOf = (container: HTMLElement) => container.querySelector<HTMLElement>('.nc-progress__value')!;

describe('ProgressBar', () => {
  it('is the browser’s own progress element, named by its first line, with its value in words', () => {
    const { container } = render(<ProgressBar {...copy} />);
    const bar = screen.getByRole('progressbar', { name: 'Copying 3 files' });
    expect(bar.tagName).toBe('PROGRESS');
    expect(bar).toHaveAttribute('value', '1364');
    expect(bar).toHaveAttribute('max', '2200');
    expect(bar).toHaveAttribute('aria-valuetext', '62%, 1.4 of 2.2 GB');
    // the same words under the bar are for the eye: a screen reader meets them once, on the bar
    expect(wordsOf(container)).toHaveTextContent('62% · 1.4 of 2.2 GB');
    expect(wordsOf(container)).toHaveAttribute('aria-hidden', 'true');
    expect(fillOf(container).style.width).toBe('62%');
    expect(container.firstElementChild).toHaveAttribute('data-state', 'running');
  });

  it('shows the percentage alone without an amount, and other words when the app gives them', () => {
    const { container, rerender } = render(<ProgressBar label="Checking the library" value={40} />);
    expect(wordsOf(container)).toHaveTextContent('40%');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '40%');
    rerender(<ProgressBar label="Checking the library" value={40} valueText="Waiting for the disk · 40%" />);
    expect(wordsOf(container)).toHaveTextContent('Waiting for the disk · 40%');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', 'Waiting for the disk · 40%');
  });

  it('writes the percentage as the page’s language does', () => {
    const { container } = render(
      <Language lang="de">
        <ProgressBar label="3 Dateien werden kopiert" value={2500} max={2500} amount="2,2 von 2,2 GB" />
        <ProgressBar label="Bibliothek wird geprüft" value={62} state="paused" />
      </Language>,
    );
    const [done, paused] = Array.from(container.querySelectorAll('.nc-progress__value'));
    expect(done.textContent).toBe('100\u00a0% · 2,2 von 2,2 GB');
    expect(paused.textContent).toBe('pausiert · 62\u00a0%');
  });

  it('stays inside its range, and never says 100% before the work is done', () => {
    const { container, rerender } = render(<ProgressBar label="Copying" value={996} max={1000} />);
    expect(wordsOf(container)).toHaveTextContent('99%');
    rerender(<ProgressBar label="Copying" value={1000} max={1000} />);
    expect(wordsOf(container)).toHaveTextContent('100%');
    rerender(<ProgressBar label="Copying" value={1400} max={1000} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '1000');
    expect(fillOf(container).style.width).toBe('100%');
    rerender(<ProgressBar label="Copying" value={-5} max={1000} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '0');
    expect(wordsOf(container)).toHaveTextContent('0%');
  });

  it('paused: the bar stays where it is, and the words say so', () => {
    const { container } = render(<ProgressBar {...copy} state="paused" />);
    expect(container.firstElementChild).toHaveClass('nc-progress--paused');
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '1364');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', 'paused, 62%');
    expect(wordsOf(container)).toHaveTextContent('paused · 62%');
  });

  it('failed: the bar stays where it stopped, with what happened and the way forward', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const { container } = render(
      <ProgressBar {...copy} state="failed" message="Couldn’t finish: the disk is full." onRetry={onRetry} onCancel={() => undefined} />,
    );
    expect(container.firstElementChild).toHaveClass('nc-progress--failed');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', 'stopped at 62%');
    expect(fillOf(container).style.width).toBe('62%');
    expect(screen.getByRole('status')).toHaveTextContent('Couldn’t finish: the disk is full.');
    // nothing is left to stop
    expect(screen.queryByRole('button', { name: 'cancel' })).toBeNull();
    await user.click(screen.getByRole('button', { name: 'try again' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('done: the bar goes, and the result takes its place', () => {
    render(<ProgressBar {...copy} value={2200} state="done" message="copied · 2.2 GB" />);
    expect(screen.queryByRole('progressbar')).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('copied · 2.2 GB');
    expect(screen.getByText('Copying 3 files')).toBeInTheDocument();
  });

  it('says the end once: the status is on the page, empty, until the work ends', () => {
    const { rerender } = render(<ProgressBar {...copy} />);
    const status = screen.getByRole('status');
    expect(status).toBeEmptyDOMElement();
    rerender(<ProgressBar {...copy} value={1500} />);
    expect(status).toBeEmptyDOMElement();
    rerender(<ProgressBar {...copy} state="paused" />);
    expect(status).toBeEmptyDOMElement();
    rerender(<ProgressBar {...copy} value={2200} state="done" message="copied · 2.2 GB" />);
    // the same element, so its new text is announced
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toHaveTextContent('copied · 2.2 GB');
  });

  it('offers cancel where stopping is safe, with pause before it where stopping would lose work', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onPause = vi.fn();
    const onResume = vi.fn();
    const actions = { onCancel, onPause, onResume };
    const { rerender } = render(<ProgressBar {...copy} onCancel={onCancel} />);
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual(['cancel']);
    await user.click(screen.getByRole('button', { name: 'cancel' }));
    expect(onCancel).toHaveBeenCalledOnce();

    rerender(<ProgressBar {...copy} {...actions} />);
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual(['pause', 'cancel']);
    await user.click(screen.getByRole('button', { name: 'pause' }));
    expect(onPause).toHaveBeenCalledOnce();

    rerender(<ProgressBar {...copy} {...actions} state="paused" />);
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual(['resume', 'cancel']);
    await user.click(screen.getByRole('button', { name: 'resume' }));
    expect(onResume).toHaveBeenCalledOnce();

    rerender(<ProgressBar {...copy} {...actions} value={2200} state="done" message="copied · 2.2 GB" />);
    expect(screen.queryAllByRole('button')).toEqual([]);
  });

  it('takes its buttons’ words from the page’s language, and from the app', () => {
    const { rerender } = render(
      <Language lang="de">
        <ProgressBar {...copy} onCancel={() => undefined} onPause={() => undefined} />
      </Language>,
    );
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual(['pausieren', 'abbrechen']);
    rerender(
      <Language words={{ progressBar: { cancel: 'stop' } }}>
        <ProgressBar {...copy} onCancel={() => undefined} />
      </Language>,
    );
    expect(screen.getByRole('button', { name: 'stop' })).toBeInTheDocument();
  });

  it('works inside a field: the label names it, the hint describes it, an error draws it as failed', () => {
    const { container, rerender } = render(
      <Field label="Copying 3 files" hint="You can keep working">
        <ProgressBar value={1364} max={2200} amount="1.4 of 2.2 GB" />
      </Field>,
    );
    const bar = screen.getByRole('progressbar', { name: 'Copying 3 files' });
    expect(bar).toHaveAccessibleDescription('You can keep working');
    expect(container.querySelector('.nc-progress')).toHaveAttribute('data-state', 'running');
    rerender(
      <Field label="Copying 3 files" error="Couldn’t finish: the disk is full.">
        <ProgressBar value={1364} max={2200} amount="1.4 of 2.2 GB" />
      </Field>,
    );
    expect(container.querySelector('.nc-progress')).toHaveAttribute('data-state', 'failed');
    expect(screen.getByRole('progressbar')).toHaveAccessibleDescription('Couldn’t finish: the disk is full.');
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-invalid');
  });

  it('takes a name of its own where it has no first line', () => {
    render(<ProgressBar aria-label="Upload" value={10} />);
    expect(screen.getByRole('progressbar', { name: 'Upload' })).toBeInTheDocument();
  });

  it.each(['running', 'paused', 'failed', 'done'] as ProgressState[])('has no axe violations (%s)', async (state) => {
    const { container } = render(
      <ProgressBar
        {...copy}
        state={state}
        message={state === 'failed' ? 'Couldn’t finish: the disk is full.' : state === 'done' ? 'copied · 2.2 GB' : undefined}
        onCancel={() => undefined}
        onPause={() => undefined}
        onResume={() => undefined}
        onRetry={() => undefined}
      />,
    );
    await expectNoAxeViolations(container);
  });

  it.each(['touch', 'tv'])('has no axe violations on a %s screen, and in a field', async (kind) => {
    const { container } = render(
      <div data-nc-screen={kind}>
        <ProgressBar {...copy} onCancel={() => undefined} />
        <Field label="Checking the library" hint="About a minute left">
          <ProgressBar value={40} />
        </Field>
      </div>,
    );
    await expectNoAxeViolations(container);
  });
});

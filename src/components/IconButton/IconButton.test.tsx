import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { IconButton } from './IconButton';
import { expectNoAxeViolations } from '../../test/axe';

const Glyph = () => (
  <svg viewBox="0 0 16 16" width="1rem" height="1rem" aria-hidden="true">
    <path d="M4 2 H12 V14 L8 11 L4 14 Z" fill="none" stroke="currentColor" />
  </svg>
);

function Saved({ onChange }: { onChange?: (on: boolean) => void }) {
  const [on, setOn] = React.useState(false);
  return (
    <IconButton
      label="save to watchlist"
      pressed={on}
      onClick={() => {
        setOn(!on);
        onChange?.(!on);
      }}
    >
      <Glyph />
    </IconButton>
  );
}

describe('IconButton', () => {
  it('is a button named by its label, with the label as its tooltip', () => {
    render(
      <IconButton label="restart worker">
        <Glyph />
      </IconButton>,
    );
    const button = screen.getByRole('button', { name: 'restart worker' });
    expect(button).toHaveAttribute('title', 'restart worker');
    expect(button).toHaveAttribute('type', 'button');
    // a button that only acts says no state.
    expect(button).not.toHaveAttribute('aria-pressed');
  });

  it('is busy and ignores presses while it loads', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <IconButton label="restart worker" loading onClick={onClick}>
        <Glyph />
      </IconButton>,
    );
    const button = screen.getByRole('button', { name: 'restart worker' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('on and off: one label for both states, the state told as pressed', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Saved onChange={onChange} />);
    const button = screen.getByRole('button', { name: 'save to watchlist' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    await user.click(button);
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    // the same name, pressed; and focus stays on the button.
    expect(screen.getByRole('button', { name: 'save to watchlist', pressed: true })).toBe(button);
    expect(button).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    await user.keyboard(' ');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('lets only the standard and the quiet kinds be on', () => {
    render(
      <>
        <IconButton label="standard" pressed>
          <Glyph />
        </IconButton>
        <IconButton label="quiet" variant="ghost" pressed>
          <Glyph />
        </IconButton>
        <IconButton label="emphasized" variant="primary" pressed>
          <Glyph />
        </IconButton>
        <IconButton label="danger" variant="danger" pressed>
          <Glyph />
        </IconButton>
        <IconButton label="danger, by attribute" variant="danger" aria-pressed="true">
          <Glyph />
        </IconButton>
      </>,
    );
    expect(screen.getByRole('button', { name: 'standard' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'quiet' })).toHaveAttribute('aria-pressed', 'true');
    // the next step and a deletion hold no state: a screen reader hears none.
    expect(screen.getByRole('button', { name: 'emphasized' })).not.toHaveAttribute('aria-pressed');
    expect(screen.getByRole('button', { name: 'danger' })).not.toHaveAttribute('aria-pressed');
    expect(screen.getByRole('button', { name: 'danger, by attribute' })).not.toHaveAttribute('aria-pressed');
  });

  it('takes aria-pressed as it takes pressed', () => {
    render(
      <IconButton label="show subtitles" variant="ghost" aria-pressed="true">
        <Glyph />
      </IconButton>,
    );
    expect(screen.getByRole('button', { name: 'show subtitles', pressed: true })).toBeInTheDocument();
  });

  it('has no axe violations: each kind, off, on, busy and disabled', async () => {
    const { container } = render(
      <>
        <IconButton label="start release" variant="primary">
          <Glyph />
        </IconButton>
        <IconButton label="delete volume" variant="danger">
          <Glyph />
        </IconButton>
        <IconButton label="save to watchlist" pressed={false}>
          <Glyph />
        </IconButton>
        <IconButton label="like" pressed>
          <Glyph />
        </IconButton>
        <IconButton label="show subtitles" variant="ghost" pressed={false}>
          <Glyph />
        </IconButton>
        <IconButton label="mute" variant="ghost" pressed>
          <Glyph />
        </IconButton>
        <IconButton label="restart worker" loading>
          <Glyph />
        </IconButton>
        <IconButton label="copy link" pressed disabled>
          <Glyph />
        </IconButton>
      </>,
    );
    await expectNoAxeViolations(container);
  });
});

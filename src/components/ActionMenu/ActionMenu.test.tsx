import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { ActionMenu, type ActionMenuProps } from './ActionMenu';
import { expectNoAxeViolations } from '../../test/axe';

function setup(overrides: Partial<Parameters<typeof ActionMenu>[0]> = {}) {
  const pick = vi.fn();
  const grab = vi.fn();
  const remove = vi.fn();
  render(
    <>
      <ActionMenu
        label="actions for S04E07"
        items={[
          { id: 'pick', label: 'pick a release', onSelect: pick },
          { id: 'grab', label: 'grab now', onSelect: grab },
          { id: 'remove', label: 'stop tracking', onSelect: remove, disabled: true },
        ]}
        {...overrides}
      />
      <button type="button">after</button>
    </>,
  );
  return { pick, grab, remove, trigger: screen.getByRole('button', { name: 'actions for S04E07' }) };
}

describe('ActionMenu', () => {
  it('is a menu button', () => {
    const { trigger } = setup();
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('opens on click with focus on the first item, and arrows move', async () => {
    const user = userEvent.setup();
    const { trigger } = setup();
    await user.click(trigger);
    const menu = screen.getByRole('menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', menu.id);
    expect(screen.getByRole('menuitem', { name: 'pick a release' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'grab now' })).toHaveFocus();
    // the disabled item is skipped; the list wraps.
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'pick a release' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('menuitem', { name: 'grab now' })).toHaveFocus();
  });

  it('selects with enter, closes, and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    const { trigger, grab } = setup();
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}{Enter}');
    expect(grab).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it('closes on escape with focus back on the trigger', async () => {
    const user = userEvent.setup();
    const { trigger } = setup();
    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it('does not run a disabled item', async () => {
    const user = userEvent.setup();
    const { trigger, remove } = setup();
    await user.click(trigger);
    await user.click(screen.getByRole('menuitem', { name: 'stop tracking' }));
    expect(remove).not.toHaveBeenCalled();
    expect(screen.getByRole('menuitem', { name: 'stop tracking' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('closes on a press outside', async () => {
    const user = userEvent.setup();
    const { trigger } = setup();
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'after' }));
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('cannot be opened while busy', () => {
    const { trigger } = setup({ loading: true });
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('aria-busy', 'true');
  });

  it('has no axe violations, closed and open', async () => {
    const user = userEvent.setup();
    const { trigger } = setup();
    await expectNoAxeViolations(document.body);
    await user.click(trigger);
    await expectNoAxeViolations(document.body);
  });
});

// a player's settings: two choices in one menu, each with one option picked.
function Settings({
  onQuality,
  onSpeed,
  ...rest
}: { onQuality?: (v: string) => void; onSpeed?: (v: string) => void } & Partial<ActionMenuProps>) {
  const [quality, setQuality] = React.useState('720');
  const [speed, setSpeed] = React.useState('1');
  return (
    <>
      <ActionMenu
        label="player settings"
        choices={[
          {
            id: 'quality',
            label: 'quality',
            value: quality,
            onChange: (v) => {
              setQuality(v);
              onQuality?.(v);
            },
            options: [
              { value: 'auto', label: 'auto', detail: '720p' },
              { value: '1080', label: '1080p' },
              { value: '720', label: '720p' },
              { value: '480', label: '480p', disabled: true },
            ],
          },
          {
            id: 'speed',
            label: 'speed',
            value: speed,
            onChange: (v) => {
              setSpeed(v);
              onSpeed?.(v);
            },
            options: [
              { value: '0.5', label: '0.5×' },
              { value: '1', label: '1×' },
              { value: '2', label: '2×' },
            ],
          },
        ]}
        {...rest}
      />
      <button type="button">after</button>
    </>
  );
}

describe('ActionMenu, a menu of one choice', () => {
  it('groups the options of each choice under its header, one of them checked', async () => {
    const user = userEvent.setup();
    render(<Settings />);
    await user.click(screen.getByRole('button', { name: 'player settings' }));
    const menu = screen.getByRole('menu', { name: 'player settings' });
    const quality = within(menu).getByRole('group', { name: 'quality' });
    const speed = within(menu).getByRole('group', { name: 'speed' });
    expect(within(quality).getAllByRole('menuitemradio')).toHaveLength(4);
    expect(within(speed).getAllByRole('menuitemradio')).toHaveLength(3);
    expect(within(menu).getAllByRole('separator')).toHaveLength(1);
    // each option says whether it is checked; exactly one per choice is.
    expect(within(quality).getAllByRole('menuitemradio', { checked: true })).toHaveLength(1);
    expect(within(quality).getByRole('menuitemradio', { name: '720p' })).toHaveAttribute('aria-checked', 'true');
    expect(within(quality).getByRole('menuitemradio', { name: '1080p' })).toHaveAttribute('aria-checked', 'false');
    expect(within(speed).getByRole('menuitemradio', { name: '1×' })).toHaveAttribute('aria-checked', 'true');
    // what auto picked is part of the option's name; the check is decoration.
    expect(within(quality).getByRole('menuitemradio', { name: 'auto · 720p' })).toBeInTheDocument();
    expect(menu.querySelectorAll('.nc-actionmenu__check svg')).toHaveLength(2);
    for (const check of menu.querySelectorAll('.nc-actionmenu__check')) expect(check).toHaveAttribute('aria-hidden', 'true');
    // there are no commands in it.
    expect(within(menu).queryByRole('menuitem')).toBeNull();
  });

  it('opens on the picked option of its first choice, and the arrows go through every choice', async () => {
    const user = userEvent.setup();
    render(<Settings />);
    const trigger = screen.getByRole('button', { name: 'player settings' });
    trigger.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('menuitemradio', { name: '720p' })).toHaveFocus();
    // past the disabled option, the separator and the header, into the next choice.
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitemradio', { name: '0.5×' })).toHaveFocus();
    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(screen.getByRole('menuitemradio', { name: '1080p' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('menuitemradio', { name: '2×' })).toHaveFocus();
    // round at the ends.
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitemradio', { name: 'auto · 720p' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('menuitemradio', { name: 'auto · 720p' })).toHaveFocus();
    // the up arrow on the trigger opens it on the picked option too.
    await user.keyboard('{Escape}');
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitemradio', { name: '720p' })).toHaveFocus();
  });

  it('picks with a click, enter or space: the check moves, the menu closes, focus returns', async () => {
    const user = userEvent.setup();
    const onQuality = vi.fn();
    const onSpeed = vi.fn();
    render(<Settings onQuality={onQuality} onSpeed={onSpeed} />);
    const trigger = screen.getByRole('button', { name: 'player settings' });
    await user.click(trigger);
    await user.click(screen.getByRole('menuitemradio', { name: '1080p' }));
    expect(onQuality).toHaveBeenCalledExactlyOnceWith('1080');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(trigger).toHaveFocus();
    // it opens on the new pick; enter picks the next one down.
    await user.keyboard('{Enter}');
    expect(screen.getByRole('menuitemradio', { name: '1080p' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('menuitemradio', { name: '1080p' })).toHaveFocus();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onQuality).toHaveBeenLastCalledWith('720');
    expect(trigger).toHaveFocus();
    // space, in the second choice; the first stays as it is.
    await user.keyboard('{Enter}{End} ');
    expect(onSpeed).toHaveBeenCalledExactlyOnceWith('2');
    expect(onQuality).toHaveBeenCalledTimes(2);
    expect(trigger).toHaveFocus();
  });

  it('only closes when the picked option is picked again', async () => {
    const user = userEvent.setup();
    const onQuality = vi.fn();
    render(<Settings onQuality={onQuality} />);
    const trigger = screen.getByRole('button', { name: 'player settings' });
    await user.click(trigger);
    await user.click(screen.getByRole('menuitemradio', { name: '720p' }));
    expect(onQuality).not.toHaveBeenCalled();
    expect(screen.queryByRole('menu')).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it('changes nothing on esc, tab, a press outside or a disabled option', async () => {
    const user = userEvent.setup();
    const onQuality = vi.fn();
    const onSpeed = vi.fn();
    render(<Settings onQuality={onQuality} onSpeed={onSpeed} />);
    const trigger = screen.getByRole('button', { name: 'player settings' });
    await user.click(trigger);
    await user.keyboard('{ArrowDown}{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
    await user.click(trigger);
    await user.keyboard('{ArrowDown}{Tab}');
    expect(screen.queryByRole('menu')).toBeNull();
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'after' }));
    expect(screen.queryByRole('menu')).toBeNull();
    await user.click(trigger);
    const off = screen.getByRole('menuitemradio', { name: '480p' });
    expect(off).toHaveAttribute('aria-disabled', 'true');
    await user.click(off);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(onQuality).not.toHaveBeenCalled();
    expect(onSpeed).not.toHaveBeenCalled();
  });

  it('can leave the header out where the trigger names the one choice', async () => {
    const user = userEvent.setup();
    render(
      <ActionMenu
        label="playback speed"
        choices={[
          {
            id: 'speed',
            value: '1',
            onChange: () => undefined,
            options: [
              { value: '1', label: '1×' },
              { value: '2', label: '2×' },
            ],
          },
        ]}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'playback speed' }));
    const menu = screen.getByRole('menu', { name: 'playback speed' });
    expect(menu.querySelector('.nc-actionmenu__header')).toBeNull();
    expect(within(menu).getAllByRole('menuitemradio')).toHaveLength(2);
    await expectNoAxeViolations(document.body);
  });

  it('has no axe violations, closed and open', async () => {
    const user = userEvent.setup();
    render(<Settings />);
    await expectNoAxeViolations(document.body);
    await user.click(screen.getByRole('button', { name: 'player settings' }));
    await expectNoAxeViolations(document.body);
  });
});

describe('ActionMenu, the large size and the kinds of screen', () => {
  it('has a large trigger and a menu of rows at lg', async () => {
    const user = userEvent.setup();
    const { trigger } = setup({ size: 'lg' });
    expect(trigger).toHaveClass('nc-iconbtn--lg');
    await user.click(trigger);
    expect(screen.getByRole('menu')).toHaveClass('nc-actionmenu--lg');
  });

  it('has a large button with words at lg', () => {
    render(<ActionMenu size="lg" buttonLabel="export" label="export" items={[]} />);
    expect(screen.getByRole('button', { name: 'export' })).toHaveClass('nc-btn--lg');
  });

  it('carries the kind of screen to the menu, which is rendered outside it', async () => {
    const user = userEvent.setup();
    render(
      <div data-nc-screen="touch">
        <ActionMenu label="actions for db-0" items={[{ id: 'logs', label: 'open logs', onSelect: () => undefined }]} />
      </div>,
    );
    await user.click(screen.getByRole('button', { name: 'actions for db-0' }));
    const menu = screen.getByRole('menu');
    expect(menu.closest('[data-nc-screen]')).toBe(menu);
    expect(menu).toHaveAttribute('data-nc-screen', 'touch');
  });

  it('says no kind of screen where the page says none', async () => {
    const user = userEvent.setup();
    const { trigger } = setup();
    await user.click(trigger);
    expect(screen.getByRole('menu')).not.toHaveAttribute('data-nc-screen');
  });

  it('keeps a remote\'s left and right in the open menu on a tv', async () => {
    const user = userEvent.setup();
    render(
      <div data-nc-screen="tv">
        <ActionMenu label="actions for db-0" items={[{ id: 'logs', label: 'open logs', onSelect: () => undefined }]} />
      </div>,
    );
    await user.click(screen.getByRole('button', { name: 'actions for db-0' }));
    const item = screen.getByRole('menuitem', { name: 'open logs' });
    // fireEvent returns false when the key's default was prevented.
    expect(fireEvent.keyDown(item, { key: 'ArrowRight' })).toBe(false);
    expect(fireEvent.keyDown(item, { key: 'ArrowLeft' })).toBe(false);
    expect(item).toHaveFocus();
  });

  it('leaves left and right alone on other screens', async () => {
    const user = userEvent.setup();
    const { trigger } = setup();
    await user.click(trigger);
    expect(fireEvent.keyDown(screen.getByRole('menuitem', { name: 'pick a release' }), { key: 'ArrowRight' })).toBe(true);
  });
});

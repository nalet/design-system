import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionMenu } from './ActionMenu';
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

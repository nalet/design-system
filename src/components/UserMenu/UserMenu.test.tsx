import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserMenu } from './UserMenu';
import { Language } from '../../lib/language';
import { expectNoAxeViolations } from '../../test/axe';

function setup(overrides: Partial<Parameters<typeof UserMenu>[0]> = {}) {
  const account = vi.fn();
  const settings = vi.fn();
  const signOut = vi.fn();
  render(
    <>
      <UserMenu
        name="Ada Urban"
        email="ada.urban@example.org"
        items={[
          { id: 'account', label: 'account', onSelect: account },
          { id: 'settings', label: 'settings', onSelect: settings },
          { id: 'help', label: 'help', href: '#help' },
        ]}
        onSignOut={signOut}
        {...overrides}
      />
      <button type="button">after</button>
    </>,
  );
  return { account, settings, signOut, avatar: screen.getAllByRole('button')[0] };
}

describe('UserMenu', () => {
  it('is a menu button named after what it shows and what it opens', () => {
    const { avatar } = setup();
    expect(avatar).toHaveAccessibleName('au, user menu');
    expect(avatar).toHaveTextContent('au');
    expect(avatar).toHaveAttribute('aria-haspopup', 'menu');
    expect(avatar).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('is named after the person when it shows their picture', () => {
    const { avatar } = setup({ picture: '/people/ada.jpg' });
    expect(avatar).toHaveAccessibleName('Ada Urban, user menu');
  });

  it('opens with who is signed in, the app’s items, and sign out last, set apart', async () => {
    const user = userEvent.setup();
    const { avatar } = setup();
    await user.click(avatar);
    expect(avatar).toHaveAttribute('aria-expanded', 'true');
    const menu = screen.getByRole('menu', { name: 'au, user menu' });
    expect(avatar).toHaveAttribute('aria-controls', menu.id);
    expect(menu).toHaveAccessibleDescription('Ada Urban ada.urban@example.org');
    expect(screen.getByText('Ada Urban')).toBeVisible();
    expect(screen.getByText('ada.urban@example.org')).toBeVisible();
    const rows = Array.from(menu.children).map((el) => el.getAttribute('role') + ':' + el.textContent);
    expect(rows).toEqual(['menuitem:account', 'menuitem:settings', 'menuitem:help', 'separator:', 'menuitem:sign out']);
    expect(within(menu).getByRole('menuitem', { name: 'account' })).toHaveFocus();
  });

  it('moves with the arrow keys, home and end, and wraps', async () => {
    const user = userEvent.setup();
    const { avatar } = setup();
    avatar.focus();
    await user.keyboard('{ArrowDown}');
    const items = screen.getAllByRole('menuitem');
    expect(items[0]).toHaveFocus();
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(items[2]).toHaveFocus();
    await user.keyboard('{End}');
    expect(items[3]).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(items[0]).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(items[3]).toHaveFocus();
    await user.keyboard('{Home}');
    expect(items[0]).toHaveFocus();
  });

  it('opens on its last item with the up arrow', async () => {
    const user = userEvent.setup();
    const { avatar } = setup();
    avatar.focus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'sign out' })).toHaveFocus();
  });

  it('closes on esc and gives the focus back to the avatar', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { avatar } = setup({ onOpenChange });
    await user.click(avatar);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(avatar).toHaveFocus();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('closes on tab, and the focus moves on from the avatar', async () => {
    const user = userEvent.setup();
    const { avatar } = setup();
    await user.click(avatar);
    await user.tab();
    expect(screen.queryByRole('menu')).toBeNull();
    expect(screen.getByRole('button', { name: 'after' })).toHaveFocus();
  });

  it('runs an item once the menu has closed, with the focus back on the avatar', async () => {
    const user = userEvent.setup();
    const { avatar, settings, account } = setup();
    await user.click(avatar);
    await user.click(screen.getByRole('menuitem', { name: 'settings' }));
    expect(settings).toHaveBeenCalledOnce();
    expect(account).not.toHaveBeenCalled();
    expect(screen.queryByRole('menu')).toBeNull();
    expect(avatar).toHaveFocus();
  });

  it('signs out from the last item', async () => {
    const user = userEvent.setup();
    const { avatar, signOut } = setup();
    await user.click(avatar);
    await user.keyboard('{End}{Enter}');
    expect(signOut).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('makes an item with an address a link that answers to space as well', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const { avatar } = setup({ items: [{ id: 'help', label: 'help', href: '#help', onSelect }] });
    await user.click(avatar);
    const help = screen.getByRole('menuitem', { name: 'help' });
    expect(help.tagName).toBe('A');
    expect(help).toHaveAttribute('href', '#help');
    await user.keyboard(' ');
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('keeps a disabled item in the menu, skips it and does not run it', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const { avatar } = setup({
      items: [
        { id: 'account', label: 'account' },
        { id: 'settings', label: 'settings', onSelect, disabled: true },
      ],
    });
    await user.click(avatar);
    const settings = screen.getByRole('menuitem', { name: 'settings' });
    expect(settings).toHaveAttribute('aria-disabled', 'true');
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'sign out' })).toHaveFocus();
    await user.click(settings);
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('closes on a press outside', async () => {
    const user = userEvent.setup();
    const { avatar } = setup();
    await user.click(avatar);
    await user.click(screen.getByRole('button', { name: 'after' }));
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('can be open from the start, and leaves the focus where it is', async () => {
    const user = userEvent.setup();
    const { avatar } = setup({ defaultOpen: true });
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(document.body).toHaveFocus();
    avatar.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'account' })).toHaveFocus();
  });

  it('takes its words from the page’s language, and a word of its own wins', async () => {
    const user = userEvent.setup();
    render(
      <Language lang="de">
        <UserMenu name="Ada Urban" onSignOut={() => undefined} />
        <UserMenu name="Bo Chen" label="Bo, Konto" signOutLabel="ausloggen" onSignOut={() => undefined} />
      </Language>,
    );
    const ada = screen.getByRole('button', { name: 'au, benutzermenü' });
    await user.click(ada);
    expect(screen.getByRole('menuitem', { name: 'abmelden' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button', { name: 'Bo, Konto' }));
    expect(screen.getByRole('menuitem', { name: 'ausloggen' })).toBeInTheDocument();
  });

  it('has no axe violations, closed and open', async () => {
    const user = userEvent.setup();
    const { avatar } = setup();
    await expectNoAxeViolations(document.body);
    await user.click(avatar);
    await expectNoAxeViolations(document.body);
  });

  it('has no axe violations with a picture', async () => {
    setup({ picture: '/people/ada.jpg', defaultOpen: true });
    await expectNoAxeViolations(document.body);
  });
});

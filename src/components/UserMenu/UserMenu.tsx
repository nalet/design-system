import * as React from 'react';
import { cx } from '../../lib/cx';
import { fill, useLanguage } from '../../lib/language';
import { Avatar, initialsOf, type AvatarSize } from '../Avatar/Avatar';
import './UserMenu.css';

export interface UserMenuItem {
  id: string;
  /** The item's word, lowercase: "account", "settings", "help". */
  label: React.ReactNode;
  /** A page the item leads to. The item is then a link, and opens in a new tab like one. */
  href?: string;
  /** Runs when the item is chosen, once the menu has closed. */
  onSelect?: () => void;
  /** A leading icon (decoration). */
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface UserMenuProps {
  /** The person's name: the menu's first line, and where the avatar's initials come from. */
  name: string;
  /** Their email address, quieter, under the name. */
  email?: string;
  /** Their picture, for the avatar. Without one the avatar shows their initials. */
  picture?: string;
  /** Their initials, where the ones made from the name aren't theirs. */
  initials?: string;
  /** What the app puts between the header and sign out: account, settings, help. */
  items?: UserMenuItem[];
  /** Signs the person out. Sign out is always the last item, set apart. */
  onSignOut: () => void;
  /** The last item's words. Default "sign out". */
  signOutLabel?: string;
  /** A leading icon for sign out (decoration). */
  signOutIcon?: React.ReactNode;
  /**
   * The avatar button's accessible name: what it shows and what it opens.
   * Default "au, user menu" with initials, and the person's name in their
   * place with a picture.
   */
  label?: string;
  /** The avatar's size. Default md. */
  size?: AvatarSize;
  /** Which edge of the avatar the menu lines up with. Default end. */
  align?: 'start' | 'end';
  /** Open on the first render. The focus stays where it is; it moves into the menu only when a person opens it. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/**
 * UserMenu — everything about the person behind one square avatar: who is
 * signed in, the items the app gives, and sign out, last and set apart. The
 * avatar is a menu button; the menu opens under it, in place, with the action
 * menu's look and keys: arrows move, Enter or Space chooses, Esc closes and
 * gives the focus back to the avatar, Tab closes.
 */
export function UserMenu({
  name,
  email,
  picture,
  initials,
  items = [],
  onSignOut,
  signOutLabel,
  signOutIcon,
  label,
  size = 'md',
  align = 'end',
  defaultOpen = false,
  onOpenChange,
  className,
}: UserMenuProps) {
  const { words } = useLanguage();
  const [open, setOpenState] = React.useState(defaultOpen);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  // where the focus goes when the menu opens; null when it opened by itself.
  const pendingFocus = React.useRef<'first' | 'last' | null>(null);
  const menuId = React.useId();
  const triggerId = React.useId();
  const whoId = React.useId();

  const letters = (initials ?? initialsOf(name)).toLowerCase();
  const triggerName = label ?? fill(words.userMenu.label, { who: picture ? name : letters });

  const setOpen = React.useCallback(
    (next: boolean) => {
      setOpenState(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  const enabledItems = () =>
    Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []).filter(
      (el) => el.getAttribute('aria-disabled') !== 'true',
    );

  // a menu a person opened takes the focus: its first item, or its last after ↑.
  React.useLayoutEffect(() => {
    if (!open || !pendingFocus.current) return;
    const list = enabledItems();
    const target = pendingFocus.current === 'last' ? list[list.length - 1] : list[0];
    pendingFocus.current = null;
    (target ?? menuRef.current)?.focus();
  }, [open]);

  // while open: a press outside closes it.
  React.useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer, true);
    return () => document.removeEventListener('pointerdown', onPointer, true);
  }, [open, setOpen]);

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      pendingFocus.current = e.key === 'ArrowUp' ? 'last' : 'first';
      if (open) {
        // already open (it opened by itself): move into it.
        const list = enabledItems();
        (pendingFocus.current === 'last' ? list[list.length - 1] : list[0])?.focus();
        pendingFocus.current = null;
      } else {
        setOpen(true);
      }
    } else if (e.key === 'Escape' && open) {
      e.preventDefault();
      e.stopPropagation();
      close(true);
    }
  };

  const onTriggerClick = () => {
    if (open) {
      close(false);
      return;
    }
    pendingFocus.current = 'first';
    setOpen(true);
  };

  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const list = enabledItems();
    const idx = list.indexOf(document.activeElement as HTMLElement);
    let next: HTMLElement | undefined;
    switch (e.key) {
      case 'ArrowDown':
        next = list[idx < 0 ? 0 : (idx + 1) % list.length];
        break;
      case 'ArrowUp':
        next = list[idx < 0 ? list.length - 1 : (idx - 1 + list.length) % list.length];
        break;
      case 'Home':
        next = list[0];
        break;
      case 'End':
        next = list[list.length - 1];
        break;
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        close(true);
        return;
      case 'Tab':
        // let tab move on from the avatar, as if the menu had not been there.
        close(true);
        return;
      case ' ':
        // a link answers to enter by itself; as a menu item it answers to space too.
        if ((e.target as HTMLElement).tagName === 'A') {
          e.preventDefault();
          (e.target as HTMLElement).click();
        }
        return;
      default:
        return;
    }
    e.preventDefault();
    next?.focus();
  };

  const choose = (e: React.MouseEvent, item: Pick<UserMenuItem, 'disabled' | 'onSelect'>) => {
    if (item.disabled) {
      e.preventDefault();
      return;
    }
    close(true);
    item.onSelect?.();
  };

  const row = (item: UserMenuItem) => {
    const content = (
      <>
        {item.icon ? (
          <span className="nc-usermenu__icon" aria-hidden="true">
            {item.icon}
          </span>
        ) : null}
        <span className="nc-usermenu__label">{item.label}</span>
      </>
    );
    const shared = {
      role: 'menuitem' as const,
      tabIndex: -1,
      'aria-disabled': item.disabled || undefined,
      className: cx('nc-usermenu__item', item.disabled && 'nc-usermenu__item--disabled'),
      onClick: (e: React.MouseEvent) => choose(e, item),
    };
    return item.href != null && !item.disabled ? (
      <a key={item.id} href={item.href} {...shared}>
        {content}
      </a>
    ) : (
      <button key={item.id} type="button" {...shared}>
        {content}
      </button>
    );
  };

  return (
    <div ref={rootRef} className={cx('nc-usermenu', className)}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        className="nc-usermenu__trigger"
        aria-label={triggerName}
        title={triggerName}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={onTriggerClick}
        onKeyDown={onTriggerKeyDown}
      >
        <Avatar name={name} src={picture} initials={initials} size={size} decorative />
      </button>
      {open ? (
        <div className={cx('nc-usermenu__panel', `nc-usermenu__panel--${align}`)}>
          <div className="nc-usermenu__who">
            <span id={`${whoId}-name`} className="nc-usermenu__name">
              {name}
            </span>
            {email ? (
              <span id={`${whoId}-email`} className="nc-usermenu__email">
                {email}
              </span>
            ) : null}
          </div>
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-labelledby={triggerId}
            // who is signed in is not an item: the menu is described by it, the name and the address apart.
            aria-describedby={email ? `${whoId}-name ${whoId}-email` : `${whoId}-name`}
            tabIndex={-1}
            className="nc-usermenu__menu"
            onKeyDown={onMenuKeyDown}
          >
            {items.map(row)}
            {items.length ? <div role="separator" className="nc-usermenu__rule" /> : null}
            {row({ id: 'sign-out', label: signOutLabel ?? words.userMenu.signOut, icon: signOutIcon, onSelect: onSignOut })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

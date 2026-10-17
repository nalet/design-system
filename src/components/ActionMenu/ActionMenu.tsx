import * as React from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib/cx';
import { IconButton } from '../IconButton/IconButton';
import { Button } from '../Button/Button';
import './ActionMenu.css';

export interface ActionMenuItem {
  id: string;
  /** A verb, lowercase: "pick a release", "grab now". */
  label: React.ReactNode;
  onSelect: () => void;
  disabled?: boolean;
  /** Optional leading icon (decoration). */
  icon?: React.ReactNode;
  /** An action that deletes or cannot be undone. */
  danger?: boolean;
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  /**
   * The icon trigger's accessible name — name the object: "actions for
   * S04E07". The menu is named by its trigger. With a `buttonLabel` the
   * visible text is the name (WCAG 2.5.3) and this is not used.
   */
  label: string;
  /** A visible text trigger instead of the "more" icon. */
  buttonLabel?: React.ReactNode;
  /** A custom icon for the icon trigger. Default: three squares. */
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
  /** Which edge of the trigger the menu lines up with. Default end. */
  align?: 'start' | 'end';
  /** Busy: the trigger shows a spinner and cannot be opened. */
  loading?: boolean;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const MoreGlyph = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true" focusable="false">
    <rect x="2" y="7" width="2.5" height="2.5" />
    <rect x="6.75" y="7" width="2.5" height="2.5" />
    <rect x="11.5" y="7" width="2.5" height="2.5" />
  </svg>
);

interface Position {
  top: number;
  left: number;
  minWidth: number;
}

const GAP = 4;
const EDGE = 8;

/**
 * ActionMenu — actions behind one trigger: a menu button (aria-haspopup=menu)
 * and a menu of menuitems, portaled to the body so no table or panel clips it.
 * Opening moves focus into the menu; arrows move, Enter or Space selects, Esc
 * closes and returns focus to the trigger, Tab closes.
 */
export function ActionMenu({
  items,
  label,
  buttonLabel,
  icon,
  size = 'sm',
  align = 'end',
  loading = false,
  disabled = false,
  onOpenChange,
  className,
}: ActionMenuProps) {
  const [open, setOpenState] = React.useState(false);
  const [pos, setPos] = React.useState<Position | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const pendingFocus = React.useRef<'first' | 'last'>('first');
  const menuId = React.useId();
  const triggerId = React.useId();

  const setOpen = React.useCallback(
    (next: boolean) => {
      setOpenState(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  const enabledItems = () =>
    Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []).filter(
      (el) => el.getAttribute('aria-disabled') !== 'true',
    );

  const place = React.useCallback(() => {
    const t = triggerRef.current;
    const m = menuRef.current;
    if (!t || !m) return;
    const r = t.getBoundingClientRect();
    const w = m.offsetWidth;
    const h = m.offsetHeight;
    let top = r.bottom + GAP;
    if (top + h > window.innerHeight - EDGE && r.top - GAP - h >= EDGE) top = r.top - GAP - h;
    let left = align === 'end' ? r.right - w : r.left;
    left = Math.max(EDGE, Math.min(left, window.innerWidth - w - EDGE));
    const minWidth = Math.max(r.width, 160);
    // write the position to the node now, not only on the next render: a
    // browser will not focus inside a subtree that is still visibility:hidden,
    // and focus moves into the menu right after this.
    m.style.top = `${top}px`;
    m.style.left = `${left}px`;
    m.style.minWidth = `${minWidth}px`;
    m.style.visibility = 'visible';
    setPos({ top, left, minWidth });
  }, [align]);

  // first paint of an open menu: measure, place, then focus the first item.
  React.useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    place();
    const list = enabledItems();
    const target = pendingFocus.current === 'last' ? list[list.length - 1] : list[0];
    (target ?? menuRef.current)?.focus();
  }, [open, place]);

  // while open: follow the trigger on scroll and resize, close on a press outside.
  React.useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      const node = e.target as Node;
      if (menuRef.current?.contains(node) || triggerRef.current?.contains(node)) return;
      setOpen(false);
    };
    const onMove = () => place();
    document.addEventListener('pointerdown', onPointer, true);
    window.addEventListener('scroll', onMove, true);
    window.addEventListener('resize', onMove);
    return () => {
      document.removeEventListener('pointerdown', onPointer, true);
      window.removeEventListener('scroll', onMove, true);
      window.removeEventListener('resize', onMove);
    };
  }, [open, place, setOpen]);

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      pendingFocus.current = e.key === 'ArrowUp' ? 'last' : 'first';
      setOpen(true);
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
    const idx = list.indexOf(document.activeElement as HTMLButtonElement);
    let next: HTMLButtonElement | undefined;
    switch (e.key) {
      case 'ArrowDown':
        next = list[idx < 0 ? 0 : (idx + 1) % list.length];
        break;
      case 'ArrowUp':
        // from the menu itself (or a disabled item a click focused): the last item.
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
        // let tab move on from the trigger, as if the menu had not been there.
        close(true);
        return;
      default:
        return;
    }
    e.preventDefault();
    next?.focus();
  };

  const select = (item: ActionMenuItem) => {
    if (item.disabled) return;
    close(true);
    item.onSelect();
  };

  const triggerProps = {
    ref: triggerRef,
    id: triggerId,
    'aria-haspopup': 'menu' as const,
    'aria-expanded': open,
    'aria-controls': open ? menuId : undefined,
    disabled: disabled || loading,
    loading,
    onClick: onTriggerClick,
    onKeyDown: onTriggerKeyDown,
  };

  return (
    <>
      {buttonLabel != null ? (
        <Button
          {...triggerProps}
          size={size}
          className={cx('nc-actionmenu__trigger', className)}
          trailing={
            <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true">
              <path d="M3 4.5 L6 7.5 L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
          }
        >
          {buttonLabel}
        </Button>
      ) : (
        <IconButton
          {...triggerProps}
          label={label}
          variant="ghost"
          size={size}
          className={cx('nc-actionmenu__trigger', className)}
        >
          {icon ?? <MoreGlyph />}
        </IconButton>
      )}
      {open && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              aria-labelledby={triggerId}
              tabIndex={-1}
              className="nc-actionmenu"
              style={{
                top: pos?.top ?? 0,
                left: pos?.left ?? 0,
                minWidth: pos?.minWidth,
                visibility: pos ? 'visible' : 'hidden',
              }}
              onKeyDown={onMenuKeyDown}
            >
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  aria-disabled={item.disabled || undefined}
                  className={cx(
                    'nc-actionmenu__item',
                    item.danger && 'nc-actionmenu__item--danger',
                    item.disabled && 'nc-actionmenu__item--disabled',
                  )}
                  onClick={() => select(item)}
                >
                  {item.icon ? (
                    <span className="nc-actionmenu__icon" aria-hidden="true">
                      {item.icon}
                    </span>
                  ) : null}
                  <span className="nc-actionmenu__label">{item.label}</span>
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

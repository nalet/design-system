import * as React from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib/cx';
import { useLanguage } from '../../lib/language';
import './Modal.css';
import { rem } from '../../lib/rem';

export interface ModalProps {
  /** Whether the modal is shown. */
  open: boolean;
  /** Called on Esc, backdrop click, or close button. */
  onClose: () => void;
  /** Optional title rendered in a mono header with a close affordance. */
  title?: React.ReactNode;
  /** Optional footer (e.g. action buttons). */
  footer?: React.ReactNode;
  /** Body content. */
  children?: React.ReactNode;
  /** Max width in px at the usual text size; it grows with the reader's. Default 480. */
  width?: number;
  /**
   * A sheet on a narrow screen: where the window is narrower than `width` plus
   * the dialog's two margins, the dialog sits on the foot of the screen, across
   * its whole width. For a short task or a set of choices; a confirmation
   * before something that deletes or can't be undone never asks for it.
   * Default false: the dialog sits in the middle on every screen.
   */
  sheet?: boolean;
  /** Close when the backdrop is clicked. Default true. */
  closeOnBackdrop?: boolean;
  /** Close on the escape key. Default true. */
  closeOnEsc?: boolean;
  /** Accessible label when no visible title is given. */
  ariaLabel?: string;
  className?: string;
}

/** The margin a dialog keeps from the window's edges (`--s-4`), in px at the usual text size. */
const MARGIN = 16;

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** The page's text size in px: 16 unless the reader, or the page, set another. */
function rootTextSize(): number {
  const size = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return size > 0 ? size : 16;
}

/** Whether the dialog is on a screen made for a TV: `data-nc-screen="tv"` on the nearest ancestor that says. */
function onTv(node: HTMLElement): boolean {
  return node.closest('[data-nc-screen]')?.getAttribute('data-nc-screen') === 'tv';
}

/** A control that uses the left and right arrows itself: text to move through, a value to change. */
function keepsSideArrows(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  if (el.isContentEditable || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) return true;
  if (!(el instanceof HTMLInputElement)) return false;
  return !['button', 'checkbox', 'color', 'file', 'image', 'radio', 'reset', 'submit'].includes(el.type);
}

/**
 * Modal — a square dialog over a dim backdrop. Traps focus, closes on Esc and
 * backdrop click, locks body scroll, and restores focus to the opener. With
 * `sheet`, it sits on the foot of a narrow screen.
 */
export function Modal({
  open,
  onClose,
  title,
  footer,
  children,
  width = 480,
  sheet = false,
  closeOnBackdrop = true,
  closeOnEsc = true,
  ariaLabel,
  className,
}: ModalProps) {
  const { words } = useLanguage();
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const backdropRef = React.useRef<HTMLDivElement>(null);
  const lastFocused = React.useRef<HTMLElement | null>(null);
  const titleId = React.useId();
  // the latest onClose, so a new function on every parent render (an inline
  // arrow) does not re-run the open steps and pull focus back to the start.
  const onCloseRef = React.useRef(onClose);
  React.useLayoutEffect(() => {
    onCloseRef.current = onClose;
  });

  // a dialog that may be a sheet measures its room, the window: the backdrop
  // covers it. the width is in px at the usual text size, as the widths the
  // other components measure are, so the threshold is the dialog's own width
  // and margins at every text size. measured before the first paint, so the
  // dialog never shows in the middle first; null where nothing can be measured
  // (no ResizeObserver: jsdom), and the dialog then stays in the middle.
  const [windowWidth, setWindowWidth] = React.useState<number | null>(null);
  React.useLayoutEffect(() => {
    const el = backdropRef.current;
    if (!open || !sheet || !el || typeof ResizeObserver === 'undefined') {
      setWindowWidth(null);
      return;
    }
    const measure = () => setWindowWidth(Math.round((el.getBoundingClientRect().width * 16) / rootTextSize()));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, sheet]);
  const asSheet = sheet && windowWidth != null && windowWidth < width + 2 * MARGIN;

  React.useEffect(() => {
    if (!open) return;
    lastFocused.current = (document.activeElement as HTMLElement) ?? null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // focus the first focusable element, else the dialog
    const node = dialogRef.current;
    const focusable = node?.querySelector<HTMLElement>(FOCUSABLE);
    (focusable ?? node)?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      // bubble phase, after the dialog's own widgets: an open menu inside it
      // takes esc for itself (and stops it) before the dialog closes.
      if (closeOnEsc && e.key === 'Escape' && !e.defaultPrevented) {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key === 'Tab' && node) {
        const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
          (el) => !el.hasAttribute('disabled'),
        );
        if (items.length === 0) {
          e.preventDefault();
          return;
        }
        const first = items[0];
        const last = items[items.length - 1];
        // focus on the dialog itself (after a click on plain text): stay inside.
        if (document.activeElement === node) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        return;
      }
      // on a tv there is no tab key: the arrows of the remote move through the
      // dialog's controls in their order, down and right to the next, up and
      // left to the one before, and stop at the first and the last. like esc,
      // they come after the dialog's own widgets: tabs, a menu or a list that
      // moved with the key (and prevented its default) keep it. a field keeps
      // left and right for its text or its value, and a menu that opened from
      // the dialog, outside it, keeps every key. with the focus nowhere (what
      // had it is gone), the key brings it back into the dialog.
      const step =
        e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
      if (step === 0 || !node || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || !onTv(node)) return;
      const inside = e.target instanceof Node && node.contains(e.target);
      if (!inside && document.activeElement !== document.body) return;
      if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && keepsSideArrows(e.target)) return;
      // the key is the dialog's: nothing behind the dialog moves with it.
      e.preventDefault();
      e.stopPropagation();
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute('disabled') && !el.closest('[hidden]') && el.getAttribute('type') !== 'hidden',
      );
      const at = items.indexOf(document.activeElement as HTMLElement);
      const next = at < 0 ? items[step > 0 ? 0 : items.length - 1] : items[at + step];
      next?.focus();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      lastFocused.current?.focus?.();
    };
  }, [open, closeOnEsc]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className={cx('nc-modal', asSheet && 'nc-modal--sheet')} role="presentation">
      <div
        ref={backdropRef}
        className="nc-modal__backdrop"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        className={cx('nc-modal__dialog', className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title ? ariaLabel : undefined}
        // a sheet takes the whole width; a dialog in the middle its own, at the most.
        style={asSheet ? undefined : { maxWidth: rem(width) }}
        tabIndex={-1}
      >
        {title != null ? (
          <div className="nc-modal__header">
            <h2 id={titleId} className="nc-modal__title">
              {title}
            </h2>
            <button type="button" className="nc-modal__close" aria-label={words.modal.close} onClick={onClose}>
              <svg viewBox="0 0 14 14" width="0.875rem" height="0.875rem" fill="none">
                <path d="M3 3 L11 11 M11 3 L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ) : null}
        <div className="nc-modal__body">{children}</div>
        {footer != null ? <div className="nc-modal__footer">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}

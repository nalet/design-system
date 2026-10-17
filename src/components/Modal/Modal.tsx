import * as React from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib/cx';
import './Modal.css';

export interface ModalProps {
  /** whether the modal is shown. */
  open: boolean;
  /** called on esc, backdrop click, or close button. */
  onClose: () => void;
  /** optional title rendered in a mono header with a close affordance. */
  title?: React.ReactNode;
  /** optional footer (e.g. action buttons). */
  footer?: React.ReactNode;
  /** body content. */
  children?: React.ReactNode;
  /** max width in px. default 480. */
  width?: number;
  /** close when the backdrop is clicked. default true. */
  closeOnBackdrop?: boolean;
  /** close on the escape key. default true. */
  closeOnEsc?: boolean;
  /** accessible label when no visible title is given. */
  ariaLabel?: string;
  className?: string;
}

/**
 * Modal — a square dialog over a dim backdrop. traps focus, closes on esc and
 * backdrop click, locks body scroll, and restores focus to the opener.
 */
export function Modal({
  open,
  onClose,
  title,
  footer,
  children,
  width = 480,
  closeOnBackdrop = true,
  closeOnEsc = true,
  ariaLabel,
  className,
}: ModalProps) {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const lastFocused = React.useRef<HTMLElement | null>(null);
  const titleId = React.useId();
  // the latest onClose, so a new function on every parent render (an inline
  // arrow) does not re-run the open steps and pull focus back to the start.
  const onCloseRef = React.useRef(onClose);
  React.useLayoutEffect(() => {
    onCloseRef.current = onClose;
  });

  React.useEffect(() => {
    if (!open) return;
    lastFocused.current = (document.activeElement as HTMLElement) ?? null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // focus the first focusable element, else the dialog
    const node = dialogRef.current;
    const focusable = node?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
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
        const items = Array.from(
          node.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => !el.hasAttribute('disabled'));
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
      }
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
    <div className="nc-modal" role="presentation">
      <div
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
        style={{ maxWidth: width }}
        tabIndex={-1}
      >
        {title != null ? (
          <div className="nc-modal__header">
            <h2 id={titleId} className="nc-modal__title">
              {title}
            </h2>
            <button type="button" className="nc-modal__close" aria-label="close" onClick={onClose}>
              <svg viewBox="0 0 14 14" width="14" height="14" fill="none">
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

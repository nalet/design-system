import * as React from 'react';
import { cx } from '../../lib/cx';
import { StateGlyph, type State } from '../../lib/StateGlyph';
import '../../lib/a11y.css';
import './Banner.css';

export interface BannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The message's meaning. Default information. */
  state?: State;
  /**
   * The message: one or two human sentences that say what is true and what it
   * means. No IDs, codes or raw errors here — they go in `details`.
   */
  children: React.ReactNode;
  /** Actions after the text: one or two ghost buttons or links ("show them", "ask again"). */
  actions?: React.ReactNode;
  /** Technical detail (IDs, raw reasons) behind a disclosure, shown in mono. */
  details?: React.ReactNode;
  /** The disclosure's label. Default "details". */
  detailsLabel?: string;
  /** Open the details initially. */
  defaultDetailsOpen?: boolean;
  /** Shows a dismiss button when set. */
  onDismiss?: () => void;
  /** The dismiss button's accessible name. Default "dismiss". */
  dismissLabel?: string;
  /**
   * How the text is announced when it appears or changes: "polite"
   * (role=status), "assertive" (role=alert) or "off". Default: assertive for
   * error, polite otherwise.
   */
  live?: 'polite' | 'assertive' | 'off';
  /** Show the state's glyph (default), hide it, or pass your own. */
  icon?: boolean | React.ReactNode;
  /**
   * The word read before the text: the state's name ("warning: …") by default
   * for every state but neutral. A string translates it; false omits it.
   */
  stateLabel?: string | false;
}

/**
 * Banner — a page-level message about the screen's content: a square box
 * with a state rule, a glyph, human text, optional actions, an optional
 * "details" disclosure for the technical part, and an optional dismiss. The
 * text alone is the live region, so an announcement never reads the buttons.
 */
export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(function Banner(
  {
    state = 'information',
    children,
    actions,
    details,
    detailsLabel = 'details',
    defaultDetailsOpen = false,
    onDismiss,
    dismissLabel = 'dismiss',
    live,
    icon = true,
    stateLabel,
    className,
    ...rest
  },
  ref,
) {
  const [open, setOpen] = React.useState(defaultDetailsOpen);
  const detailsId = React.useId();
  const politeness = live ?? (state === 'error' ? 'assertive' : 'polite');
  const role = politeness === 'assertive' ? 'alert' : politeness === 'polite' ? 'status' : undefined;
  const srLabel = stateLabel === false ? null : (stateLabel ?? (state === 'neutral' ? null : state));
  const glyph = icon === true ? <StateGlyph state={state} size={14} /> : icon === false ? null : icon;

  return (
    <div
      ref={ref}
      className={cx('nc-strip', `nc-strip--${state}`, className)}
      data-state={state}
      {...rest}
    >
      {glyph ? (
        <span className="nc-strip__icon" aria-hidden="true">
          {glyph}
        </span>
      ) : null}
      <div className="nc-strip__body">
        <div className="nc-strip__line">
          <div className="nc-strip__text" role={role} aria-atomic={role ? true : undefined}>
            {srLabel ? <span className="nc-sr-only">{srLabel}: </span> : null}
            {children}
          </div>
          {actions != null || details != null ? (
            <div className="nc-strip__actions">
              {actions}
              {details != null ? (
                <button
                  type="button"
                  className="nc-strip__toggle"
                  aria-expanded={open}
                  aria-controls={detailsId}
                  onClick={() => setOpen((o) => !o)}
                >
                  <svg
                    viewBox="0 0 12 12"
                    width="10"
                    height="10"
                    fill="none"
                    aria-hidden="true"
                    className="nc-strip__caret"
                  >
                    <path d="M4 2.5 L7.5 6 L4 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                  </svg>
                  {detailsLabel}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
        {details != null ? (
          <div id={detailsId} className="nc-strip__details" hidden={!open}>
            {details}
          </div>
        ) : null}
      </div>
      {onDismiss ? (
        <button type="button" className="nc-strip__dismiss" aria-label={dismissLabel} onClick={onDismiss}>
          <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true">
            <path d="M3 3 L9 9 M9 3 L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
        </button>
      ) : null}
    </div>
  );
});

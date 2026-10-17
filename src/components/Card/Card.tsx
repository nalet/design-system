import * as React from 'react';
import { cx } from '../../lib/cx';
import './Card.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional header row. When set, draws a hairline-separated title bar. */
  header?: React.ReactNode;
  /** Optional right-aligned node in the header (actions). */
  headerAside?: React.ReactNode;
  /** Optional footer row, hairline-separated. */
  footer?: React.ReactNode;
  /** Remove body padding (for tables / full-bleed content). */
  flush?: boolean;
  /** Use the deeper bg-2 instead of surface. */
  sunken?: boolean;
}

/**
 * Card — a square surface panel with a hairline border. Optional mono header
 * and footer rows. The default container for grouped content.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { header, headerAside, footer, flush, sunken, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx('nc-card', sunken && 'nc-card--sunken', className)}
      {...rest}
    >
      {header != null || headerAside != null ? (
        <div className="nc-card__header">
          <div className="nc-card__title">{header}</div>
          {headerAside != null ? <div className="nc-card__aside">{headerAside}</div> : null}
        </div>
      ) : null}
      <div className={cx('nc-card__body', flush && 'nc-card__body--flush')}>{children}</div>
      {footer != null ? <div className="nc-card__footer">{footer}</div> : null}
    </div>
  );
});

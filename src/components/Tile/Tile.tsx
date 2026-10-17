import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cx } from '../../lib/cx';
import { Chevron } from '../../brand/Chevron/Chevron';
import './Tile.css';

export type TileVariant = 'app' | 'kpi';
export type TileSize = 'sm' | 'md' | 'lg';
export type TileBadgeTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';
export type TileStatus = 'online' | 'offline' | 'degraded' | 'unknown';

export interface TileDelta {
  /** The trend value, e.g. `4` or `'0.2'`. */
  value: string | number;
  /** Arrow direction. Decoupled from tone so 'down' can be good. */
  direction: 'up' | 'down' | 'flat';
  /** Colour of the trend. Defaults to neutral. */
  tone?: 'positive' | 'negative' | 'neutral';
}

export interface TileProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Lowercase mono primary label. */
  title: string;
  /** Lucide icon component, e.g. `import { Server } from 'lucide-react'`. */
  icon?: LucideIcon;
  /** One-line supporting text (app variant). */
  description?: string;
  /** Navigate on activate — renders an `<a>`. */
  href?: string;
  /** App tile (default) or a KPI / metric tile. */
  variant?: TileVariant;
  /** KPI value (large mono). */
  value?: string | number;
  /** KPI unit suffix, e.g. `%`, `ms`, `gb`. */
  unit?: string;
  /** KPI trend chip. */
  delta?: TileDelta;
  /** Top-right marker. A number renders a count chip, a string a status pill. */
  badge?: string | number;
  /** Badge colour. */
  badgeTone?: TileBadgeTone;
  /** Small square health dot. */
  status?: TileStatus;
  /** Dim + remove from tab / arrow order. */
  disabled?: boolean;
  /** Mark as the current app (left accent rule). */
  selected?: boolean;
  /** Open in a new tab + show the external glyph (with href). */
  external?: boolean;
  /** Footprint. */
  size?: TileSize;
  /** Render as a custom element (e.g. a router `Link`). */
  as?: React.ElementType;
}

/**
 * Tile — a square launch tile for the Portal. An app tile (icon + title +
 * description) or a KPI tile (value + unit + trend). Whole tile is the target;
 * renders an `<a>` for href, a `<button>` for onClick, or a plain panel when it
 * is display-only. No border-radius — the icon is the only rounded shape.
 */
export const Tile = React.forwardRef<HTMLElement, TileProps>(function Tile(
  {
    title,
    icon: Glyph,
    description,
    href,
    variant = 'app',
    value,
    unit,
    delta,
    badge,
    badgeTone = 'info',
    status,
    disabled = false,
    selected = false,
    external = false,
    size = 'md',
    as,
    className,
    onClick,
    ...rest
  },
  ref,
) {
  const wantsInteractive = !!(href || onClick || as) && !disabled;
  const El: React.ElementType = disabled
    ? 'div'
    : (as ?? (href ? 'a' : onClick ? 'button' : 'div'));

  const search = `${title} ${description ?? ''}`.trim().toLowerCase();

  const props: Record<string, unknown> = {
    ref,
    className: cx(
      'nc-tile',
      `nc-tile--${variant}`,
      `nc-tile--${size}`,
      selected && 'nc-tile--selected',
      disabled && 'nc-tile--disabled',
      wantsInteractive && 'nc-tile--interactive',
      className,
    ),
    'data-nc-search': search,
    'aria-disabled': disabled || undefined,
    ...rest,
  };

  if (wantsInteractive) {
    props['data-nc-tile'] = '';
    props.onClick = onClick;
    if (El === 'a') {
      props.href = href;
      if (external) {
        props.target = '_blank';
        props.rel = 'noopener noreferrer';
      }
    } else if (El === 'button') {
      props.type = 'button';
    }
  }

  const content = (
    <>
      <div className="nc-tile__top">
        {Glyph ? (
          <span className="nc-tile__icon">
            <Glyph size={22} strokeWidth={1.75} aria-hidden />
          </span>
        ) : null}
        <div className="nc-tile__heading">
          <span className="nc-tile__title">{title}</span>
          {wantsInteractive ? (
            <Chevron size={14} className="nc-tile__chevron" aria-hidden />
          ) : null}
        </div>
        {badge != null ? (
          <span
            className={cx(
              'nc-tile__badge',
              `nc-tile__badge--${badgeTone}`,
              typeof badge === 'number' && 'nc-tile__badge--count',
            )}
          >
            {badge}
          </span>
        ) : null}
        {status ? (
          <span
            className={cx('nc-tile__status', `nc-tile__status--${status}`)}
            role="img"
            aria-label={`status: ${status}`}
          />
        ) : null}
      </div>

      {variant === 'kpi' ? (
        <div className="nc-tile__kpi">
          <span className="nc-tile__value">
            {value}
            {unit ? <span className="nc-tile__unit">{unit}</span> : null}
          </span>
          {delta ? (
            <span className={cx('nc-tile__delta', `nc-tile__delta--${delta.tone ?? 'neutral'}`)}>
              <span className="nc-tile__delta-arrow" data-dir={delta.direction} aria-hidden />
              {delta.value}
            </span>
          ) : null}
        </div>
      ) : description ? (
        <div className="nc-tile__desc">{description}</div>
      ) : null}
    </>
  );

  return React.createElement(El, props, content);
});

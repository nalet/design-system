import * as React from 'react';
import { cx } from '../../lib/cx';
import { ObjectStatus, type ObjectStatusProps } from '../ObjectStatus/ObjectStatus';
import '../../lib/a11y.css';
import './cells.css';

export interface StatusCellProps extends ObjectStatusProps {
  /** One line under the status: why, or what happens next ("again in 3h"). Up to two lines show; the rest is on hover. */
  detail?: React.ReactNode;
}

/**
 * StatusCell — a table cell's status: an ObjectStatus and, optionally, the
 * reason under it. The reason is in the DOM in full (screen readers read it);
 * on screen it clamps to two lines with the whole text on hover.
 */
export function StatusCell({ detail, className, ...status }: StatusCellProps) {
  return (
    <span className={cx('nc-cell-status', className)}>
      <ObjectStatus {...status} />
      {detail != null && detail !== '' ? (
        <span className="nc-cell-status__detail" title={typeof detail === 'string' ? detail : undefined}>
          {detail}
        </span>
      ) : null}
    </span>
  );
}

const DAY = 86_400_000;

/** Whole calendar days from `then` to `now`, in the viewer's time zone. */
function dayDiff(then: Date, now: Date): number {
  const a = Date.UTC(then.getFullYear(), then.getMonth(), then.getDate());
  const b = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((b - a) / DAY);
}

/**
 * relativeDay — a compact and a spoken form of how far a date is from today:
 * today, yesterday, 5d ago, 3w ago, 4mo ago, 2y ago, tomorrow, in 3d.
 */
export function relativeDay(then: Date, now: Date = new Date()): { short: string; long: string } {
  const d = dayDiff(then, now);
  if (d === 0) return { short: 'today', long: 'today' };
  if (d === 1) return { short: 'yesterday', long: 'yesterday' };
  if (d === -1) return { short: 'tomorrow', long: 'tomorrow' };
  const n = Math.abs(d);
  const [count, unit, word] =
    n < 14 ? [n, 'd', 'day'] : n < 60 ? [Math.round(n / 7), 'w', 'week'] : n < 730 ? [Math.round(n / 30.44), 'mo', 'month'] : [Math.round(n / 365.25), 'y', 'year'];
  const long = `${count} ${word}${count === 1 ? '' : 's'}`;
  return d > 0 ? { short: `${count}${unit} ago`, long: `${long} ago` } : { short: `in ${count}${unit}`, long: `in ${long}` };
}

export interface DateCellProps {
  /** A Date, an ISO string or epoch ms. Empty shows the empty text. */
  value: Date | string | number | null | undefined;
  /** Also show how long ago (or until). Default true. */
  relative?: boolean;
  /** The moment taken as "now", for stable stories and tests. Default the current time. */
  now?: Date;
  /** Default en-GB: 12 oct 2026. */
  locale?: string;
  format?: Intl.DateTimeFormatOptions;
  /** What an empty value shows. Default an em dash, read as "no date". */
  emptyText?: string;
  className?: string;
}

const DEFAULT_FORMAT: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
const FULL_FORMAT: Intl.DateTimeFormatOptions = { dateStyle: 'full', timeStyle: 'short' };

// building an Intl.DateTimeFormat is expensive; a table renders thousands of
// dates. one formatter per locale and options, made once.
const formatters = new Map<string, Intl.DateTimeFormat>();
function formatter(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale}|${JSON.stringify(options)}`;
  let f = formatters.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat(locale, options);
    formatters.set(key, f);
  }
  return f;
}

/**
 * DateCell — a date said both ways: absolute ("12 oct 2026", a <time> with the
 * full timestamp on hover) and relative ("5d ago", read as "5 days ago").
 */
export function DateCell({
  value,
  relative = true,
  now,
  locale = 'en-GB',
  format = DEFAULT_FORMAT,
  emptyText = '—',
  className,
}: DateCellProps) {
  const date = value == null || value === '' ? null : value instanceof Date ? value : new Date(value);
  if (!date || Number.isNaN(date.getTime())) {
    return (
      <span className={cx('nc-cell-date', 'nc-cell-date--empty', className)}>
        <span aria-hidden="true">{emptyText}</span>
        <span className="nc-sr-only">no date</span>
      </span>
    );
  }
  const abs = formatter(locale, format).format(date);
  const full = formatter(locale, FULL_FORMAT).format(date);
  const rel = relative ? relativeDay(date, now ?? new Date()) : null;
  // A date's text may differ between the server that pre-rendered the page and
  // the browser that hydrates it: each engine carries its own locale data
  // ("Sept" or "Sep"), and "today" depends on when it is read. That is
  // expected, so React keeps the server's text instead of failing hydration.
  return (
    <span className={cx('nc-cell-date', className)}>
      <time className="nc-cell-date__abs" dateTime={date.toISOString()} title={full} suppressHydrationWarning>
        {abs}
      </time>
      {rel ? (
        <span className="nc-cell-date__rel">
          <span aria-hidden="true" suppressHydrationWarning>{rel.short}</span>
          <span className="nc-sr-only" suppressHydrationWarning>, {rel.long}</span>
        </span>
      ) : null}
    </span>
  );
}

export interface IdentifierCellProps {
  /** What identifies the row: "S04E07", a name. */
  title: React.ReactNode;
  /** A second line, when known: an episode title, a host. */
  text?: React.ReactNode;
  className?: string;
}

/** IdentifierCell — the row's name: a mono title and an optional quieter second line. */
export function IdentifierCell({ title, text, className }: IdentifierCellProps) {
  return (
    <span className={cx('nc-cell-id', className)}>
      <span className="nc-cell-id__title">{title}</span>
      {text != null && text !== '' ? <span className="nc-cell-id__text">{text}</span> : null}
    </span>
  );
}

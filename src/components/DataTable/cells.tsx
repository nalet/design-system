import * as React from 'react';
import { cx } from '../../lib/cx';
import { dateLanguage, pageLanguage, useLanguage } from '../../lib/language';
import { Status, type StatusProps } from '../Status/Status';
import '../../lib/a11y.css';
import './cells.css';

export interface StatusCellProps extends StatusProps {
  /** One line under the status: why, or what happens next ("again in 3h"). Up to two lines show; the rest is on hover. */
  detail?: React.ReactNode;
}

/**
 * StatusCell — a table cell's status: a Status and, optionally, the reason
 * under it. The reason is in the DOM in full (screen readers read it); on
 * screen it clamps to two lines with the whole text on hover.
 */
export function StatusCell({ detail, className, ...status }: StatusCellProps) {
  return (
    <span className={cx('nc-cell-status', className)}>
      <Status {...status} />
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

const ENGLISH = /^en(-|$)/i;

// English says how long ago in the system's own short forms, the same in every
// engine and in every region: 5d ago, 3w ago, 4mo ago, 2y ago, in 3d.
function englishRelative(d: number, count: number, unit: Intl.RelativeTimeFormatUnit): { short: string; long: string } {
  if (d === 0) return { short: 'today', long: 'today' };
  if (d === 1) return { short: 'yesterday', long: 'yesterday' };
  if (d === -1) return { short: 'tomorrow', long: 'tomorrow' };
  const letter = unit === 'day' ? 'd' : unit === 'week' ? 'w' : unit === 'month' ? 'mo' : 'y';
  const long = `${count} ${unit}${count === 1 ? '' : 's'}`;
  return d > 0 ? { short: `${count}${letter} ago`, long: `${long} ago` } : { short: `in ${count}${letter}`, long: `in ${long}` };
}

// one formatter per language and style, made once, as for the dates below.
const relativeFormats = new Map<string, Intl.RelativeTimeFormat>();
function relativeFormat(lang: string, style: 'narrow' | 'long'): Intl.RelativeTimeFormat {
  const key = `${lang}|${style}`;
  let f = relativeFormats.get(key);
  if (!f) {
    f = new Intl.RelativeTimeFormat(lang, { numeric: 'auto', style });
    relativeFormats.set(key, f);
  }
  return f;
}

/**
 * relativeDay — a compact and a spoken form of how far a date is from today.
 * In English: today, yesterday, 5d ago, 3w ago, 4mo ago, 2y ago, tomorrow,
 * in 3d, spoken as "5 days ago". In any other language the forms are the
 * language's own, from the browser: "vor 5 Tagen", "gestern". Without a
 * language it is the page's.
 */
export function relativeDay(
  then: Date,
  now: Date = new Date(),
  lang: string = pageLanguage(),
): { short: string; long: string } {
  const d = dayDiff(then, now);
  const n = Math.abs(d);
  const [count, unit]: [number, Intl.RelativeTimeFormatUnit] =
    n < 14 ? [n, 'day'] : n < 60 ? [Math.round(n / 7), 'week'] : n < 730 ? [Math.round(n / 30.44), 'month'] : [Math.round(n / 365.25), 'year'];
  if (ENGLISH.test(lang)) return englishRelative(d, count, unit);
  try {
    // a date in the past is a negative distance.
    const distance = d > 0 ? -count : count;
    return {
      short: relativeFormat(lang, 'narrow').format(distance, unit),
      long: relativeFormat(lang, 'long').format(distance, unit),
    };
  } catch {
    // a language tag the browser can't read: English, as for a count.
    return englishRelative(d, count, unit);
  }
}

export interface DateCellProps {
  /** A Date, an ISO string or epoch ms. Empty shows the empty text. */
  value: Date | string | number | null | undefined;
  /** Also show how long ago (or until). Default true. */
  relative?: boolean;
  /** The moment taken as "now", for stable stories and tests. Default the current time. */
  now?: Date;
  /**
   * The language the date and how long ago are written in, as a language tag.
   * Default: the language the cell is in, the page's or the nearest
   * `Language`'s. English without a region writes the day first: 12 oct 2026.
   */
  locale?: string;
  format?: Intl.DateTimeFormatOptions;
  /** What an empty value shows. Default an em dash, read as "no date" in the page's language. */
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
    try {
      f = new Intl.DateTimeFormat(locale, options);
    } catch {
      // a language tag the browser can't read: English, as for a count.
      f = new Intl.DateTimeFormat(dateLanguage('en'), options);
    }
    formatters.set(key, f);
  }
  return f;
}

// English short month names differ between engines and their versions ("Sept"
// in one, "Sep" in another); the first three letters read the same everywhere.
function absolute(date: Date, locale: string, format: Intl.DateTimeFormatOptions): string {
  const f = formatter(locale, format);
  if (format.month !== 'short' || !ENGLISH.test(locale)) return f.format(date);
  return f
    .formatToParts(date)
    .map((part) => (part.type === 'month' ? part.value.slice(0, 3) : part.value))
    .join('');
}

/**
 * DateCell — a date said both ways: absolute ("12 oct 2026", a <time> with the
 * full timestamp on hover) and relative ("5d ago", read as "5 days ago"), in
 * the language the cell is in: "12. okt. 2026", "vor 5 tagen" on a German page.
 */
export function DateCell({
  value,
  relative = true,
  now,
  locale,
  format = DEFAULT_FORMAT,
  emptyText = '—',
  className,
}: DateCellProps) {
  const { lang, words } = useLanguage();
  const date = value == null || value === '' ? null : value instanceof Date ? value : new Date(value);
  if (!date || Number.isNaN(date.getTime())) {
    return (
      <span className={cx('nc-cell-date', 'nc-cell-date--empty', className)}>
        <span aria-hidden="true">{emptyText}</span>
        <span className="nc-sr-only">{words.dateCell.noDate}</span>
      </span>
    );
  }
  // the cell's language: the one it is given, else the one it is in.
  const dateTag = locale ?? dateLanguage(lang);
  const abs = absolute(date, dateTag, format);
  const full = formatter(dateTag, FULL_FORMAT).format(date);
  const rel = relative ? relativeDay(date, now ?? new Date(), locale ?? lang) : null;
  // A date's text may differ between the server that pre-rendered the page and
  // the browser that hydrates it: each engine carries its own locale data,
  // and "today" depends on when it is read. That is expected, so React keeps
  // the server's text instead of failing hydration.
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

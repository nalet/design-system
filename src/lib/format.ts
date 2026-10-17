/**
 * formatCount — a count with thousands separators ("2,500"), the way every
 * count in the system reads. One formatter, created once.
 */
const COUNT = new Intl.NumberFormat('en');

export function formatCount(n: number): string {
  return COUNT.format(n);
}

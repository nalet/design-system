/**
 * cx — tiny classname joiner. no dependency, no border-radius opinions.
 * filters falsy values and joins with a space.
 */
export type ClassValue = string | number | false | null | undefined;

export function cx(...values: ClassValue[]): string {
  let out = '';
  for (const v of values) {
    if (!v) continue;
    out = out ? `${out} ${v}` : `${v}`;
  }
  return out;
}

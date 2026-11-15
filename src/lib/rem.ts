/**
 * rem — a size given in pixels at the usual text size, as a share of the
 * page's text size: rem(12) is "0.75rem". Sizes written this way follow the
 * reader's text size; a size in px would not.
 */
export function rem(px: number): string {
  return `${px / 16}rem`;
}

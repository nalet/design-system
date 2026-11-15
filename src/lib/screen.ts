/**
 * screen — the kind of screen an element is drawn on.
 *
 * An app says it once, with `data-nc-screen="touch"` or `data-nc-screen="tv"`
 * on an ancestor, usually the root element; the nearest one counts. Without
 * it a screen is for a pointer and a keyboard, and this is undefined. The sizes
 * and the focus of the two kinds are css (`src/styles/screens.css`); this is
 * for the few places where a component behaves differently, such as the
 * select that opens its own list on a tv.
 */
export type ScreenKind = 'touch' | 'tv';

/**
 * The kind of screen an element is on, or undefined for a pointer and a
 * keyboard. Also what a part rendered outside its ancestor (a menu, a dialog,
 * a list drawn into the body) reads to carry the attribute itself.
 */
export function screenOf(el: Element | null | undefined): ScreenKind | undefined {
  const said = el?.closest('[data-nc-screen]')?.getAttribute('data-nc-screen');
  return said === 'touch' || said === 'tv' ? said : undefined;
}

/**
 * On a tv everything that can take the focus is pressed with OK, which a
 * remote sends as Enter. A checkbox and a switch are flipped by Space
 * everywhere; on a tv, Enter flips them too. Returns true when it did.
 */
export function pressOnTv(e: { key: string; defaultPrevented: boolean; preventDefault(): void; currentTarget: HTMLInputElement }): boolean {
  if (e.key !== 'Enter' || e.defaultPrevented || e.currentTarget.disabled || screenOf(e.currentTarget) !== 'tv') return false;
  e.preventDefault();
  e.currentTarget.click();
  return true;
}

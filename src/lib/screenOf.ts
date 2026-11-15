/**
 * screenOf — the kind of screen an element is drawn on, as the app says it
 * with `data-nc-screen` on an ancestor: "touch", "tv", or nothing for a
 * pointer and a keyboard. The stylesheets read the same attribute; this is
 * for the few things only script can do: the keys of a remote, and carrying
 * the attribute to a part that is rendered outside its ancestor.
 */
export type ScreenKind = 'touch' | 'tv';

export function screenOf(el: Element | null | undefined): ScreenKind | undefined {
  const kind = el?.closest('[data-nc-screen]')?.getAttribute('data-nc-screen');
  return kind === 'touch' || kind === 'tv' ? kind : undefined;
}

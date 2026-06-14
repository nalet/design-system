import * as React from 'react';

/**
 * useRovingGrid — roving-tabindex 2-D keyboard navigation over a set of tiles.
 *
 * exactly one tile in the container is tabbable (`tabindex=0`); the rest are
 * `-1`, so tab moves OUT of the grid rather than through every tile. arrow keys
 * move focus between tiles: left/right step in dom order, up/down pick the
 * geometric nearest neighbour in that direction (so it works on responsive
 * auto-fill grids and spills across group boundaries when the container holds
 * more than one group). disabled / hidden tiles are skipped.
 *
 * tiles opt in by carrying the `data-nc-tile` attribute on a natively focusable
 * element (the `<a>` / `<button>` a Tile renders). no dependency, no dom owned
 * outside the passed ref.
 */

const TILE = '[data-nc-tile]';

function allTiles(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(TILE));
}

function focusableTiles(root: HTMLElement): HTMLElement[] {
  return allTiles(root).filter(
    (el) => el.getAttribute('aria-disabled') !== 'true' && el.offsetParent !== null,
  );
}

function geometricNeighbour(
  tiles: HTMLElement[],
  current: HTMLElement,
  dir: 'up' | 'down',
): HTMLElement | undefined {
  const c = current.getBoundingClientRect();
  const cx = c.left + c.width / 2;
  const cy = c.top + c.height / 2;
  let best: HTMLElement | undefined;
  let bestScore = Infinity;
  for (const el of tiles) {
    if (el === current) continue;
    const r = el.getBoundingClientRect();
    const rx = r.left + r.width / 2;
    const ry = r.top + r.height / 2;
    const dy = ry - cy;
    if (dir === 'down' && dy <= 1) continue;
    if (dir === 'up' && dy >= -1) continue;
    // weight horizontal distance heavily so we prefer the same column.
    const score = Math.abs(dy) + Math.abs(rx - cx) * 2;
    if (score < bestScore) {
      bestScore = score;
      best = el;
    }
  }
  return best;
}

export interface RovingGrid {
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function useRovingGrid(
  containerRef: React.RefObject<HTMLElement>,
  enabled = true,
): RovingGrid {
  // keep exactly one tile tabbable. re-runs each render so it tracks tiles
  // appearing / disappearing (search filtering, collapsing groups).
  React.useEffect(() => {
    if (!enabled) return;
    const root = containerRef.current;
    if (!root) return;
    const tiles = allTiles(root);
    if (!tiles.length) return;
    const enabledTiles = tiles.filter((el) => el.getAttribute('aria-disabled') !== 'true');
    const active = root.querySelector<HTMLElement>(`${TILE}[data-nc-active="true"]`);
    const current = active && enabledTiles.includes(active) ? active : enabledTiles[0];
    for (const el of tiles) el.tabIndex = el === current ? 0 : -1;
  });

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!enabled) return;
      const root = containerRef.current;
      if (!root) return;
      const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
      if (!keys.includes(e.key)) return;
      const tiles = focusableTiles(root);
      if (!tiles.length) return;
      const currentEl = document.activeElement as HTMLElement | null;
      const idx = currentEl ? tiles.indexOf(currentEl) : -1;

      let next: HTMLElement | undefined;
      if (e.key === 'Home') next = tiles[0];
      else if (e.key === 'End') next = tiles[tiles.length - 1];
      else if (idx === -1) next = tiles[0];
      else if (e.key === 'ArrowRight') next = tiles[Math.min(idx + 1, tiles.length - 1)];
      else if (e.key === 'ArrowLeft') next = tiles[Math.max(idx - 1, 0)];
      else next = geometricNeighbour(tiles, tiles[idx], e.key === 'ArrowDown' ? 'down' : 'up');

      if (next && next !== currentEl) {
        e.preventDefault();
        for (const el of tiles) el.removeAttribute('data-nc-active');
        next.setAttribute('data-nc-active', 'true');
        if (currentEl) currentEl.tabIndex = -1;
        next.tabIndex = 0;
        next.focus();
      }
    },
    [containerRef, enabled],
  );

  return { onKeyDown };
}

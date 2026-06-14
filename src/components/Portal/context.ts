import * as React from 'react';

/**
 * PortalContext — lets a Portal tell the TileGroups nested inside it that IT is
 * running roving-tabindex keyboard navigation across the whole launcher, so the
 * groups don't also self-manage (which would fight over focus). a standalone
 * TileGroup (no Portal above it) sees `null` and manages its own grid.
 */
export interface PortalContextValue {
  /** the Portal owns roving keyboard nav across all groups. */
  rovingManaged: boolean;
}

export const PortalContext = React.createContext<PortalContextValue | null>(null);

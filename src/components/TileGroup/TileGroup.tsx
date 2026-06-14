import * as React from 'react';
import { cx } from '../../lib/cx';
import { Chevron } from '../../brand/Chevron/Chevron';
import { useRovingGrid } from '../../lib/useRovingGrid';
import { PortalContext } from '../Portal/context';
import './TileGroup.css';

export type TileGroupGap = 'xs' | 'sm' | 'md' | 'lg';

export interface TileGroupProps extends React.HTMLAttributes<HTMLElement> {
  /** lowercase mono section title (gets a leading blue chevron). */
  legend: string;
  /** optional secondary line under the legend. */
  description?: string;
  /** fixed column count, or 'auto' (default) for a responsive auto-fill grid. */
  columns?: number | 'auto';
  /** min tile width for the 'auto' grid. default 14rem. */
  minTileWidth?: string;
  /** grid gap. default md. */
  gap?: TileGroupGap;
  /** trailing slot on the legend row (e.g. a "manage" link or count). */
  action?: React.ReactNode;
  /**
   * keyboard model. 'roving' (default) = one tab stop + arrow keys move between
   * tiles. 'tab' = every tile is its own tab stop. ignored when the group is
   * inside a Portal that runs roving across all groups.
   */
  navigation?: 'roving' | 'tab';
  /** the Tile children. */
  children: React.ReactNode;
}

/**
 * TileGroup — a labelled, square-grid section of Tiles. the legend names the
 * group (a stable, spatially-consistent section, per launcher research); the
 * grid is a responsive css auto-fill grid by default. provides roving-tabindex
 * arrow-key navigation unless a parent Portal owns it.
 */
export const TileGroup = React.forwardRef<HTMLElement, TileGroupProps>(function TileGroup(
  {
    legend,
    description,
    columns = 'auto',
    minTileWidth = '14rem',
    gap = 'md',
    action,
    navigation = 'roving',
    className,
    children,
    ...rest
  },
  ref,
) {
  const portal = React.useContext(PortalContext);
  const selfManage = navigation === 'roving' && !portal?.rovingManaged;
  const gridRef = React.useRef<HTMLDivElement>(null);
  const roving = useRovingGrid(gridRef, selfManage);
  const headingId = React.useId();

  const gridStyle: React.CSSProperties =
    columns === 'auto'
      ? { gridTemplateColumns: `repeat(auto-fill, minmax(${minTileWidth}, 1fr))` }
      : { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` };

  return (
    <section ref={ref} className={cx('nc-tilegroup', className)} aria-labelledby={headingId} {...rest}>
      <div className="nc-tilegroup__head">
        <h2 id={headingId} className="nc-tilegroup__legend">
          <Chevron size={14} className="nc-tilegroup__chev" aria-hidden />
          {legend}
        </h2>
        {action ? <div className="nc-tilegroup__action">{action}</div> : null}
      </div>
      {description ? <p className="nc-tilegroup__desc">{description}</p> : null}
      <div
        ref={gridRef}
        className={cx('nc-tilegroup__grid', `nc-tilegroup__grid--gap-${gap}`)}
        style={gridStyle}
        onKeyDown={selfManage ? roving.onKeyDown : undefined}
      >
        {children}
      </div>
    </section>
  );
});

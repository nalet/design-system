import * as React from 'react';
import { cx } from '../../lib/cx';
import { space, type SpaceToken } from '../../lib/space';
import './Box.css';

type SurfaceToken = 'bg' | 'bg-2' | 'surface' | 'surface-2';

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  /** inner padding from the 4-base space scale. */
  p?: SpaceToken;
  px?: SpaceToken;
  py?: SpaceToken;
  /** background from the canvas tokens. */
  bg?: SurfaceToken;
  /** draw a hairline border (var(--border)). */
  border?: boolean;
}

const BG_VAR: Record<SurfaceToken, string> = {
  bg: 'var(--bg)',
  'bg-2': 'var(--bg-2)',
  surface: 'var(--surface)',
  'surface-2': 'var(--surface-2)',
};

/**
 * Box — the base layout primitive. square by definition, padding from tokens,
 * optional canvas background and hairline border. no radius, ever.
 */
export const Box = React.forwardRef<HTMLDivElement, BoxProps>(function Box(
  { p, px, py, bg, border, className, style, ...rest },
  ref,
) {
  const css: React.CSSProperties = { ...style };
  if (p !== undefined) css.padding = space(p);
  if (px !== undefined) {
    css.paddingLeft = space(px);
    css.paddingRight = space(px);
  }
  if (py !== undefined) {
    css.paddingTop = space(py);
    css.paddingBottom = space(py);
  }
  if (bg) css.background = BG_VAR[bg];
  return (
    <div
      ref={ref}
      className={cx('nc-box', border && 'nc-box--border', className)}
      style={css}
      {...rest}
    />
  );
});

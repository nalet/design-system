import * as React from 'react';
import { cx } from '../../lib/cx';
import { space, type SpaceToken } from '../../lib/space';
import './Stack.css';

type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** main axis. default vertical. */
  direction?: 'vertical' | 'horizontal';
  /** gap between children from the 4-base space scale. default 16. */
  gap?: SpaceToken;
  align?: Align;
  justify?: Justify;
  /** allow children to wrap (horizontal only). */
  wrap?: boolean;
  /** stretch to fill the cross axis. */
  inline?: boolean;
}

const ALIGN: Record<Align, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};

const JUSTIFY: Record<Justify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
};

/**
 * Stack — flexbox row/column with gap straight off the space tokens.
 * the workhorse for laying out everything else.
 */
export const Stack = React.forwardRef<HTMLDivElement, StackProps>(function Stack(
  { direction = 'vertical', gap = 16, align, justify, wrap, inline, className, style, ...rest },
  ref,
) {
  const css: React.CSSProperties = {
    display: inline ? 'inline-flex' : 'flex',
    flexDirection: direction === 'horizontal' ? 'row' : 'column',
    gap: space(gap),
    ...style,
  };
  if (align) css.alignItems = ALIGN[align];
  if (justify) css.justifyContent = JUSTIFY[justify];
  if (wrap) css.flexWrap = 'wrap';
  return <div ref={ref} className={cx('nc-stack', className)} style={css} {...rest} />;
});

import * as React from 'react';
import { cx } from '../../lib/cx';
import './Lockup.css';

export interface LockupProps extends React.SVGProps<SVGSVGElement> {
  /** rendered height in px. width scales to keep the 480x160 ratio. default 40. */
  height?: number;
  /** draw the blinking cursor block. default true. */
  showCursor?: boolean;
  /** paint a solid bg rect behind the mark (matches the asset). default false. */
  filled?: boolean;
}

/**
 * Lockup — the nalet.cloud wordmark, inline svg. blue chevron, mono wordmark,
 * one blinking cursor. mirrors assets/terminal/nalet-cloud-lockup.svg.
 */
export const Lockup = React.forwardRef<SVGSVGElement, LockupProps>(function Lockup(
  { height = 40, showCursor = true, filled = false, className, ...rest },
  ref,
) {
  const width = (height / 160) * 480;
  return (
    <svg
      ref={ref}
      className={cx('nc-lockup', className)}
      width={width}
      height={height}
      viewBox="0 0 480 160"
      role="img"
      aria-label="nalet.cloud"
      {...rest}
    >
      {filled ? <rect width="480" height="160" fill="var(--bg)" /> : null}
      <path
        d="M46 50 L76 80 L46 110"
        fill="none"
        stroke="var(--cloud-blue)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="100"
        y="100"
        fontFamily="var(--ff-mono)"
        fontWeight="700"
        fontSize="44"
        fill="var(--fg-2)"
        letterSpacing="0.5"
      >
        nalet.cloud
      </text>
      {showCursor ? (
        <rect className="nc-lockup__cursor" x="436" y="58" width="14" height="48" fill="var(--cloud-blue)">
          <animate
            attributeName="opacity"
            values="1;1;0;0"
            keyTimes="0;0.5;0.5;1"
            dur="1.05s"
            repeatCount="indefinite"
          />
        </rect>
      ) : null}
    </svg>
  );
});

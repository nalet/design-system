
/** The five semantic states. Colour, glyph and announcement all follow from one of these. */
export type State = 'neutral' | 'information' | 'success' | 'warning' | 'error';

export const STATES: readonly State[] = ['neutral', 'information', 'success', 'warning', 'error'];

/**
 * One square-capped line glyph per state, each a different shape so the state
 * never rests on colour alone (WCAG 1.4.1): a dash, a bar with a dot, a check,
 * a triangle with a bar, a cross. 12 × 12 viewbox, drawn in currentColor.
 */
export function StateGlyph({ state, size = 12 }: { state: State; size?: number }) {
  const common = {
    viewBox: '0 0 12 12',
    width: size,
    height: size,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'square' as const,
    strokeLinejoin: 'miter' as const,
    'aria-hidden': true,
    focusable: false,
    className: 'nc-state-glyph',
  };
  switch (state) {
    case 'information':
      return (
        <svg {...common}>
          <path d="M6 5.5 V10" />
          <path d="M6 2.25 V2.75" strokeWidth={1.75} />
        </svg>
      );
    case 'success':
      return (
        <svg {...common}>
          <path d="M2 6.5 L4.75 9.25 L10 3" />
        </svg>
      );
    case 'warning':
      return (
        <svg {...common}>
          <path d="M6 1.5 L11 10.5 H1 Z" strokeWidth={1.25} />
          <path d="M6 5 V7" strokeWidth={1.25} />
          <path d="M6 8.75 V9" strokeWidth={1.25} />
        </svg>
      );
    case 'error':
      return (
        <svg {...common}>
          <path d="M2.75 2.75 L9.25 9.25 M9.25 2.75 L2.75 9.25" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M3 6 H9" />
        </svg>
      );
  }
}

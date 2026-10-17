import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';
import { expectNoAxeViolations } from '../../test/axe';

const snakeOf = (container: HTMLElement) => container.querySelector<SVGPathElement>('.nc-spinner__snake')!;
const frameOf = (container: HTMLElement) => container.querySelector<SVGPathElement>('.nc-spinner__frame')!;

describe('Spinner', () => {
  it('is a status with a label, the drawing hidden from assistive technology', () => {
    const { container } = render(<Spinner label="loading the backlog" />);
    expect(screen.getByRole('status', { name: 'loading the backlog' })).toBeInTheDocument();
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('draws the frame and the snake on one square that starts mid-edge', () => {
    const { container } = render(<Spinner size={48} />);
    // 48px, 3px stroke: a 45px side inset by half the stroke, starting in the middle of the top edge
    expect(frameOf(container).getAttribute('d')).toBe('M24 1.5H46.5V46.5H1.5V1.5Z');
    expect(snakeOf(container).getAttribute('d')).toBe(frameOf(container).getAttribute('d'));
  });

  it('lights three quarters of the frame and travels one whole frame per turn', () => {
    const { container } = render(<Spinner size={48} />);
    // 48px, 3px stroke: a 45px side, a 180px frame
    expect(snakeOf(container).style.strokeDasharray).toBe('135px 45px');
    const svg = container.querySelector('svg')!;
    expect(svg.style.getPropertyValue('--nc-spinner-travel')).toBe('-180px');
  });

  it('keeps a 2px stroke at small sizes and grows it with the size', () => {
    const at = (size: number) => {
      const { container, unmount } = render(<Spinner size={size} />);
      const w = frameOf(container).getAttribute('stroke-width');
      unmount();
      return w;
    };
    expect(at(12)).toBe('2');
    expect(at(16)).toBe('2');
    expect(at(48)).toBe('3');
    expect(at(64)).toBe('4');
  });

  it('inherits the colour, or takes the one it is given', () => {
    const { container } = render(<Spinner color="#E6E6E6" />);
    expect(container.querySelector<HTMLElement>('.nc-spinner')!.style.color).toBe('rgb(230, 230, 230)');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Spinner />);
    await expectNoAxeViolations(container);
  });
});

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Status, defineStates, STATE_SEVERITY } from './Status';
import { STATES } from '../../lib/StateGlyph';
import { expectNoAxeViolations } from '../../test/axe';

describe('Status', () => {
  it('renders the text with the state as data and class', () => {
    render(<Status state="information">on its way</Status>);
    const el = screen.getByText('on its way').closest('.nc-status')!;
    expect(el).toHaveAttribute('data-state', 'information');
    expect(el).toHaveClass('nc-status--information', 'nc-status--chip');
  });

  it('defaults to neutral, never to a colour that means something', () => {
    render(<Status>missing</Status>);
    expect(screen.getByText('missing').closest('.nc-status')).toHaveAttribute('data-state', 'neutral');
  });

  it('announces warnings and errors as such, and nothing for the calm states', () => {
    const { container, rerender } = render(<Status state="error">needs attention</Status>);
    expect(container.textContent).toBe('error: needs attention');
    rerender(<Status state="warning">connection firewalled</Status>);
    expect(container.textContent).toBe('warning: connection firewalled');
    rerender(<Status state="success">held</Status>);
    expect(container.textContent).toBe('held');
    rerender(<Status state="error" stateLabel={false}>failed</Status>);
    expect(container.textContent).toBe('failed');
    rerender(<Status state="error" stateLabel="fehler">failed</Status>);
    expect(container.textContent).toBe('fehler: failed');
  });

  it('gives every state its own glyph, hideable', () => {
    const shapes = new Set<string>();
    for (const s of STATES) {
      const { container, unmount } = render(<Status state={s}>x</Status>);
      const svg = container.querySelector('svg')!;
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      shapes.add(svg.innerHTML);
      unmount();
    }
    expect(shapes.size).toBe(STATES.length);
    const { container } = render(<Status icon={false}>x</Status>);
    expect(container.querySelector('svg')).toBeNull();
  });

  it('takes a StateSpec spread from defineStates', () => {
    const LINK = defineStates({
      open: { state: 'success', text: 'open' },
      firewalled: { state: 'warning', text: 'connection firewalled' },
    });
    expect(Object.isFrozen(LINK)).toBe(true);
    render(<Status {...LINK.firewalled} />);
    expect(screen.getByText('connection firewalled').closest('.nc-status')).toHaveAttribute('data-state', 'warning');
  });

  it('orders states by severity', () => {
    const sorted = [...STATES].sort((a, b) => STATE_SEVERITY[b] - STATE_SEVERITY[a]);
    expect(sorted).toEqual(['error', 'warning', 'information', 'neutral', 'success']);
  });

  it.each(STATES)('has no axe violations (%s, chip and text)', async (state) => {
    const { container } = render(
      <div>
        <Status state={state}>chip</Status>
        <Status state={state} appearance="text">
          text
        </Status>
      </div>,
    );
    await expectNoAxeViolations(container);
  });
});

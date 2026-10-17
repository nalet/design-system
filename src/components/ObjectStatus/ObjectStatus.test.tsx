import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ObjectStatus, defineStates, STATE_SEVERITY } from './ObjectStatus';
import { OBJECT_STATES } from '../../lib/StateGlyph';
import { expectNoAxeViolations } from '../../test/axe';

describe('ObjectStatus', () => {
  it('renders the text with the state as data and class', () => {
    render(<ObjectStatus state="information">on its way</ObjectStatus>);
    const el = screen.getByText('on its way').closest('.nc-status')!;
    expect(el).toHaveAttribute('data-state', 'information');
    expect(el).toHaveClass('nc-status--information', 'nc-status--chip');
  });

  it('defaults to neutral, never to a colour that means something', () => {
    render(<ObjectStatus>missing</ObjectStatus>);
    expect(screen.getByText('missing').closest('.nc-status')).toHaveAttribute('data-state', 'neutral');
  });

  it('announces warnings and errors as such, and nothing for the calm states', () => {
    const { container, rerender } = render(<ObjectStatus state="error">needs attention</ObjectStatus>);
    expect(container.textContent).toBe('error: needs attention');
    rerender(<ObjectStatus state="warning">connection firewalled</ObjectStatus>);
    expect(container.textContent).toBe('warning: connection firewalled');
    rerender(<ObjectStatus state="success">held</ObjectStatus>);
    expect(container.textContent).toBe('held');
    rerender(<ObjectStatus state="error" stateLabel={false}>failed</ObjectStatus>);
    expect(container.textContent).toBe('failed');
    rerender(<ObjectStatus state="error" stateLabel="fehler">failed</ObjectStatus>);
    expect(container.textContent).toBe('fehler: failed');
  });

  it('gives every state its own glyph, hideable', () => {
    const shapes = new Set<string>();
    for (const s of OBJECT_STATES) {
      const { container, unmount } = render(<ObjectStatus state={s}>x</ObjectStatus>);
      const svg = container.querySelector('svg')!;
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      shapes.add(svg.innerHTML);
      unmount();
    }
    expect(shapes.size).toBe(OBJECT_STATES.length);
    const { container } = render(<ObjectStatus icon={false}>x</ObjectStatus>);
    expect(container.querySelector('svg')).toBeNull();
  });

  it('takes a StateSpec spread from defineStates', () => {
    const LINK = defineStates({
      open: { state: 'success', text: 'open' },
      firewalled: { state: 'warning', text: 'connection firewalled' },
    });
    expect(Object.isFrozen(LINK)).toBe(true);
    render(<ObjectStatus {...LINK.firewalled} />);
    expect(screen.getByText('connection firewalled').closest('.nc-status')).toHaveAttribute('data-state', 'warning');
  });

  it('orders states by severity', () => {
    const sorted = [...OBJECT_STATES].sort((a, b) => STATE_SEVERITY[b] - STATE_SEVERITY[a]);
    expect(sorted).toEqual(['error', 'warning', 'information', 'neutral', 'success']);
  });

  it.each(OBJECT_STATES)('has no axe violations (%s, chip and text)', async (state) => {
    const { container } = render(
      <div>
        <ObjectStatus state={state}>chip</ObjectStatus>
        <ObjectStatus state={state} appearance="text">
          text
        </ObjectStatus>
      </div>,
    );
    await expectNoAxeViolations(container);
  });
});

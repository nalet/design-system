import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState, type Illustration } from './EmptyState';
import { Button } from '../Button/Button';
import { expectNoAxeViolations } from '../../test/axe';

const ALL: Illustration[] = ['empty', 'done', 'search', 'error', 'unknown'];

describe('EmptyState', () => {
  it('has a real heading, a description and the action; the picture is decoration', () => {
    const { container } = render(
      <EmptyState
        illustration="done"
        title="nothing missing"
        description="Every aired episode is in the library."
        actions={<Button>refresh</Button>}
        headingLevel={3}
      />,
    );
    expect(screen.getByRole('heading', { level: 3, name: 'nothing missing' })).toBeInTheDocument();
    expect(screen.getByText('Every aired episode is in the library.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'refresh' })).toBeInTheDocument();
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('draws a different picture for each kind', () => {
    const drawn = new Set<string>();
    for (const kind of ALL) {
      const { container, unmount } = render(<EmptyState illustration={kind} title={kind} />);
      drawn.add(container.querySelector('svg')!.innerHTML);
      unmount();
    }
    expect(drawn.size).toBe(ALL.length);
  });

  it.each(ALL)('has no axe violations (%s)', async (kind) => {
    const { container } = render(
      <EmptyState illustration={kind} title="title" description="Description" actions={<Button>act</Button>} />,
    );
    await expectNoAxeViolations(container);
  });
});

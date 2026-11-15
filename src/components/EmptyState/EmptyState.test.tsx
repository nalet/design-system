import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState, type Illustration } from './EmptyState';
import { Button } from '../Button/Button';
import { Language } from '../../lib/language';
import { expectNoAxeViolations } from '../../test/axe';

function Failed({ details, detailsLabel }: { details?: string; detailsLabel?: string }) {
  return (
    <EmptyState
      illustration="error"
      title="couldn't load the list"
      description="The server is busy."
      actions={<Button>try again</Button>}
      details={details}
      detailsLabel={detailsLabel}
    />
  );
}

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

  it('has no toggle when there are no details to show', () => {
    render(<Failed />);
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual(['try again']);
  });

  it('keeps its details closed until someone opens them, and says whether they are open', async () => {
    const user = userEvent.setup();
    render(<Failed details={'HTTP 503 Service Unavailable\nrequest id 7d1c0e4a'} />);
    const toggle = screen.getByRole('button', { name: 'details' });
    const block = document.getElementById(toggle.getAttribute('aria-controls')!)!;
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(block).not.toBeVisible();
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(block).toBeVisible();
    expect(block).toHaveTextContent('HTTP 503 Service Unavailable request id 7d1c0e4a');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(block).not.toBeVisible();
  });

  it('puts the way forward before the toggle in the tab order, and opens with the keyboard', async () => {
    const user = userEvent.setup();
    render(<Failed details="HTTP 503 Service Unavailable" />);
    await user.tab();
    expect(screen.getByRole('button', { name: 'try again' })).toHaveFocus();
    await user.tab();
    const toggle = screen.getByRole('button', { name: 'details' });
    expect(toggle).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('names the toggle from the page’s words; a label still wins', () => {
    const { rerender } = render(
      <Language words={{ emptyState: { details: 'the server’s answer' } }}>
        <Failed details="HTTP 503 Service Unavailable" />
      </Language>,
    );
    expect(screen.getByRole('button', { name: 'the server’s answer' })).toBeInTheDocument();
    rerender(
      <Language words={{ emptyState: { details: 'the server’s answer' } }}>
        <Failed details="HTTP 503 Service Unavailable" detailsLabel="request" />
      </Language>,
    );
    expect(screen.getByRole('button', { name: 'request' })).toBeInTheDocument();
  });

  it('has no axe violations with its details closed, and open', async () => {
    const user = userEvent.setup();
    const { container } = render(<Failed details="HTTP 503 Service Unavailable" />);
    await expectNoAxeViolations(container);
    await user.click(screen.getByRole('button', { name: 'details' }));
    await expectNoAxeViolations(container);
  });

  it.each(ALL)('has no axe violations (%s)', async (kind) => {
    const { container } = render(
      <EmptyState illustration={kind} title="title" description="Description" actions={<Button>act</Button>} />,
    );
    await expectNoAxeViolations(container);
  });
});

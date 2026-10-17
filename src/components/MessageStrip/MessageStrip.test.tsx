import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageStrip } from './MessageStrip';
import { Button } from '../Button/Button';
import { expectNoAxeViolations } from '../../test/axe';

describe('MessageStrip', () => {
  it('is a polite status for a warning, its text alone the live region', () => {
    render(
      <MessageStrip state="warning" actions={<Button size="sm" variant="ghost">show them</Button>}>
        105 titles can&apos;t be checked.
      </MessageStrip>,
    );
    const live = screen.getByRole('status');
    expect(live).toHaveTextContent("warning: 105 titles can't be checked.");
    expect(live).not.toHaveTextContent('show them');
  });

  it('is an alert for an error, and can be made static', () => {
    const { rerender } = render(<MessageStrip state="error">couldn&apos;t load the list.</MessageStrip>);
    expect(screen.getByRole('alert')).toHaveTextContent("error: couldn't load the list.");
    rerender(
      <MessageStrip state="error" live="off">
        couldn&apos;t load the list.
      </MessageStrip>,
    );
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('keeps technical detail behind a disclosure', async () => {
    const user = userEvent.setup();
    render(
      <MessageStrip state="warning" details="item 3f2a9c1e-0000-4000-8000-000000000001">
        the catalog holds them without an identity.
      </MessageStrip>,
    );
    const toggle = screen.getByRole('button', { name: 'details' });
    const panel = document.getElementById(toggle.getAttribute('aria-controls')!)!;
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(panel).not.toBeVisible();
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(panel).toBeVisible();
    expect(screen.getByRole('status')).not.toHaveTextContent('3f2a9c1e');
  });

  it('dismisses with a named button', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <MessageStrip state="success" onDismiss={onDismiss}>
        saved.
      </MessageStrip>,
    );
    await user.click(screen.getByRole('button', { name: 'dismiss' }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it.each(['neutral', 'information', 'success', 'warning', 'error'] as const)('has no axe violations (%s)', async (state) => {
    const { container } = render(
      <MessageStrip
        state={state}
        actions={<Button size="sm" variant="ghost">ask again</Button>}
        details="raw: http 503"
        defaultDetailsOpen
        onDismiss={() => undefined}
      >
        a message.
      </MessageStrip>,
    );
    await expectNoAxeViolations(container);
  });
});

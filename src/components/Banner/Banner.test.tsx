import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Banner } from './Banner';
import { Button } from '../Button/Button';
import { expectNoAxeViolations } from '../../test/axe';

describe('Banner', () => {
  it('is a polite status for a warning, its text alone the live region', () => {
    render(
      <Banner state="warning" actions={<Button size="sm" variant="ghost">show them</Button>}>
        105 titles can&apos;t be checked.
      </Banner>,
    );
    const live = screen.getByRole('status');
    expect(live).toHaveTextContent("warning: 105 titles can't be checked.");
    expect(live).not.toHaveTextContent('show them');
  });

  it('is an alert for an error, and can be made static', () => {
    const { rerender } = render(<Banner state="error">Couldn&apos;t load the list.</Banner>);
    expect(screen.getByRole('alert')).toHaveTextContent("error: Couldn't load the list.");
    rerender(
      <Banner state="error" live="off">
        Couldn&apos;t load the list.
      </Banner>,
    );
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('keeps technical detail behind a disclosure', async () => {
    const user = userEvent.setup();
    render(
      <Banner state="warning" details="item 3f2a9c1e-0000-4000-8000-000000000001">
        The catalog holds them without an identity.
      </Banner>,
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
      <Banner state="success" onDismiss={onDismiss}>
        Saved.
      </Banner>,
    );
    await user.click(screen.getByRole('button', { name: 'dismiss' }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it.each(['neutral', 'information', 'success', 'warning', 'error'] as const)('has no axe violations (%s)', async (state) => {
    const { container } = render(
      <Banner
        state={state}
        actions={<Button size="sm" variant="ghost">ask again</Button>}
        details="raw: http 503"
        defaultDetailsOpen
        onDismiss={() => undefined}
      >
        A message.
      </Banner>,
    );
    await expectNoAxeViolations(container);
  });
});

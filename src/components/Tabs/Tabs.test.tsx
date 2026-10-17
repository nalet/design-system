import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './Tabs';
import { expectNoAxeViolations } from '../../test/axe';

const ITEMS = [
  { value: 'requests', label: 'requests' },
  { value: 'missing', label: 'missing' },
  { value: 'downloads', label: 'downloads' },
];

describe('Tabs', () => {
  it('moves focus with the selection (arrows, home, end)', async () => {
    const user = userEvent.setup();
    render(<Tabs items={ITEMS} defaultValue="requests" />);
    await user.click(screen.getByRole('tab', { name: 'requests' }));
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'missing' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'missing' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'downloads' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'requests' })).toHaveFocus();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Tabs items={ITEMS} defaultValue="missing" />);
    await expectNoAxeViolations(container);
  });
});

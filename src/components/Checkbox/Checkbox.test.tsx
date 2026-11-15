import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';
import { expectNoAxeViolations } from '../../test/axe';

describe('Checkbox', () => {
  it('is ticked by a press on its label, and shows the mixed state', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Checkbox label="Include archived" />);
    const box = screen.getByRole('checkbox', { name: 'Include archived' }) as HTMLInputElement;
    await user.click(screen.getByText('Include archived'));
    expect(box).toBeChecked();
    rerender(<Checkbox label="Include archived" indeterminate />);
    expect(box.indeterminate).toBe(true);
  });

  it('marks a checkbox that has its label: the row is the target a touch screen and a tv size', () => {
    const { container, rerender } = render(<Checkbox label="Include archived" />);
    expect(container.querySelector('.nc-checkbox')).toHaveClass('nc-checkbox--labelled');
    rerender(<Checkbox aria-label="select storage-01" />);
    expect(container.querySelector('.nc-checkbox')).not.toHaveClass('nc-checkbox--labelled');
  });

  it('has no axe violations in any state', async () => {
    const { container } = render(
      <>
        <Checkbox label="Databases" defaultChecked />
        <Checkbox label="Volumes" indeterminate />
        <Checkbox label="Logs" disabled />
        <Checkbox aria-label="select storage-01" />
      </>,
    );
    await expectNoAxeViolations(container);
  });
});

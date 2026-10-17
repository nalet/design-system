import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Field } from './Field';
import { Input } from '../Input/Input';
import { expectNoAxeViolations } from '../../test/axe';

describe('Field', () => {
  it('marks the control invalid on an error, and keeps an invalid control invalid without one', () => {
    const { rerender } = render(
      <Field label="storage floor" error="must be a number">
        <Input />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'storage floor' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('must be a number');
    rerender(
      <Field label="storage floor">
        <Input invalid />
      </Field>,
    );
    expect(screen.getByRole('textbox', { name: 'storage floor' })).toHaveAttribute('aria-invalid', 'true');
    rerender(
      <Field label="storage floor" hint="in gb">
        <Input />
      </Field>,
    );
    expect(screen.getByRole('textbox', { name: 'storage floor' })).not.toHaveAttribute('aria-invalid');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Field label="storage floor" error="must be a number" required>
        <Input />
      </Field>,
    );
    await expectNoAxeViolations(container);
  });
});

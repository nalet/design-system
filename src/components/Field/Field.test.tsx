import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Field } from './Field';
import { Input } from '../Input/Input';
import { expectNoAxeViolations } from '../../test/axe';

describe('Field', () => {
  it('marks the control invalid on an error, and keeps an invalid control invalid without one', () => {
    const { rerender } = render(
      <Field label="Storage floor" error="Must be a number">
        <Input />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Storage floor' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Must be a number');
    rerender(
      <Field label="Storage floor">
        <Input invalid />
      </Field>,
    );
    expect(screen.getByRole('textbox', { name: 'Storage floor' })).toHaveAttribute('aria-invalid', 'true');
    rerender(
      <Field label="Storage floor" hint="In GB">
        <Input />
      </Field>,
    );
    expect(screen.getByRole('textbox', { name: 'Storage floor' })).not.toHaveAttribute('aria-invalid');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Field label="Storage floor" error="Must be a number" required>
        <Input />
      </Field>,
    );
    await expectNoAxeViolations(container);
  });
});

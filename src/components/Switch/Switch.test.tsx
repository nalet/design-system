import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './Switch';
import { expectNoAxeViolations } from '../../test/axe';

describe('Switch', () => {
  it('is a switch that the label and space flip', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="Email alerts" onChange={onChange} />);
    const input = screen.getByRole('switch', { name: 'Email alerts' });
    expect(input).not.toBeChecked();
    await user.click(screen.getByText('Email alerts'));
    expect(input).toBeChecked();
    input.focus();
    await user.keyboard(' ');
    expect(input).not.toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('comes in three sizes, medium unless it is told another', () => {
    const { container, rerender } = render(<Switch label="Email alerts" />);
    const root = () => container.querySelector('.nc-switch')!;
    expect(root()).toHaveClass('nc-switch--md');
    rerender(<Switch label="Email alerts" size="sm" />);
    expect(root()).toHaveClass('nc-switch--sm');
    rerender(<Switch label="Email alerts" size="lg" />);
    expect(root()).toHaveClass('nc-switch--lg');
    expect(root()).not.toHaveClass('nc-switch--md');
  });

  it('marks a switch that has its label: the row is the target a touch screen and a tv size', () => {
    const { container, rerender } = render(<Switch label="Email alerts" />);
    expect(container.querySelector('.nc-switch')).toHaveClass('nc-switch--labelled');
    rerender(<Switch aria-label="Email alerts" />);
    expect(container.querySelector('.nc-switch')).not.toHaveClass('nc-switch--labelled');
  });

  it('has no axe violations in any size or state', async () => {
    const { container } = render(
      <>
        <Switch label="Email alerts" size="sm" />
        <Switch label="Automatic updates" defaultChecked />
        <Switch label="Weekly summary" size="lg" defaultChecked />
        <Switch label="Debug logging" size="lg" disabled />
        <Switch aria-label="Maintenance mode" size="lg" />
      </>,
    );
    await expectNoAxeViolations(container);
  });
});

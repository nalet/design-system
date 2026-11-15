import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Avatar, initialsOf } from './Avatar';
import { expectNoAxeViolations } from '../../test/axe';

describe('Avatar', () => {
  it('makes the initials from the first and the last word of the name, in lowercase', () => {
    expect(initialsOf('Ada Urban')).toBe('au');
    expect(initialsOf('  Ada   Maria  Urban ')).toBe('au');
    expect(initialsOf('Ada')).toBe('a');
    expect(initialsOf('Émile Zola')).toBe('éz');
    expect(initialsOf('')).toBe('');
  });

  it('is a picture named after the person, showing their initials', () => {
    render(<Avatar name="Ada Urban" />);
    const avatar = screen.getByRole('img', { name: 'Ada Urban' });
    expect(avatar).toHaveTextContent('au');
    expect(avatar).toHaveClass('nc-avatar--md');
  });

  it('takes initials of its own, and writes them in lowercase', () => {
    render(<Avatar name="Ada Urban" initials="AdU" size="lg" />);
    const avatar = screen.getByRole('img', { name: 'Ada Urban' });
    expect(avatar).toHaveTextContent('adu');
    expect(avatar).toHaveClass('nc-avatar--lg');
  });

  it('shows the picture in place of the initials, and the initials when it cannot be loaded', () => {
    const { container } = render(<Avatar name="Ada Urban" src="/people/ada.jpg" size="sm" />);
    const picture = container.querySelector('img')!;
    expect(picture).toHaveAttribute('src', '/people/ada.jpg');
    expect(picture).toHaveAttribute('alt', '');
    expect(screen.getByRole('img', { name: 'Ada Urban' })).not.toHaveTextContent('au');
    fireEvent.error(picture);
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByRole('img', { name: 'Ada Urban' })).toHaveTextContent('au');
  });

  it('is hidden from assistive technology when it is decoration', () => {
    const { container } = render(<Avatar name="Ada Urban" decorative />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('has no axe violations: initials, a picture, decoration', async () => {
    const { container } = render(
      <>
        <Avatar name="Ada Urban" />
        <Avatar name="Ada Urban" src="/people/ada.jpg" />
        <Avatar name="Ada Urban" decorative />
      </>,
    );
    await expectNoAxeViolations(container);
  });
});

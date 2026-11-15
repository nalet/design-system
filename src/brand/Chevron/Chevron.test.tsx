import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Chevron } from './Chevron';
import { Language } from '../../lib/language';
import { expectNoAxeViolations } from '../../test/axe';

describe('Chevron', () => {
  it('is a picture named "chevron" in English, as before, and decoration where it is hidden', () => {
    const { container, rerender } = render(<Chevron />);
    expect(screen.getByRole('img', { name: 'chevron' })).toBeInTheDocument();
    rerender(<Chevron aria-hidden />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('takes its name from the words of the page’s language, and a name of its own before that', () => {
    const { rerender } = render(
      <Language lang="de">
        <Chevron />
      </Language>,
    );
    // German calls the glyph by the same word.
    expect(screen.getByRole('img', { name: 'chevron' })).toBeInTheDocument();
    rerender(
      <Language lang="de" words={{ chevron: { name: 'winkel' } }}>
        <Chevron />
      </Language>,
    );
    expect(screen.getByRole('img', { name: 'winkel' })).toBeInTheDocument();
    rerender(
      <Language lang="de">
        <Chevron aria-label="weiter" />
      </Language>,
    );
    expect(screen.getByRole('img', { name: 'weiter' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Chevron />);
    await expectNoAxeViolations(container);
  });
});

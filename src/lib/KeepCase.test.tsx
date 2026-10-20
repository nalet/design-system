import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KeepCase } from './KeepCase';
import { Button } from '../components/Button/Button';
import { expectNoAxeViolations } from '../test/axe';

describe('KeepCase', () => {
  it('marks a name inside a lowercased label, and the label still reads as written', () => {
    render(
      <Button>
        find <KeepCase>German</KeepCase> for 4 selected
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'find German for 4 selected' });
    const name = button.querySelector('.nc-keep-case');
    expect(name?.tagName).toBe('SPAN');
    expect(name).toHaveTextContent('German');
  });

  it('passes its class and attributes through', () => {
    render(
      <KeepCase className="extra" lang="de" data-testid="name">
        Deutsch
      </KeepCase>,
    );
    const name = screen.getByTestId('name');
    expect(name).toHaveClass('nc-keep-case', 'extra');
    expect(name).toHaveAttribute('lang', 'de');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Button>
        open <KeepCase>The Quiet Orchard</KeepCase>
      </Button>,
    );
    await expectNoAxeViolations(container);
  });
});

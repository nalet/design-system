import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Portal } from './Portal';
import { Tile } from '../Tile/Tile';
import { TileGroup } from '../TileGroup/TileGroup';
import { Language } from '../../lib/language';
import { expectNoAxeViolations } from '../../test/axe';

function Launcher(props: Partial<React.ComponentProps<typeof Portal>>) {
  return (
    <Portal title="home" {...props}>
      <TileGroup legend="operate">
        <Tile title="metrics" description="Dashboards and alerts" href="#metrics" />
        <Tile title="logs" description="Live tail" href="#logs" />
      </TileGroup>
      <TileGroup legend="store">
        <Tile title="backups" description="Nightly runs" href="#backups" />
      </TileGroup>
    </Portal>
  );
}

const announced = (container: HTMLElement) => container.querySelector('.nc-portal__sr')!.textContent;

describe('Portal', () => {
  it('narrows the tiles to what the search matches, and hides a group left empty', async () => {
    const user = userEvent.setup();
    const { container } = render(<Launcher />);
    expect(screen.getAllByRole('link')).toHaveLength(3);
    await user.type(screen.getByRole('textbox', { name: 'search apps' }), 'back');
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('link', { name: /backups/ })).toBeVisible();
    expect(container.querySelector('a[href="#metrics"]')).not.toBeVisible();
    expect(screen.queryByRole('region', { name: 'operate' })).toBeNull();
    expect(screen.getByRole('region', { name: 'store' })).toBeVisible();
  });

  it('reads as before in English: the search’s name and placeholder, the count, and the sentence for no match', async () => {
    const user = userEvent.setup();
    const { container } = render(<Launcher />);
    expect(screen.getByRole('search', { name: 'search apps' })).toBeInTheDocument();
    const field = screen.getByRole('textbox', { name: 'search apps' });
    expect(field).toHaveAttribute('placeholder', 'search apps…');
    expect(announced(container)).toBe('');
    await user.type(field, 's');
    expect(announced(container)).toBe('3 apps match');
    await user.type(field, 't');
    expect(announced(container)).toBe('0 apps match');
    expect(container.querySelector('.nc-portal__empty')!.textContent).toBe('No apps match “st”.');
    await user.clear(field);
    await user.type(field, 'back');
    expect(announced(container)).toBe('1 app match');
  });

  it('reads in German inside a German part of the page, and a prop still wins', async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(
      <Language lang="de">
        <Launcher />
      </Language>,
    );
    expect(screen.getByRole('search', { name: 'apps suchen' })).toBeInTheDocument();
    const field = screen.getByRole('textbox', { name: 'apps suchen' });
    expect(field).toHaveAttribute('placeholder', 'apps suchen…');
    await user.type(field, 's');
    expect(announced(container)).toBe('3 apps gefunden');
    await user.type(field, 't');
    expect(announced(container)).toBe('0 apps gefunden');
    expect(container.querySelector('.nc-portal__empty')!.textContent).toBe('Keine App passt zu „st“.');
    await user.clear(field);
    await user.type(field, 'back');
    expect(announced(container)).toBe('1 app gefunden');
    rerender(
      <Language lang="de">
        <Launcher searchLabel="dienste suchen" searchPlaceholder="dienst suchen…" />
      </Language>,
    );
    expect(screen.getByRole('textbox', { name: 'dienste suchen' })).toHaveAttribute('placeholder', 'dienst suchen…');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Launcher />);
    await expectNoAxeViolations(container);
  });
});

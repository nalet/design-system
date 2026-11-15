import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tile } from './Tile';
import { Language } from '../../lib/language';
import { expectNoAxeViolations } from '../../test/axe';

const badgeOf = (container: HTMLElement) => container.querySelector('.nc-tile__badge')!;
const valueOf = (container: HTMLElement) => container.querySelector('.nc-tile__value')!;
const deltaOf = (container: HTMLElement) => container.querySelector('.nc-tile__delta')!;

describe('Tile', () => {
  it('is a link with an address, a button with a press, and a plain panel with neither', () => {
    const { rerender } = render(<Tile title="metrics" description="3 alerts open" href="/metrics" />);
    expect(screen.getByRole('link', { name: /metrics/ })).toHaveAttribute('href', '/metrics');
    rerender(<Tile title="metrics" onClick={() => undefined} />);
    expect(screen.getByRole('button', { name: /metrics/ })).toBeInTheDocument();
    rerender(<Tile title="metrics" />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('reads as before in English: the status in words, and its numbers the English way', () => {
    const { container, rerender } = render(<Tile title="metrics" href="#" status="degraded" badge={2500} />);
    expect(screen.getByRole('img', { name: 'status: degraded' })).toBeInTheDocument();
    expect(badgeOf(container)).toHaveTextContent(/^2,500$/);
    for (const status of ['online', 'offline', 'unknown'] as const) {
      rerender(<Tile title="metrics" href="#" status={status} badge={3} />);
      expect(screen.getByRole('img', { name: `status: ${status}` })).toBeInTheDocument();
    }
    expect(badgeOf(container)).toHaveTextContent(/^3$/);
    rerender(<Tile variant="kpi" title="requests" value={1250} unit="/s" delta={{ value: 12.4, direction: 'up' }} />);
    expect(valueOf(container)).toHaveTextContent(/^1,250\/s$/);
    expect(deltaOf(container)).toHaveTextContent(/^12\.4$/);
  });

  it('reads in German inside a German part of the page; a text it is given stays as it is', () => {
    const page = (tile: React.ReactNode) => <Language lang="de">{tile}</Language>;
    const { container, rerender } = render(page(<Tile title="metriken" href="#" status="degraded" badge={2500} />));
    expect(screen.getByRole('img', { name: 'status: beeinträchtigt' })).toBeInTheDocument();
    expect(badgeOf(container)).toHaveTextContent(/^2\.500$/);
    rerender(page(<Tile title="metriken" href="#" status="unknown" badge="neu" />));
    expect(screen.getByRole('img', { name: 'status: unbekannt' })).toBeInTheDocument();
    expect(badgeOf(container)).toHaveTextContent(/^neu$/);
    rerender(page(<Tile variant="kpi" title="anfragen" value={1250} unit="/s" delta={{ value: 12.4, direction: 'up' }} />));
    expect(valueOf(container)).toHaveTextContent(/^1\.250\/s$/);
    expect(deltaOf(container)).toHaveTextContent(/^12,4$/);
    rerender(page(<Tile variant="kpi" title="speicher" value="1.8" unit="tb" delta={{ value: '+0.2', direction: 'up' }} />));
    expect(valueOf(container)).toHaveTextContent(/^1\.8tb$/);
    expect(deltaOf(container)).toHaveTextContent(/^\+0\.2$/);
  });

  it('has no axe violations: an app tile with a badge and a status, and a number tile', async () => {
    const { container } = render(
      <div>
        <Tile title="metrics" description="3 alerts open" href="#" badge={3} badgeTone="warning" status="online" />
        <Tile variant="kpi" title="cpu" value={62} unit="%" delta={{ value: '+4', direction: 'up', tone: 'negative' }} />
      </div>,
    );
    await expectNoAxeViolations(container);
  });
});

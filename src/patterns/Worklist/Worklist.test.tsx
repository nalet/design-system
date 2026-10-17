import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { Worklist } from './Worklist';
import { MessageStrip } from '../../components/MessageStrip/MessageStrip';
import { FilterBar } from '../../components/FilterBar/FilterBar';
import { SelectionToolbar } from '../../components/Toolbar/Toolbar';
import { IllustratedMessage } from '../../components/IllustratedMessage/IllustratedMessage';
import { Button } from '../../components/Button/Button';
import { expectNoAxeViolations } from '../../test/axe';

function Harness() {
  const [tab, setTab] = React.useState('all');
  const [q, setQ] = React.useState('');
  return (
    <Worklist
      title="missing"
      subtitle="Aired, monitored and not in the library"
      headingLevel={2}
      tabs={[
        { id: 'all', label: 'missing', count: 0 },
        { id: 'attention', label: 'needs attention', count: 0, state: 'error' },
      ]}
      activeTab={tab}
      onTabChange={setTab}
      tabsLabel="filter missing by state"
      messages={
        <MessageStrip state="warning" actions={<Button size="sm" variant="ghost">show them</Button>}>
          105 titles can&apos;t be checked.
        </MessageStrip>
      }
      filterBar={<FilterBar search={{ value: q, onChange: setQ, label: 'search titles' }} />}
      toolbar={<SelectionToolbar label="missing episodes" selectedCount={0} heading="0 missing" />}
    >
      <IllustratedMessage illustration="done" title="nothing missing" headingLevel={3} />
    </Worklist>
  );
}

describe('Worklist', () => {
  it('is a section named by its title; tabs control the panel labelled by the active tab', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(screen.getByRole('region', { name: 'missing' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'missing' })).toBeInTheDocument();
    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAccessibleName('missing 0');
    await user.click(screen.getByRole('tab', { name: /needs attention/ }));
    expect(screen.getByRole('tabpanel')).toHaveAccessibleName('needs attention 0');
    expect(screen.getByRole('tab', { name: /needs attention/ })).toHaveAttribute('aria-controls', panel.id);
  });

  it('has no axe violations as a whole page', async () => {
    const { container } = render(<Harness />);
    await expectNoAxeViolations(container);
  });
});

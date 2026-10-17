import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { Modal } from './Modal';
import { ActionMenu } from '../ActionMenu/ActionMenu';
import { expectNoAxeViolations } from '../../test/axe';

function Harness({ onClose }: { onClose: () => void }) {
  const [, setTick] = React.useState(0);
  return (
    <Modal open title="releases" onClose={() => onClose()}>
      <button type="button">first</button>
      <button type="button" onClick={() => setTick((t) => t + 1)}>
        re-render the parent
      </button>
      <ActionMenu label="actions for the release" items={[{ id: 'a', label: 'grab', onSelect: () => undefined }]} />
    </Modal>
  );
}

describe('Modal', () => {
  it('keeps focus where it is when the parent re-renders with a new onClose', async () => {
    const user = userEvent.setup();
    render(<Harness onClose={vi.fn()} />);
    const rerender = screen.getByRole('button', { name: 're-render the parent' });
    await user.click(rerender);
    await user.click(rerender);
    expect(rerender).toHaveFocus();
  });

  it('lets a menu inside it take esc first; the next esc closes the dialog', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'actions for the release' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(onClose).not.toHaveBeenCalled();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('has no axe violations', async () => {
    render(<Harness onClose={vi.fn()} />);
    await expectNoAxeViolations(document.body);
  });
});

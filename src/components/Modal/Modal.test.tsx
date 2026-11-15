import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { Modal, type ModalProps } from './Modal';
import { ActionMenu } from '../ActionMenu/ActionMenu';
import { Language } from '../../lib/language';
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

  it('names its close button in the page’s language', () => {
    render(
      <Language lang="de">
        <Modal open title="volume löschen" onClose={() => undefined} />
      </Language>,
    );
    expect(screen.getByRole('button', { name: 'schließen' })).toBeInTheDocument();
  });

  it('carries the kind of screen of what opened it, though it is rendered into the body', async () => {
    function Opener() {
      const [open, setOpen] = React.useState(false);
      return (
        <div data-nc-screen="touch">
          <button onClick={() => setOpen(true)}>open</button>
          <Modal open={open} onClose={() => setOpen(false)} title="add to lists">
            <p>Pick the lists.</p>
          </Modal>
        </div>
      );
    }
    render(<Opener />);
    await userEvent.click(screen.getByRole('button', { name: 'open' }));
    const layer = screen.getByRole('dialog').closest('.nc-modal');
    expect(layer).toHaveAttribute('data-nc-screen', 'touch');
    expect(layer?.parentElement).toBe(document.body);
  });

  it('carries no kind of screen where the page names none', async () => {
    function Opener() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>open</button>
          <Modal open={open} onClose={() => setOpen(false)} title="add to lists">
            <p>Pick the lists.</p>
          </Modal>
        </>
      );
    }
    render(<Opener />);
    await userEvent.click(screen.getByRole('button', { name: 'open' }));
    expect(screen.getByRole('dialog').closest('.nc-modal')).not.toHaveAttribute('data-nc-screen');
  });

  it('has no axe violations', async () => {
    render(<Harness onClose={vi.fn()} />);
    await expectNoAxeViolations(document.body);
  });
});

// ---- a sheet ------------------------------------------------------------------------

// jsdom lays nothing out: the window's width is what the test says it is, and
// the observer fires when the test resizes it.
let windowWidth = 1280;
const observers = new Set<FakeResizeObserver>();

class FakeResizeObserver {
  constructor(private readonly onResize: () => void) {}
  observe() {
    observers.add(this);
  }
  unobserve() {
    observers.delete(this);
  }
  disconnect() {
    observers.delete(this);
  }
  fire() {
    this.onResize();
  }
}

function measurable(width: number) {
  windowWidth = width;
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    () => ({ width: windowWidth, height: 800, top: 0, left: 0, right: windowWidth, bottom: 800, x: 0, y: 0 }) as DOMRect,
  );
}

function resizeTo(width: number) {
  windowWidth = width;
  act(() => {
    for (const o of observers) o.fire();
  });
}

function Choices(props: Partial<ModalProps>) {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        add to a list
      </button>
      <Modal
        open={open}
        onClose={close}
        title="add to a list"
        sheet
        footer={
          <button type="button" onClick={close}>
            cancel
          </button>
        }
        {...props}
      >
        <label>
          <input type="checkbox" /> Watchlist
        </label>
      </Modal>
    </>
  );
}

const layer = () => document.querySelector('.nc-modal')!;

describe('Modal, as a sheet', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    observers.clear();
    document.documentElement.style.fontSize = '';
  });

  it('sits on the foot of a window narrower than its width and its two margins', () => {
    measurable(511);
    render(<Choices open />);
    expect(layer()).toHaveClass('nc-modal--sheet');
    // across the whole width: the largest width is the dialog's in the middle only.
    expect(screen.getByRole('dialog').style.maxWidth).toBe('');
  });

  it('sits in the middle of a window that has the room, and follows the window', () => {
    measurable(512);
    render(<Choices open />);
    expect(layer()).not.toHaveClass('nc-modal--sheet');
    expect(screen.getByRole('dialog').style.maxWidth).toBe('30rem');
    resizeTo(390);
    expect(layer()).toHaveClass('nc-modal--sheet');
    resizeTo(1280);
    expect(layer()).not.toHaveClass('nc-modal--sheet');
  });

  it('goes by its own width', () => {
    measurable(391);
    render(<Choices open width={360} />);
    expect(layer()).toHaveClass('nc-modal--sheet');
    resizeTo(392);
    expect(layer()).not.toHaveClass('nc-modal--sheet');
  });

  it('goes by the reader’s text size: at twice the size, the same window holds half', () => {
    document.documentElement.style.fontSize = '32px';
    measurable(1000);
    render(<Choices open />);
    expect(layer()).toHaveClass('nc-modal--sheet');
    resizeTo(1024);
    expect(layer()).not.toHaveClass('nc-modal--sheet');
  });

  it('stays in the middle on every screen unless it asks for a sheet', () => {
    measurable(320);
    render(<Choices open sheet={false} />);
    expect(layer()).not.toHaveClass('nc-modal--sheet');
    expect(observers.size).toBe(0);
  });

  it('stays in the middle where nothing can be measured', () => {
    render(<Choices open />);
    expect(layer()).not.toHaveClass('nc-modal--sheet');
  });

  it('is the same dialog: its header, its body and its footer, with the same ways out', async () => {
    measurable(390);
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Choices open onClose={onClose} />);
    const dialog = screen.getByRole('dialog', { name: 'add to a list' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog.querySelector('.nc-modal__header')).not.toBeNull();
    expect(dialog.querySelector('.nc-modal__body')).not.toBeNull();
    expect(dialog.querySelector('.nc-modal__footer')).not.toBeNull();
    await user.click(screen.getByRole('button', { name: 'close' }));
    await user.keyboard('{Escape}');
    await user.click(document.querySelector('.nc-modal__backdrop')!);
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('takes the focus, keeps it, and gives it back to what opened it', async () => {
    measurable(390);
    const user = userEvent.setup();
    render(<Choices />);
    const opener = screen.getByRole('button', { name: 'add to a list' });
    await user.click(opener);
    expect(layer()).toHaveClass('nc-modal--sheet');
    const close = screen.getByRole('button', { name: 'close' });
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'cancel' })).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(opener).toHaveFocus();
  });

  it('has no axe violations', async () => {
    measurable(390);
    render(<Choices open />);
    expect(layer()).toHaveClass('nc-modal--sheet');
    await expectNoAxeViolations(document.body);
  });
});

// ---- on a tv --------------------------------------------------------------------------

function TvDialog({ onClose = () => undefined }: { onClose?: () => void }) {
  return (
    <Modal
      open
      title="add server"
      onClose={onClose}
      footer={
        <>
          <button type="button">cancel</button>
          <button type="button" disabled>
            not yet
          </button>
          <button type="button">add server</button>
        </>
      }
    >
      <input aria-label="Name" defaultValue="worker-2" />
      <div hidden>
        <button type="button">out of sight</button>
      </div>
    </Modal>
  );
}

describe('Modal, on a tv', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-nc-screen');
  });

  it('moves through its controls with the arrows, and stops at the first and the last', async () => {
    document.documentElement.setAttribute('data-nc-screen', 'tv');
    const user = userEvent.setup();
    render(<TvDialog />);
    const close = screen.getByRole('button', { name: 'close' });
    const name = screen.getByRole('textbox', { name: 'Name' });
    const cancel = screen.getByRole('button', { name: 'cancel' });
    const add = screen.getByRole('button', { name: 'add server' });
    expect(close).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(close).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(name).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(cancel).toHaveFocus();
    // past the disabled button, and never onto what is hidden.
    await user.keyboard('{ArrowRight}');
    expect(add).toHaveFocus();
    await user.keyboard('{ArrowRight}{ArrowDown}');
    expect(add).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(cancel).toHaveFocus();
    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(close).toHaveFocus();
  });

  it('leaves left and right to a field, and a key to the control that took it', async () => {
    document.documentElement.setAttribute('data-nc-screen', 'tv');
    const user = userEvent.setup();
    render(
      <Modal open title="add server" onClose={() => undefined}>
        <input aria-label="Name" defaultValue="worker-2" />
        <button type="button" onKeyDown={(e) => e.key === 'ArrowDown' && e.preventDefault()}>
          opens a list
        </button>
        <button type="button">last</button>
      </Modal>,
    );
    const name = screen.getByRole('textbox', { name: 'Name' });
    const list = screen.getByRole('button', { name: 'opens a list' });
    name.focus();
    await user.keyboard('{ArrowLeft}{ArrowRight}');
    expect(name).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(list).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(list).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'last' })).toHaveFocus();
  });

  it('moves from the dialog itself to its first control, or its last', async () => {
    document.documentElement.setAttribute('data-nc-screen', 'tv');
    const user = userEvent.setup();
    render(<TvDialog />);
    const dialog = screen.getByRole('dialog');
    dialog.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'close' })).toHaveFocus();
    dialog.focus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('button', { name: 'add server' })).toHaveFocus();
  });

  it('leaves the arrows alone on every other screen', async () => {
    const user = userEvent.setup();
    render(<TvDialog />);
    const close = screen.getByRole('button', { name: 'close' });
    await user.keyboard('{ArrowDown}{ArrowRight}');
    expect(close).toHaveFocus();
    document.documentElement.setAttribute('data-nc-screen', 'touch');
    await user.keyboard('{ArrowDown}{ArrowRight}');
    expect(close).toHaveFocus();
  });
});

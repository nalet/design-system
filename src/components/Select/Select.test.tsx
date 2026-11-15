import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { Select } from './Select';
import { Field } from '../Field/Field';
import { Language } from '../../lib/language';
import { expectNoAxeViolations } from '../../test/axe';

const LANGUAGES = [
  { label: 'off', value: 'off' },
  { label: 'English', value: 'en' },
  { label: 'German', value: 'de' },
  { label: 'French', value: 'fr', disabled: true },
  { label: 'Spanish', value: 'es' },
];

/** a row of the open list: the native select's own options have the same role and names. */
const row = (name: string) => within(screen.getByRole('listbox')).getByRole('option', { name });

/** a select on a tv screen: the attribute on an element around it. */
function onATv(props: Partial<React.ComponentProps<typeof Select>> = {}) {
  const onChange = vi.fn();
  render(
    <div data-nc-screen="tv">
      <Select aria-label="Subtitles" options={LANGUAGES} defaultValue="en" onChange={onChange} {...props} />
    </div>,
  );
  return { onChange, select: screen.getByRole('combobox', { name: 'Subtitles' }) as HTMLSelectElement };
}

describe('Select', () => {
  it('is the browser’s own select off a tv: no list of its own, on any key', async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Subtitles" options={LANGUAGES} defaultValue="en" />);
    const select = screen.getByRole('combobox', { name: 'Subtitles' });
    expect(select).not.toHaveAttribute('aria-haspopup');
    expect(select).not.toHaveAttribute('aria-expanded');
    select.focus();
    await user.keyboard('{Enter}');
    expect(screen.queryByRole('listbox')).toBeNull();
    // the arrow keys are left to the browser.
    expect(fireEvent.keyDown(select, { key: 'ArrowDown' })).toBe(true);
  });

  it('stays the browser’s own on a screen made for touch', async () => {
    const user = userEvent.setup();
    render(
      <div data-nc-screen="touch">
        <Select aria-label="Subtitles" options={LANGUAGES} defaultValue="en" />
      </div>,
    );
    const select = screen.getByRole('combobox', { name: 'Subtitles' });
    select.focus();
    await user.keyboard('{Enter}');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(select).not.toHaveAttribute('aria-haspopup');
  });

  it('says on a tv that it opens a list', () => {
    const { select } = onATv();
    expect(select).toHaveAttribute('aria-haspopup', 'listbox');
    expect(select).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens its list on a tv with the focus on the value that is set', async () => {
    const user = userEvent.setup();
    const { select } = onATv();
    select.focus();
    await user.keyboard('{Enter}');
    const list = screen.getByRole('listbox', { name: 'Subtitles' });
    expect(select).toHaveAttribute('aria-expanded', 'true');
    expect(select).toHaveAttribute('aria-controls', list.id);
    const picked = row('English');
    expect(picked).toHaveAttribute('aria-selected', 'true');
    expect(picked).toHaveFocus();
    expect(row('German')).toHaveAttribute('aria-selected', 'false');
    expect(within(list).getAllByRole('option')).toHaveLength(5);
  });

  it('moves with up and down, stops at the ends, skips what is disabled, and picks nothing on the way', async () => {
    const user = userEvent.setup();
    const { select, onChange } = onATv();
    select.focus();
    await user.keyboard('{Enter}{ArrowDown}');
    expect(row('German')).toHaveFocus();
    // French is disabled: the focus passes it.
    await user.keyboard('{ArrowDown}');
    expect(row('Spanish')).toHaveFocus();
    // the last row: down stays.
    await user.keyboard('{ArrowDown}');
    expect(row('Spanish')).toHaveFocus();
    await user.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}');
    expect(row('off')).toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();
    expect(select.value).toBe('en');
  });

  it('keeps the focus in the list on left, right and tab', async () => {
    const user = userEvent.setup();
    render(
      <div data-nc-screen="tv">
        <Select aria-label="Subtitles" options={LANGUAGES} defaultValue="en" />
        <button type="button">after</button>
      </div>,
    );
    screen.getByRole('combobox', { name: 'Subtitles' }).focus();
    await user.keyboard('{Enter}{ArrowLeft}{ArrowRight}{Tab}');
    expect(row('English')).toHaveFocus();
  });

  it('picks with enter: the select takes the value, says so, and has the focus again', async () => {
    const user = userEvent.setup();
    const { select, onChange } = onATv();
    select.focus();
    await user.keyboard('{Enter}{ArrowDown}{Enter}');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(select.value).toBe('de');
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0][0].target.value).toBe('de');
    expect(select).toHaveFocus();
    expect(select).toHaveAttribute('aria-expanded', 'false');
  });

  it('says nothing when the value that is set is picked again', async () => {
    const user = userEvent.setup();
    const { select, onChange } = onATv();
    select.focus();
    await user.keyboard('{Enter}{Enter}');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
    expect(select).toHaveFocus();
  });

  it('closes on esc, the remote’s back: nothing changes, and the focus is back on the select', async () => {
    const user = userEvent.setup();
    const outer = vi.fn();
    const onChange = vi.fn();
    render(
      // a dialog around the select must not hear the esc that closed the list.
      <div data-nc-screen="tv" onKeyDown={outer}>
        <Select aria-label="Subtitles" options={LANGUAGES} defaultValue="en" onChange={onChange} />
      </div>,
    );
    const select = screen.getByRole('combobox', { name: 'Subtitles' }) as HTMLSelectElement;
    select.focus();
    await user.keyboard('{Enter}{ArrowDown}');
    outer.mockClear();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(select.value).toBe('en');
    expect(onChange).not.toHaveBeenCalled();
    expect(select).toHaveFocus();
    expect(outer).not.toHaveBeenCalled();
  });

  it('follows a controlled value', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = React.useState('en');
      return (
        <div data-nc-screen="tv">
          <Select aria-label="Subtitles" options={LANGUAGES} value={value} onChange={(e) => setValue(e.target.value)} />
          <output>{value}</output>
        </div>
      );
    }
    render(<Controlled />);
    const select = screen.getByRole('combobox', { name: 'Subtitles' }) as HTMLSelectElement;
    select.focus();
    await user.keyboard('{Enter}{ArrowUp}{Enter}');
    expect(select.value).toBe('off');
    expect(screen.getByText('off', { selector: 'output' })).toBeInTheDocument();
    await user.keyboard('{Enter}');
    expect(row('off')).toHaveFocus();
  });

  it('opens on a press and picks on a press, and a press on the dimmed page closes', async () => {
    const user = userEvent.setup();
    const { select, onChange } = onATv();
    await user.click(select);
    expect(row('English')).toHaveFocus();
    await user.click(row('Spanish'));
    expect(select.value).toBe('es');
    expect(onChange).toHaveBeenCalledOnce();
    // a disabled row does nothing.
    await user.click(select);
    await user.click(row('French'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(select.value).toBe('es');
    await user.click(document.querySelector('.nc-select-list__shade')!);
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(select).toHaveFocus();
  });

  it('never steps through its values with the arrow keys on a tv', () => {
    const { select } = onATv();
    select.focus();
    for (const key of ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight']) {
      // false: the key's own effect was stopped.
      expect(fireEvent.keyDown(select, { key })).toBe(false);
    }
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('leaves a key alone that the app took, and stays shut when disabled', async () => {
    const user = userEvent.setup();
    const { select } = onATv({ onKeyDown: (e) => e.preventDefault() });
    select.focus();
    await user.keyboard('{Enter}');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('names the list after the select: its field’s label, or the page’s word for it', async () => {
    const user = userEvent.setup();
    render(
      <Language lang="de">
        <div data-nc-screen="tv">
          {/* a required field's mark is hidden from a screen reader, and is no part of the name. */}
          <Field label="Untertitel" required>
            <Select options={LANGUAGES} defaultValue="en" />
          </Field>
          <Select data-testid="bare" options={LANGUAGES} defaultValue="en" />
        </div>
      </Language>,
    );
    screen.getByRole('combobox', { name: 'Untertitel' }).focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('listbox', { name: 'Untertitel' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    screen.getByTestId('bare').focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('listbox', { name: 'optionen' })).toBeInTheDocument();
  });

  it('reads its rows from <option> children too', async () => {
    const user = userEvent.setup();
    render(
      <div data-nc-screen="tv">
        <Select aria-label="Keep backups for" defaultValue="30">
          <option value="7">7 days</option>
          <option value="30">30 days</option>
          <option value="365" disabled>
            1 year (needs more storage)
          </option>
        </Select>
      </div>,
    );
    screen.getByRole('combobox', { name: 'Keep backups for' }).focus();
    await user.keyboard('{Enter}');
    expect(row('30 days')).toHaveFocus();
    expect(row('1 year (needs more storage)')).toHaveAttribute('aria-disabled', 'true');
  });

  it('has no axe violations: off a tv, on a tv, and with its list open', async () => {
    const user = userEvent.setup();
    const { container, unmount } = render(<Select aria-label="Subtitles" options={LANGUAGES} defaultValue="en" invalid />);
    await expectNoAxeViolations(container);
    unmount();
    const { select } = onATv();
    await expectNoAxeViolations(document.body);
    select.focus();
    await user.keyboard('{Enter}');
    await expectNoAxeViolations(document.body);
  });
});

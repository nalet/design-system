import { describe, expect, it, vi } from 'vitest';
import { useState, type ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Stepper } from './Stepper';
import { Field } from '../Field/Field';
import { Language } from '../../lib/language';
import { expectNoAxeViolations } from '../../test/axe';

const seconds = (n: number) => (n === 1 ? '1 second' : `${n} seconds`);
const countdown = { unit: 's', min: 1, max: 15, formatValue: seconds, minusLabel: 'fewer seconds', plusLabel: 'more seconds' };

const rootOf = (container: HTMLElement) => container.querySelector<HTMLElement>('.nc-stepper')!;
const field = () => screen.getByRole('spinbutton');
const minus = () => screen.getByRole('button', { name: 'fewer seconds' });
const plus = () => screen.getByRole('button', { name: 'more seconds' });
/** the step the browser takes by itself for up or down in a number field. */
const browserSteps = (input: HTMLElement, to: number) => fireEvent.change(input, { target: { value: String(to) } });

describe('Stepper', () => {
  it('is the browser’s own number field: a spin button with its label, its value and its range', () => {
    const { container } = render(
      <Field label="Countdown" hint="From 1 to 15 seconds">
        <Stepper {...countdown} defaultValue={5} />
      </Field>,
    );
    const value = screen.getByRole('spinbutton', { name: 'Countdown' });
    expect(value.tagName).toBe('INPUT');
    expect(value).toHaveAttribute('type', 'number');
    expect(value).toHaveAttribute('min', '1');
    expect(value).toHaveAttribute('max', '15');
    expect(value).toHaveValue(5);
    // read out in full; the short unit is for the eye
    expect(value).toHaveAttribute('aria-valuetext', '5 seconds');
    expect(value).toHaveAccessibleDescription('From 1 to 15 seconds');
    const unit = container.querySelector('.nc-stepper__unit')!;
    expect(unit).toHaveTextContent('s');
    expect(unit).toHaveAttribute('aria-hidden', 'true');
  });

  it('takes one step a press, with minus and plus named after the value they change', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Stepper aria-label="Countdown" {...countdown} defaultValue={5} onChange={onChange} />);
    await user.click(plus());
    expect(field()).toHaveValue(6);
    expect(field()).toHaveAttribute('aria-valuetext', '6 seconds');
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0][0].target.value).toBe('6');
    await user.click(minus());
    await user.click(minus());
    expect(field()).toHaveValue(4);
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it('at either end, the button that would go past it is dimmed and does nothing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<Stepper aria-label="Countdown" {...countdown} defaultValue={1} onChange={onChange} />);
    expect(minus()).toBeDisabled();
    expect(plus()).toBeEnabled();
    await user.click(minus());
    expect(field()).toHaveValue(1);
    expect(onChange).not.toHaveBeenCalled();
    rerender(<Stepper key="top" aria-label="Countdown" {...countdown} defaultValue={15} onChange={onChange} />);
    expect(plus()).toBeDisabled();
    expect(minus()).toBeEnabled();
  });

  it('the value is the one tab stop; the Tab key passes minus and plus', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">before</button>
        <Stepper aria-label="Countdown" {...countdown} defaultValue={5} />
        <button type="button">after</button>
      </>,
    );
    await user.tab();
    await user.tab();
    expect(field()).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'after' })).toHaveFocus();
  });

  it('up and down take a step, Home and End go to the two ends', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Stepper aria-label="Countdown" {...countdown} defaultValue={5} onChange={onChange} />);
    field().focus();
    await user.keyboard('{ArrowUp}');
    expect(field()).toHaveValue(6);
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(field()).toHaveValue(4);
    await user.keyboard('{End}');
    expect(field()).toHaveValue(15);
    await user.keyboard('{ArrowUp}');
    expect(field()).toHaveValue(15);
    await user.keyboard('{Home}');
    expect(field()).toHaveValue(1);
    await user.keyboard('{ArrowDown}');
    expect(field()).toHaveValue(1);
    // five changes: the two presses at the ends changed nothing
    expect(onChange).toHaveBeenCalledTimes(5);
  });

  it('a press on minus or plus leaves the focus where it is', () => {
    render(<Stepper aria-label="Countdown" {...countdown} defaultValue={5} />);
    // the press is stopped from moving the focus onto the button
    expect(fireEvent.mouseDown(plus())).toBe(false);
    expect(fireEvent.mouseDown(minus())).toBe(false);
  });

  it('takes a typed value as it is, and comes back into its range with one step', async () => {
    const user = userEvent.setup();
    render(<Stepper aria-label="Countdown" {...countdown} defaultValue={5} />);
    await user.clear(field());
    await user.type(field(), '40');
    expect(field()).toHaveValue(40);
    expect(plus()).toBeDisabled();
    await user.click(minus());
    expect(field()).toHaveValue(15);
  });

  it('from nothing, a step gives the lowest value', async () => {
    const user = userEvent.setup();
    render(<Stepper aria-label="Countdown" {...countdown} />);
    expect(field()).toHaveValue(null);
    expect(minus()).toBeEnabled();
    await user.click(plus());
    expect(field()).toHaveValue(1);
  });

  it('steps by the size the product sets, without the rounding errors of fractions', async () => {
    const user = userEvent.setup();
    render(<Stepper aria-label="Speed" min={0.5} max={2} step={0.1} defaultValue={0.7} />);
    await user.click(screen.getByRole('button', { name: 'more' }));
    expect(field()).toHaveValue(0.8);
    await user.click(screen.getByRole('button', { name: 'more' }));
    expect(field()).toHaveValue(0.9);
  });

  it('follows the app when the app holds the value', async () => {
    const user = userEvent.setup();
    function Held() {
      const [value, setValue] = useState('5');
      return <Stepper aria-label="Copies to keep" min={1} max={9} value={value} onChange={(e) => setValue(e.target.value)} />;
    }
    render(<Held />);
    await user.click(screen.getByRole('button', { name: 'more' }));
    expect(field()).toHaveValue(6);
    function Stuck() {
      return <Stepper aria-label="Copies to keep" min={1} max={9} value={5} onChange={() => undefined} />;
    }
    render(<Stuck />);
    const stuck = screen.getAllByRole('spinbutton')[1];
    await user.click(screen.getAllByRole('button', { name: 'more' })[1]);
    expect(stuck).toHaveValue(5);
  });

  it('names minus and plus in the page’s language where the app gives no names', () => {
    const { rerender } = render(<Stepper aria-label="Copies to keep" defaultValue={3} />);
    expect(screen.getByRole('button', { name: 'less' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'more' })).toBeInTheDocument();
    rerender(
      <Language lang="de">
        <Stepper aria-label="Kopien" defaultValue={3} />
      </Language>,
    );
    expect(screen.getByRole('button', { name: 'weniger' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'mehr' })).toBeInTheDocument();
  });

  it('without the value in full, the unit is read with the page', () => {
    const { container } = render(<Stepper aria-label="Countdown" unit="s" defaultValue={5} />);
    expect(field()).not.toHaveAttribute('aria-valuetext');
    expect(container.querySelector('.nc-stepper__unit')).not.toHaveAttribute('aria-hidden');
  });

  it('keeps room for its longest value to be typed, and knows how much of it shows', () => {
    const { rerender } = render(<Stepper aria-label="Countdown" {...countdown} defaultValue={5} />);
    expect(field().style.getPropertyValue('--nc-stepper-digits')).toBe('2');
    expect(field().style.getPropertyValue('--nc-stepper-shown')).toBe('1');
    rerender(<Stepper key="wide" aria-label="Timeout" min={0} max={1200} defaultValue={250} />);
    expect(field().style.getPropertyValue('--nc-stepper-digits')).toBe('4');
    expect(field().style.getPropertyValue('--nc-stepper-shown')).toBe('3');
  });

  it('works inside a field: an error marks the value and its frame', () => {
    const { container } = render(
      <Field label="Countdown" error="Use a whole number from 1 to 15">
        <Stepper {...countdown} defaultValue={40} />
      </Field>,
    );
    expect(field()).toHaveAttribute('aria-invalid', 'true');
    expect(field()).toHaveAccessibleDescription('Use a whole number from 1 to 15');
    expect(rootOf(container)).toHaveClass('nc-stepper--invalid');
  });

  it('can be switched off, and can be read only', async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(<Stepper aria-label="Countdown" {...countdown} defaultValue={5} disabled />);
    expect(rootOf(container)).toHaveClass('nc-stepper--disabled');
    expect(field()).toBeDisabled();
    expect(minus()).toBeDisabled();
    expect(plus()).toBeDisabled();
    rerender(<Stepper aria-label="Countdown" {...countdown} defaultValue={5} readOnly />);
    expect(plus()).toBeDisabled();
    field().focus();
    await user.keyboard('{ArrowUp}');
    expect(field()).toHaveValue(5);
  });

  describe('on a tv', () => {
    const tv = (stepper: ReactNode, dir?: 'rtl') =>
      render(
        <div data-nc-screen="tv" dir={dir}>
          {stepper}
        </div>,
      );

    it('left and right change the value', async () => {
      const user = userEvent.setup();
      tv(<Stepper aria-label="Countdown" {...countdown} defaultValue={5} />);
      field().focus();
      await user.keyboard('{ArrowRight}');
      expect(field()).toHaveValue(6);
      await user.keyboard('{ArrowLeft}{ArrowLeft}');
      expect(field()).toHaveValue(4);
    });

    it('up and down move to the next row: the keys are left untouched, and the browser’s step is undone', () => {
      const onChange = vi.fn();
      tv(<Stepper aria-label="Countdown" {...countdown} defaultValue={5} onChange={onChange} />);
      expect(fireEvent.keyDown(field(), { key: 'ArrowUp' })).toBe(true);
      browserSteps(field(), 6);
      expect(field()).toHaveValue(5);
      expect(fireEvent.keyDown(field(), { key: 'ArrowDown' })).toBe(true);
      browserSteps(field(), 4);
      expect(field()).toHaveValue(5);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('towards the row’s end is up, also where the row starts on the right', async () => {
      const user = userEvent.setup();
      tv(<Stepper aria-label="Countdown" {...countdown} defaultValue={5} />, 'rtl');
      field().focus();
      await user.keyboard('{ArrowLeft}');
      expect(field()).toHaveValue(6);
      await user.keyboard('{ArrowRight}');
      expect(field()).toHaveValue(5);
    });
  });

  it('leaves left and right to the caret where the screen isn’t a tv', () => {
    render(<Stepper aria-label="Countdown" {...countdown} defaultValue={5} />);
    expect(fireEvent.keyDown(field(), { key: 'ArrowRight' })).toBe(true);
    expect(field()).toHaveValue(5);
    // and takes up and down itself, so the browser doesn't step a second time
    expect(fireEvent.keyDown(field(), { key: 'ArrowUp' })).toBe(false);
    expect(field()).toHaveValue(6);
  });

  it.each([
    ['in a field', <Field key="f" label="Countdown" hint="From 1 to 15 seconds"><Stepper {...countdown} defaultValue={5} /></Field>],
    ['at its lowest', <Stepper key="l" aria-label="Countdown" {...countdown} defaultValue={1} />],
    ['with an error', <Field key="e" label="Countdown" error="Use a whole number from 1 to 15"><Stepper {...countdown} defaultValue={40} /></Field>],
    ['disabled', <Stepper key="d" aria-label="Countdown" {...countdown} defaultValue={5} disabled />],
  ])('has no axe violations (%s)', async (_name, stepper) => {
    const { container } = render(stepper);
    await expectNoAxeViolations(container);
  });

  it.each(['touch', 'tv'])('has no axe violations on a %s screen', async (kind) => {
    const { container } = render(
      <div data-nc-screen={kind}>
        <Field label="Countdown" hint="From 1 to 15 seconds">
          <Stepper {...countdown} defaultValue={5} />
        </Field>
      </div>,
    );
    await expectNoAxeViolations(container);
  });
});

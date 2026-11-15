import { describe, expect, it, vi } from 'vitest';
import { useState, type ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Slider } from './Slider';
import { Field } from '../Field/Field';
import { Language } from '../../lib/language';
import { expectNoAxeViolations } from '../../test/axe';

const percent = (n: number) => `${n}%`;
const rootOf = (container: HTMLElement) => container.querySelector<HTMLElement>('.nc-slider')!;
const at = (container: HTMLElement) => rootOf(container).style.getPropertyValue('--nc-slider-at');
const wordsOf = (container: HTMLElement) => container.querySelector<HTMLElement>('.nc-slider__value')!;
/** the step the browser takes by itself for an arrow key on a range input. */
const browserSteps = (input: HTMLElement, to: number) => fireEvent.change(input, { target: { value: String(to) } });
const nextTask = () => new Promise((done) => setTimeout(done, 0));

describe('Slider', () => {
  it('is the browser’s own range input, with its label and its value in words', () => {
    const { container } = render(
      <Field label="Volume">
        <Slider defaultValue={60} formatValue={percent} />
      </Field>,
    );
    const slider = screen.getByRole('slider', { name: 'Volume' });
    expect(slider.tagName).toBe('INPUT');
    expect(slider).toHaveAttribute('type', 'range');
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '100');
    expect(slider).toHaveAttribute('step', '1');
    expect(slider).toHaveValue('60');
    expect(slider).toHaveAttribute('aria-valuetext', '60%');
    // the same words after the track are for the eye: a screen reader meets them once, on the slider
    expect(wordsOf(container)).toHaveTextContent('60%');
    expect(wordsOf(container)).toHaveAttribute('aria-hidden', 'true');
    expect(at(container)).toBe('0.6');
  });

  it('applies as it moves: the change is the input’s own, and the track and the words follow', () => {
    const onChange = vi.fn();
    const { container } = render(<Slider aria-label="Volume" defaultValue={60} formatValue={percent} onChange={onChange} />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '25' } });
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0][0].target.value).toBe('25');
    expect(at(container)).toBe('0.25');
    expect(wordsOf(container)).toHaveTextContent('25%');
    expect(slider).toHaveAttribute('aria-valuetext', '25%');
  });

  it('follows the app when the app holds the value', () => {
    function Held() {
      const [value, setValue] = useState(40);
      return <Slider aria-label="Brightness" value={value} onChange={(e) => setValue(Number(e.target.value))} formatValue={percent} />;
    }
    const { container } = render(<Held />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '80' } });
    expect(screen.getByRole('slider')).toHaveValue('80');
    expect(at(container)).toBe('0.8');
    expect(wordsOf(container)).toHaveTextContent('80%');
  });

  it('starts in the middle without a value, as the browser’s range does, and keeps to its range', () => {
    const { container, rerender } = render(<Slider aria-label="Text size" min={80} max={160} />);
    expect(screen.getByRole('slider')).toHaveValue('120');
    expect(at(container)).toBe('0.5');
    rerender(<Slider aria-label="Text size" min={80} max={160} value={400} onChange={() => undefined} />);
    expect(at(container)).toBe('1');
  });

  it('writes its number as the page’s language does, and keeps room for its longest value', () => {
    const { container } = render(
      <Language lang="de">
        <Slider aria-label="Bitrate" min={500} max={8000} step={100} defaultValue={2500} />
      </Language>,
    );
    expect(wordsOf(container)).toHaveTextContent('2.500');
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '2.500');
    expect(wordsOf(container).style.minInlineSize).toBe('5ch');
  });

  it('draws a seek bar: the time played before the track, what has loaded, and the length after it', () => {
    const { container } = render(
      <Slider
        aria-label="Seek"
        min={0}
        max={6720}
        value={2530}
        loaded={4032}
        onChange={() => undefined}
        formatValue={() => '42 minutes of 1 hour 52'}
        before="0:42:10"
        after="1:52:00"
      />,
    );
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '42 minutes of 1 hour 52');
    expect(container.querySelector('.nc-slider__before')).toHaveTextContent('0:42:10');
    expect(container.querySelector('.nc-slider__after')).toHaveTextContent('1:52:00');
    expect(wordsOf(container)).toBeNull();
    expect(container.querySelector('.nc-slider__loaded')).not.toBeNull();
    expect(rootOf(container).style.getPropertyValue('--nc-slider-loaded')).toBe('0.6');
  });

  it('can leave the place after the track empty', () => {
    const { container } = render(<Slider aria-label="Volume" defaultValue={70} after={null} />);
    expect(wordsOf(container)).toBeNull();
    expect(container.querySelector('.nc-slider__after')).toBeNull();
  });

  it('takes one of three heights, and can be switched off', () => {
    const { container, rerender } = render(<Slider aria-label="Volume" size="lg" />);
    expect(rootOf(container)).toHaveClass('nc-slider--lg');
    rerender(<Slider aria-label="Volume" disabled />);
    expect(rootOf(container)).toHaveClass('nc-slider--md', 'nc-slider--disabled');
    expect(screen.getByRole('slider')).toBeDisabled();
  });

  it('works inside a field: the hint describes it, and an error marks it', () => {
    const { container, rerender } = render(
      <Field label="Volume" hint="Applies as you move it">
        <Slider defaultValue={60} />
      </Field>,
    );
    const slider = screen.getByRole('slider', { name: 'Volume' });
    expect(slider).toHaveAccessibleDescription('Applies as you move it');
    expect(slider).not.toHaveAttribute('aria-invalid');
    rerender(
      <Field label="Volume" error="Choose 10% or more">
        <Slider defaultValue={5} />
      </Field>,
    );
    expect(screen.getByRole('slider')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('slider')).toHaveAccessibleDescription('Choose 10% or more');
    expect(rootOf(container)).toHaveClass('nc-slider--invalid');
  });

  it('gives its ref and its other attributes to the input, and its class to the box', () => {
    let node: HTMLInputElement | null = null;
    const { container } = render(
      <Slider
        ref={(el) => {
          node = el;
        }}
        aria-label="Volume"
        name="volume"
        className="mine"
      />,
    );
    expect(node).toBe(screen.getByRole('slider'));
    expect(screen.getByRole('slider')).toHaveAttribute('name', 'volume');
    expect(rootOf(container)).toHaveClass('mine');
  });

  describe('on a tv', () => {
    const tv = (slider: ReactNode) => render(<div data-nc-screen="tv">{slider}</div>);

    it('on a row of its own, left and right change it, and up and down move on', async () => {
      const onChange = vi.fn();
      tv(<Slider aria-label="Seek" defaultValue={60} onChange={onChange} />);
      const slider = screen.getByRole('slider');
      // up is left untouched for whatever moves the focus, and the step the browser takes for it is undone
      expect(fireEvent.keyDown(slider, { key: 'ArrowUp' })).toBe(true);
      browserSteps(slider, 61);
      expect(slider).toHaveValue('60');
      expect(onChange).not.toHaveBeenCalled();
      expect(fireEvent.keyDown(slider, { key: 'ArrowDown' })).toBe(true);
      browserSteps(slider, 59);
      expect(slider).toHaveValue('60');
      expect(onChange).not.toHaveBeenCalled();
      // right is the slider's
      expect(fireEvent.keyDown(slider, { key: 'ArrowRight' })).toBe(true);
      browserSteps(slider, 61);
      expect(slider).toHaveValue('61');
      expect(onChange).toHaveBeenCalledOnce();
    });

    it('where it shares a row, up and down change it, and left and right move on', () => {
      const onChange = vi.fn();
      tv(<Slider aria-label="Volume" defaultValue={60} sharesRow onChange={onChange} />);
      const slider = screen.getByRole('slider');
      expect(fireEvent.keyDown(slider, { key: 'ArrowRight' })).toBe(true);
      browserSteps(slider, 61);
      expect(slider).toHaveValue('60');
      expect(onChange).not.toHaveBeenCalled();
      fireEvent.keyDown(slider, { key: 'ArrowUp' });
      browserSteps(slider, 61);
      expect(slider).toHaveValue('61');
      expect(onChange).toHaveBeenCalledOnce();
    });

    it('undoes only the step of the key it gave away', async () => {
      const onChange = vi.fn();
      tv(<Slider aria-label="Seek" defaultValue={100} onChange={onChange} />);
      const slider = screen.getByRole('slider');
      // at the end of its range the browser takes no step: the next change is a person's
      fireEvent.keyDown(slider, { key: 'ArrowUp' });
      await nextTask();
      browserSteps(slider, 90);
      expect(slider).toHaveValue('90');
      expect(onChange).toHaveBeenCalledOnce();
    });
  });

  it('keeps all four arrow keys where the screen isn’t a tv', () => {
    const onChange = vi.fn();
    render(<Slider aria-label="Volume" defaultValue={60} onChange={onChange} />);
    const slider = screen.getByRole('slider');
    expect(fireEvent.keyDown(slider, { key: 'ArrowUp' })).toBe(true);
    browserSteps(slider, 61);
    expect(slider).toHaveValue('61');
    expect(onChange).toHaveBeenCalledOnce();
  });

  it.each([
    ['in a field', <Field key="f" label="Volume" hint="Applies as you move it"><Slider defaultValue={60} formatValue={percent} /></Field>],
    ['with a name of its own', <Slider key="n" aria-label="Volume" before={<span aria-hidden="true">vol</span>} defaultValue={70} />],
    ['as a seek bar', <Slider key="s" aria-label="Seek" max={6720} defaultValue={2530} loaded={4032} before="0:42:10" after="1:52:00" />],
    ['disabled', <Slider key="d" aria-label="Volume" disabled />],
    ['with an error', <Field key="e" label="Volume" error="Choose 10% or more"><Slider defaultValue={5} /></Field>],
  ])('has no axe violations (%s)', async (_name, slider) => {
    const { container } = render(slider);
    await expectNoAxeViolations(container);
  });

  it.each(['touch', 'tv'])('has no axe violations on a %s screen', async (kind) => {
    const { container } = render(
      <div data-nc-screen={kind}>
        <Field label="Volume">
          <Slider defaultValue={60} formatValue={percent} />
        </Field>
      </div>,
    );
    await expectNoAxeViolations(container);
  });
});

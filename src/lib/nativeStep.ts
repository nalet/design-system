import * as React from 'react';

/**
 * nativeStep — what the slider and the stepper share: both are the browser's
 * own inputs (a range, a number field), which take the arrow keys by
 * themselves. On a TV, each gives two of the four arrows away, so that the
 * focus can move on.
 */

/** Whether an element is on a screen that says it is a TV: `data-nc-screen="tv"` on it or above it. */
export function onTv(el: Element): boolean {
  return el.closest("[data-nc-screen='tv']") != null;
}

/** Whether an element is laid out from right to left, so that its start is on the right. */
export function startsOnTheRight(el: Element): boolean {
  return getComputedStyle(el).direction === 'rtl';
}

const nativeValue = typeof HTMLInputElement === 'undefined' ? undefined : Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;

/**
 * Sets an input's value the way a person's own change does: the input says
 * "input", so React calls `onChange`, a form library hears it, and an
 * uncontrolled input keeps the value.
 */
export function changeInputValue(input: HTMLInputElement, value: string): void {
  if (input.value === value) return;
  if (nativeValue) nativeValue.call(input, value);
  else input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

/**
 * useKeysLeftAlone — for a key the control gives away. A range and a number
 * field step on an arrow key by themselves, and the only way to tell the
 * browser not to is `preventDefault()`, which also tells whatever moves the
 * focus on a TV that the key was used. So the key is left untouched, and the
 * step the browser takes for it is undone before anyone hears of it.
 *
 * `leave(input)` in the key handler, for a key that is given away;
 * `undone(input)` first in the change handler: true when the change was that
 * step, and is gone again.
 */
export function useKeysLeftAlone() {
  const held = React.useRef<string | null>(null);
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  return React.useMemo(
    () => ({
      leave(input: HTMLInputElement) {
        held.current = input.value;
        // the browser steps while it still handles the key; after that, a change is a person's again.
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
          held.current = null;
        }, 0);
      },
      undone(input: HTMLInputElement): boolean {
        if (held.current == null) return false;
        // through the input's own setter, so React knows the value it now has
        input.value = held.current;
        held.current = null;
        return true;
      },
    }),
    [],
  );
}

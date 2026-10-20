import { describe, expect, it } from 'vitest';
import { cssRules } from './css';

// A box that scrolls sideways must also be a positioned box. Text hidden for
// screen readers (`nc-sr-only`) is absolutely positioned; inside a scroll box
// that is not positioned, it escapes the box and widens the whole page — on a
// phone the page then scrolls sideways (Safari) or zooms out (Chrome).
describe('scroll containers', () => {
  it('every box that scrolls is positioned, so nothing inside can widen the page', () => {
    const offenders = cssRules()
      .filter(({ body }) => /overflow(-x|-y)?\s*:\s*(auto|scroll)\b/.test(body) && !/\bposition\s*:/.test(body))
      .map(({ file, selector }) => `${file}: ${selector}`);
    expect(offenders).toEqual([]);
  });
});

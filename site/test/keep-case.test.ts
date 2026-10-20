import { describe, expect, it } from 'vitest';
import { cssRules } from './css';

// A name marked to keep its case (`KeepCase`, a span with the class
// `nc-keep-case`) sets `text-transform: none` on its own element, so it wins
// over the lowercase its label passes down. It would lose only to a rule that
// styles the name's element itself, so a rule that transforms text names the
// element it styles by a class or a tag other than span: never `*`, `span` or
// an attribute alone.
const subject = (selector: string) =>
  (selector.split(/\s*[>+~]\s*|\s+/).pop() ?? '').replace(/::?[\w-]+(\([^)]*\))?/g, '');

const couldStyleTheName = (compound: string) =>
  !compound.includes('.') && (compound === '' || compound === '*' || /^span\b/i.test(compound) || compound.startsWith('['));

// The element that holds a label's text lays it out as text. In a flex or grid
// box, the name and the words around it become separate items, and the spaces
// between them are dropped: "findGermanfor 4 selected".
const LABELS = [
  'nc-btn__label',
  'nc-badge__label',
  'nc-status__text',
  'nc-actionmenu__label',
  'nc-tabs__tab',
  'nc-toolbar__heading',
  'nc-modal__title',
  'nc-illu__title',
  'nc-card__title',
  'nc-worklist__title',
  'nc-divider__label',
  'nc-tile__title',
];

describe('keep case', () => {
  it('no rule that transforms text can reach a name marked to keep its case', () => {
    const offenders = cssRules()
      .filter(({ body }) => /\btext-transform\s*:/.test(body))
      .flatMap(({ file, selector }) => selector.split(',').map((s) => ({ file, selector: s.trim() })))
      .filter(({ selector }) => selector !== '.nc-keep-case' && couldStyleTheName(subject(selector)))
      .map(({ file, selector }) => `${file}: ${selector}`);
    expect(offenders).toEqual([]);
  });

  it('the text of a label is laid out as text, so the spaces around a name stay', () => {
    const offenders = cssRules()
      .filter(({ selector }) => selector.split(',').some((s) => LABELS.includes(s.trim().slice(1))))
      .filter(({ body }) => /\bdisplay\s*:\s*(inline-)?(flex|grid)\b/.test(body))
      .map(({ file, selector }) => `${file}: ${selector}`);
    expect(offenders).toEqual([]);
  });
});

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cssRules } from './css';

// The touch and tv rules (src/styles/screens.css) apply only where an app says
// what kind of screen it draws, with data-nc-screen="touch" or "tv" on an
// ancestor. These checks read the stylesheets themselves: jsdom applies no css.
const SCREENS = join('src', 'styles', 'screens.css');

/** every selector of the file with its declarations; a comma inside :has(…) or :not(…) ends no selector. */
const screens = cssRules()
  .filter((r) => r.file === SCREENS)
  .flatMap((r) => r.selector.split(/,(?![^()]*\))/).map((s) => ({ selector: s.replace(/^@media[^{]*\{/, '').trim(), body: r.body })));

describe('screens.css', () => {
  it('has rules for both kinds of screen', () => {
    expect(screens.length).toBeGreaterThan(100);
    expect(screens.some((r) => r.selector.startsWith("[data-nc-screen='touch'] "))).toBe(true);
    expect(screens.some((r) => r.selector.startsWith("[data-nc-screen='tv'] "))).toBe(true);
  });

  it('changes nothing without the attribute: every selector starts from it', () => {
    const free = screens
      .map((r) => r.selector)
      .filter((s) => !/^(:where\()?\[data-nc-screen='(touch|tv)'\]\)? /.test(s));
    expect(free).toEqual([]);
  });

  it('writes its sizes in rem: px only for lines of 3px or less', () => {
    const sizes = screens.flatMap((r) => r.body.match(/\b\d+(\.\d+)?px\b/g) ?? []);
    expect(sizes.filter((px) => parseFloat(px) > 3)).toEqual([]);
  });

  it('keeps the tv rules to css an older tv’s browser knows', () => {
    const tv = screens.filter((r) => r.selector.includes("[data-nc-screen='tv']"));
    expect(tv.filter((r) => /:is\(|:where\(|:focus-visible/.test(r.selector)).map((r) => r.selector)).toEqual([]);
    expect(tv.filter((r) => /\binset\s*:|\bmin\(|\bmax\(|color-mix\(/.test(r.body)).map((r) => r.selector)).toEqual([]);
  });

  it('leaves the action menu, the multi select and the filter bar to their own stylesheets', () => {
    expect(screens.filter((r) => /\.nc-(actionmenu|multiselect|filterbar)/.test(r.selector)).map((r) => r.selector)).toEqual([]);
  });

  it('ships in the package’s stylesheet: the entry imports it', () => {
    expect(readFileSync(join('src', 'index.ts'), 'utf8')).toContain("import './styles/screens.css';");
  });
});

describe('the large switch', () => {
  const rule = (selector: string) =>
    cssRules()
      .filter((r) => r.selector === selector)
      .map((r) => r.body.replace(/\s+/g, ' ').trim())
      .join(' ');

  it('is drawn as the specs give it: a track of 42 × 24, an 18 thumb that slides 18, a 14 label', () => {
    expect(rule('.nc-switch--lg .nc-switch__track')).toBe('width: 2.625rem; height: 1.5rem; padding: 2px;');
    expect(rule('.nc-switch--lg .nc-switch__thumb')).toBe('width: 1.125rem; height: 1.125rem;');
    expect(rule('.nc-switch--lg .nc-switch__input:checked + .nc-switch__thumb')).toBe('transform: translateX(1.125rem);');
    expect(rule('.nc-switch--lg .nc-switch__label')).toBe('font-size: 0.875rem;');
  });

  it('is the switch of a touch screen and of a tv, whatever size the app asked for', () => {
    const on = (screen: string, part: string) =>
      screens
        .filter((r) => r.selector === `[data-nc-screen='${screen}'] .nc-switch ${part}`)
        .map((r) => r.body.replace(/\s+/g, ' ').trim())
        .join(' ');
    for (const screen of ['touch', 'tv']) {
      expect(on(screen, '.nc-switch__track')).toBe('width: 2.625rem; height: 1.5rem;');
      expect(on(screen, '.nc-switch__thumb')).toBe('width: 1.125rem; height: 1.125rem;');
      expect(on(screen, '.nc-switch__input:checked + .nc-switch__thumb')).toBe('transform: translateX(1.125rem);');
      expect(on(screen, '.nc-switch__label')).toBe('font-size: 0.875rem;');
    }
  });
});

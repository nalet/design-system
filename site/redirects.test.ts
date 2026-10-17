// the old storybook urls keep working: site/redirects.mjs, as the home page and
// iframe.html run it. the built site is checked too, by site/scripts/check-links.mjs.
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { MOVED, STORIES_STAY, redirectScript, resolveOld } from './redirects.mjs';

const BASE = '/design-system/';
const go = (search: string, hash = '', pathname = BASE) => resolveOld(pathname, search, hash, BASE, MOVED, STORIES_STAY);

describe('old storybook urls', () => {
  it('leaves the home page alone', () => {
    expect(go('')).toBeNull();
    expect(go('?q=1')).toBeNull();
  });

  it('sends a foundation to its new page', () => {
    expect(go('?path=/docs/foundations-colour--docs')).toBe('/design-system/styles/colour/');
    expect(go('?path=/docs/foundations-space-grid--docs')).toBe('/design-system/foundations/layout/');
    expect(go('?path=/docs/foundations-voice-content--docs')).toBe('/design-system/foundations/content-voice/');
  });

  it('keeps the heading the old link pointed at', () => {
    expect(go('?path=/docs/foundations-colour--docs', '#contrast')).toBe('/design-system/styles/colour/#contrast');
  });

  it('sends a pattern to its new page', () => {
    expect(go('?path=/docs/patterns-worklist--docs')).toBe('/design-system/patterns/worklist/');
    expect(go('?path=/docs/patterns-portal--docs')).toBe('/design-system/patterns/launchpad-and-tiles/');
  });

  it('sends the introduction to get started, develop and the changelog', () => {
    expect(go('?path=/docs/introduction-overview--docs')).toBe('/design-system/get-started/');
    expect(go('?path=/docs/introduction-getting-started--docs')).toBe('/design-system/develop/react/');
    expect(go('?path=/docs/introduction-changelog--docs')).toBe('/design-system/get-started/versioning/');
  });

  it('sends the tile and the tile group to their part of the launchpad page', () => {
    expect(go('?path=/docs/components-navigation-tile--docs', '#anatomy')).toBe(
      '/design-system/patterns/launchpad-and-tiles/#the-tile',
    );
    expect(go('?path=/docs/components-navigation-tile-group--docs')).toBe(
      '/design-system/patterns/launchpad-and-tiles/#tile-groups',
    );
  });

  it('keeps a component on the react subsite, query unchanged', () => {
    expect(go('?path=/docs/components-actions-button--docs')).toBe(
      '/design-system/react/?path=/docs/components-actions-button--docs',
    );
  });

  it("keeps a component's story on the react subsite, query and hash unchanged", () => {
    expect(go('?path=/story/components-actions-button--variants&args=size:sm', '#x')).toBe(
      '/design-system/react/?path=/story/components-actions-button--variants&args=size:sm#x',
    );
    expect(go('?path=/story/components-navigation-tile--kpi')).toBe('/design-system/react/?path=/story/components-navigation-tile--kpi');
  });

  it('sends a story whose page left the storybook to that page', () => {
    expect(go('?path=/story/foundations-brand--chevron-sizes')).toBe('/design-system/styles/brand/');
    expect(go('?path=/story/foundations-space-grid--responsive')).toBe('/design-system/foundations/layout/');
  });

  it("keeps a pattern's story where its code still is", () => {
    expect(go('?path=/story/patterns-worklist--full-example')).toBe(
      '/design-system/react/?path=/story/patterns-worklist--full-example',
    );
  });

  it('passes anything else to the react subsite', () => {
    expect(go('?path=/docs/no-such-page--docs')).toBe('/design-system/react/?path=/docs/no-such-page--docs');
    expect(go('?path=/settings/about')).toBe('/design-system/react/?path=/settings/about');
  });

  it("sends iframe.html to the react subsite's, or to the page a story left for", () => {
    const iframe = '/design-system/iframe.html';
    expect(go('?id=components-actions-button--playground&viewMode=story', '', iframe)).toBe(
      '/design-system/react/iframe.html?id=components-actions-button--playground&viewMode=story',
    );
    expect(go('?id=foundations-colour--palette&viewMode=story', '', iframe)).toBe('/design-system/styles/colour/');
    expect(go('?id=foundations-colour--docs&viewMode=docs', '', iframe)).toBe('/design-system/styles/colour/');
    expect(go('', '', iframe)).toBe('/design-system/react/iframe.html');
  });
});

describe('the redirect map', () => {
  it('points every moved title at a page of this site', () => {
    for (const target of Object.values(MOVED)) {
      const path = target.split('#')[0].replace(/\/$/, '');
      const page = ['index.astro', 'index.mdx', 'index.md'].map((f) => `site/src/pages/${path}/${f}`);
      const flat = ['.astro', '.mdx', '.md'].map((ext) => `site/src/pages/${path}${ext}`);
      expect([...page, ...flat].some((f) => existsSync(f)), `no page for ${target}`).toBe(true);
    }
  });

  it('covers every page the 0.3.0 storybook had outside the components', () => {
    const old = JSON.parse(readFileSync('site/test/storybook-0.3.0.json', 'utf8')) as { docs: string[] };
    const titles = old.docs.map((id) => id.split('--')[0]).filter((t) => !t.startsWith('components-') || t === 'components-overview');
    for (const title of titles) expect(MOVED, title).toHaveProperty([title]);
  });

  it('inlines as a script that runs on its own', () => {
    const script = redirectScript(BASE);
    expect(() => new Function(script)).not.toThrow();
    expect(script).toContain('"foundations-colour":"styles/colour/"');
  });
});

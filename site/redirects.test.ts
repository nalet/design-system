// the old storybook urls keep working: site/redirects.mjs, as the home page and
// iframe.html run it. the built site is checked too, by site/scripts/check-links.mjs.
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { MOVED, RENAMED, STORIES_STAY, astroRedirects, redirectScript, resolveOld } from './redirects.mjs';

const BASE = '/design-system/';
const go = (search: string, hash = '', pathname = BASE) => resolveOld(pathname, search, hash, BASE, MOVED, STORIES_STAY);

/** whether a path relative to the base, such as "styles/colour/#contrast", is a page of this site. */
function isPage(target: string) {
  const path = target.split('#')[0].replace(/\/$/, '');
  const page = ['index.astro', 'index.mdx', 'index.md'].map((f) => `site/src/pages/${path}/${f}`);
  const flat = ['.astro', '.mdx', '.md'].map((ext) => `site/src/pages/${path}${ext}`);
  return [...page, ...flat].some((f) => existsSync(f));
}

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
    expect(go('?path=/docs/patterns-portal--docs')).toBe('/design-system/patterns/home-and-tiles/');
  });

  it('sends the portal to home & tiles, with the heading the old link named', () => {
    expect(go('?path=/docs/patterns-portal--docs', '#groups')).toBe('/design-system/patterns/home-and-tiles/#groups');
  });

  it('sends the introduction to get started, develop and the changelog', () => {
    expect(go('?path=/docs/introduction-overview--docs')).toBe('/design-system/get-started/');
    expect(go('?path=/docs/introduction-getting-started--docs')).toBe('/design-system/develop/react/');
    expect(go('?path=/docs/introduction-changelog--docs')).toBe('/design-system/get-started/versioning/');
  });

  it('sends the tile and the tile group to their part of the home & tiles page', () => {
    expect(go('?path=/docs/components-navigation-tile--docs', '#anatomy')).toBe(
      '/design-system/patterns/home-and-tiles/#the-tile',
    );
    expect(go('?path=/docs/components-navigation-tile-group--docs')).toBe(
      '/design-system/patterns/home-and-tiles/#tile-groups',
    );
  });

  it("sends a component's docs page to its guidance", () => {
    expect(go('?path=/docs/components-actions-button--docs')).toBe('/design-system/components/button/');
    expect(go('?path=/docs/components-data-display-data-table--docs', '#keyboard')).toBe(
      '/design-system/components/data-table/#keyboard',
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
    for (const target of Object.values(MOVED)) expect(isPage(target), `no page for ${target}`).toBe(true);
  });

  it('covers every docs page the 0.3.0 storybook had', () => {
    const old = JSON.parse(readFileSync('site/test/storybook-0.3.0.json', 'utf8')) as { docs: string[] };
    for (const title of old.docs.map((id) => id.split('--')[0])) expect(MOVED, title).toHaveProperty([title]);
  });

  it('inlines as a script that runs on its own', () => {
    const script = redirectScript(BASE);
    expect(() => new Function(script)).not.toThrow();
    expect(script).toContain('"foundations-colour":"styles/colour/"');
  });
});

describe('renamed pages', () => {
  it('send the old address of home & tiles on to the new one', () => {
    expect(astroRedirects(BASE)).toEqual({ '/patterns/launchpad-and-tiles': '/design-system/patterns/home-and-tiles/' });
  });

  it('lead to a page of this site, and leave no page behind at the old address', () => {
    for (const [from, to] of Object.entries(RENAMED)) {
      expect(isPage(to), `no page for ${to}`).toBe(true);
      expect(isPage(from), `a page is still at ${from}`).toBe(false);
    }
  });
});

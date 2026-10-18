// old links keep working.
//
// until 0.3.0 the storybook was the whole site, at /design-system/. it now
// lives at /design-system/react/, and the design guidance moved to pages of
// this site. an old link names a storybook entry in its query:
//
//   /design-system/?path=/docs/<title-id>--docs        a docs page
//   /design-system/?path=/story/<title-id>--<story>    one story
//   /design-system/iframe.html?id=<title-id>--<story>  a story's canvas
//
// the home page and iframe.html run `resolveOld` (inlined, before anything
// renders): a title whose content moved goes to its new page; everything
// else goes to the same entry on the react subsite, query unchanged.
// site/redirects.test.ts checks every id the 0.3.0 storybook had.
//
// a page of this site that was renamed keeps its old address too: RENAMED
// below, which astro.config.mjs turns into a redirect page at the old path.
//
// an entry of the react subsite that was renamed keeps its old id: the
// subsite's index.html and iframe.html run `resolveRenamedEntry` (inlined
// into their head by .storybook/main.ts, before storybook reads the address),
// which swaps the old title for the new one and keeps the rest of the link.
// site/redirects.test.ts and site:check check every entry the subsite had.

/** old storybook title id -> page of this site, relative to the base. */
export const MOVED = {
  // introduction
  'introduction-overview': 'get-started/',
  'introduction-getting-started': 'develop/react/',
  'introduction-changelog': 'get-started/versioning/',

  // foundations
  'foundations-colour': 'styles/colour/',
  'foundations-typography': 'styles/typography/',
  'foundations-space-grid': 'foundations/layout/',
  'foundations-iconography': 'styles/iconography/',
  'foundations-voice-content': 'foundations/content-voice/',
  'foundations-motion': 'styles/motion/',
  'foundations-accessibility': 'foundations/accessibility/',
  'foundations-brand': 'styles/brand/',

  // patterns
  'patterns-worklist': 'patterns/worklist/',
  'patterns-status-vocabulary': 'patterns/status-vocabulary/',
  'patterns-message-handling': 'patterns/message-handling/',
  'patterns-empty-states': 'patterns/empty-states/',
  'patterns-selection-and-bulk-actions': 'patterns/selection-and-bulk-actions/',
  'patterns-forms-and-settings': 'patterns/forms-and-settings/',
  'patterns-portal': 'patterns/home-and-tiles/',

  // components: the docs page is the guidance; the stories stay on the react subsite.
  'components-overview': 'components/',
  'components-actions-button': 'components/button/',
  'components-actions-icon-button': 'components/icon-button/',
  'components-actions-action-menu': 'components/action-menu/',
  'components-actions-toolbar': 'components/toolbar/',
  'components-inputs-input': 'components/input/',
  'components-inputs-textarea': 'components/textarea/',
  'components-inputs-select': 'components/select/',
  'components-inputs-multi-select': 'components/multi-select/',
  'components-inputs-checkbox': 'components/checkbox/',
  'components-inputs-switch': 'components/switch/',
  'components-inputs-field': 'components/field/',
  'components-inputs-filter-bar': 'components/filter-bar/',
  'components-data-display-data-table': 'components/data-table/',
  'components-data-display-table-cells': 'components/table-cells/',
  'components-data-display-table': 'components/table/',
  'components-data-display-badge': 'components/badge/',
  'components-data-display-text': 'components/text/',
  'components-data-display-code': 'components/code/',
  'components-data-display-kbd': 'components/kbd/',
  'components-feedback-status-object-status': 'components/status/',
  'components-feedback-status-message-strip': 'components/banner/',
  'components-feedback-status-toast': 'components/toast/',
  'components-feedback-status-illustrated-message': 'components/empty-state/',
  'components-feedback-status-spinner': 'components/spinner/',
  'components-layout-structure-box': 'components/box/',
  'components-layout-structure-stack': 'components/stack/',
  'components-layout-structure-divider': 'components/divider/',
  'components-layout-structure-card': 'components/card/',
  'components-layout-structure-heading': 'components/heading/',
  'components-overlays-modal': 'components/modal/',
  'components-overlays-tooltip': 'components/tooltip/',
  'components-navigation-tabs': 'components/tabs/',
  'components-navigation-filter-tabs': 'components/filter-tabs/',
  'components-navigation-tile': 'patterns/home-and-tiles/#the-tile',
  'components-navigation-tile-group': 'patterns/home-and-tiles/#tile-groups',
};

/** renamed pages of this site: old path -> new path, both relative to the base. */
export const RENAMED = {
  'patterns/launchpad-and-tiles/': 'patterns/home-and-tiles/',
  'patterns/shell-bar/': 'patterns/top-bar/',
  'components/object-status/': 'components/status/',
  'components/message-strip/': 'components/banner/',
  'components/illustrated-message/': 'components/empty-state/',
};

/** renamed entries of the react subsite: old title id -> new title id. */
export const REACT_RENAMED = {
  'components-feedback-status-object-status': 'components-feedback-status-status',
  'components-feedback-status-message-strip': 'components-feedback-status-banner',
  'components-feedback-status-illustrated-message': 'components-feedback-status-empty-state',
};

/**
 * RENAMED as astro's `redirects`: the old path without the base (astro adds
 * it), to the new url with it. a static build writes a page at the old path
 * whose meta refresh leads to the new one.
 *
 * @param {string} base  the site's base, "/design-system/"
 * @returns {Record<string, string>}
 */
export function astroRedirects(base) {
  return Object.fromEntries(
    Object.entries(RENAMED).map(([from, to]) => ['/' + from.replace(/\/$/, ''), base + to]),
  );
}

/**
 * titles whose stories stay on the react subsite: an old /story/ or
 * iframe.html link to one of them keeps its story there. the stories of every
 * other moved title left with its page. a trailing "-" matches a prefix.
 */
export const STORIES_STAY = [
  'components-',
  'patterns-worklist',
  'patterns-portal',
  'patterns-selection-and-bulk-actions',
  'patterns-forms-and-settings',
];

/**
 * where an old url goes, or null when it isn't an old storybook url.
 * self-contained on purpose: the page inlines its source.
 *
 * @param {string} pathname  location.pathname
 * @param {string} search    location.search
 * @param {string} hash      location.hash
 * @param {string} base      the site's base, "/design-system/"
 * @param {Record<string, string>} moved
 * @param {string[]} stay
 * @returns {string | null}
 */
export function resolveOld(pathname, search, hash, base, moved, stay) {
  var params = new URLSearchParams(search);
  var iframe = /\/iframe\.html$/.test(pathname);
  var entry, docs;
  if (iframe) {
    entry = params.get('id') || '';
    docs = params.get('viewMode') === 'docs';
  } else {
    var path = params.get('path');
    if (path === null) return null;
    var m = /^\/(docs|story)\/(.+)$/.exec(path);
    entry = m ? m[2] : '';
    docs = !!m && m[1] === 'docs';
  }
  var title = entry.split('--')[0];
  var target = Object.prototype.hasOwnProperty.call(moved, title) ? moved[title] : null;
  var storiesStay = stay.some(function (s) {
    return s.charAt(s.length - 1) === '-' ? title.indexOf(s) === 0 : title === s;
  });
  if (target !== null && (docs || !storiesStay)) {
    return base + target + (target.indexOf('#') < 0 ? hash : '');
  }
  return base + 'react/' + (iframe ? 'iframe.html' : '') + search + hash;
}

/** the inline script for the home page and iframe.html. */
export function redirectScript(base) {
  return (
    '(function(){var t=(' +
    resolveOld.toString() +
    ')(location.pathname,location.search,location.hash,' +
    JSON.stringify(base) +
    ',' +
    JSON.stringify(MOVED) +
    ',' +
    JSON.stringify(STORIES_STAY) +
    ');if(t)location.replace(t);})();'
  );
}

/**
 * where a link to a renamed entry of the react subsite lands, or null when
 * its entry wasn't renamed. the title id in the entry (?path=/docs/…,
 * ?path=/story/… or iframe.html's ?id=…) becomes the new one; the story, the
 * rest of the query and the hash stay. self-contained on purpose: the
 * subsite inlines its source.
 *
 * @param {string} pathname  location.pathname
 * @param {string} search    location.search
 * @param {string} hash      location.hash
 * @param {Record<string, string>} renamed
 * @returns {string | null}
 */
export function resolveRenamedEntry(pathname, search, hash, renamed) {
  var key = /\/iframe\.html$/.test(pathname) ? 'id' : 'path';
  var parts = search.replace(/^\?/, '').split('&');
  for (var i = 0; i < parts.length; i++) {
    var eq = parts[i].indexOf('=');
    if (eq < 0 || parts[i].slice(0, eq) !== key) continue;
    var value;
    try {
      value = decodeURIComponent(parts[i].slice(eq + 1));
    } catch (e) {
      return null;
    }
    var m = /^(\/(?:docs|story)\/)?([^/]+)$/.exec(value);
    if (!m) return null;
    var title = m[2].split('--')[0];
    if (!Object.prototype.hasOwnProperty.call(renamed, title)) return null;
    parts[i] = key + '=' + (m[1] || '') + renamed[title] + m[2].slice(title.length);
    return pathname + '?' + parts.join('&') + hash;
  }
  return null;
}

/** the inline script for the react subsite's index.html and iframe.html. */
export function reactRedirectScript() {
  return (
    '(function(){var t=(' +
    resolveRenamedEntry.toString() +
    ')(location.pathname,location.search,location.hash,' +
    JSON.stringify(REACT_RENAMED) +
    ');if(t)history.replaceState(history.state,"",t);})();'
  );
}

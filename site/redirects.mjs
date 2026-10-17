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
  'patterns-portal': 'patterns/launchpad-and-tiles/',

  // components
  'components-overview': 'components/',
  'components-navigation-tile': 'patterns/launchpad-and-tiles/#the-tile',
  'components-navigation-tile-group': 'patterns/launchpad-and-tiles/#tile-groups',
};

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

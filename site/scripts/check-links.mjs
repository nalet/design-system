// fails on any broken internal link of the published docs.
//
//   node site/scripts/check-links.mjs            the built site/dist, react subsite included
//   node site/scripts/check-links.mjs --no-react  without site/dist/react (skips its ids)
//
// it checks, in the built output:
//   - every href and src of every html page that points inside /design-system/,
//     and the #fragment it names;
//   - every react subsite link (?path=/docs/<id>, ?path=/story/<id>) against the
//     storybook's own index.json;
// and in the sources:
//   - every link in the storybook mdx (stories/**/*.mdx), both its own ?path=
//     links and its links to the guidelines site;
//   - every target of the old-url redirect map, and every id the 0.3.0 storybook
//     had, resolved the way the home page and iframe.html resolve them.
// stdlib only.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MOVED, STORIES_STAY, resolveOld } from '../redirects.mjs';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const DIST = join(ROOT, 'site/dist');
const BASE = '/design-system/';
const ORIGIN = 'https://nalet.github.io';
const NO_REACT = process.argv.includes('--no-react');

const errors = [];
const fail = (where, message) => errors.push(`${where}: ${message}`);

function walk(dir, test, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, test, out);
    else if (test(path)) out.push(path);
  }
  return out;
}

if (!existsSync(DIST)) {
  console.error('site/dist is missing: run `npm run site:build` first.');
  process.exit(1);
}

// ---- the react subsite's entries -----------------------------------------
const REACT_INDEX = join(DIST, 'react/index.json');
let reactIds = null;
if (existsSync(REACT_INDEX)) {
  reactIds = new Set(Object.keys(JSON.parse(readFileSync(REACT_INDEX, 'utf8')).entries));
} else if (!NO_REACT) {
  console.error('site/dist/react/index.json is missing: build the react subsite into site/dist/react, or pass --no-react.');
  process.exit(1);
}

function checkReactQuery(where, search) {
  const path = new URLSearchParams(search).get('path') ?? new URLSearchParams(search).get('id');
  if (path === null) return;
  const m = /^\/(?:docs|story)\/(.+)$/.exec(path) ?? (/^[a-z0-9-]+--[a-z0-9-]+$/.test(path) ? [path, path] : null);
  if (!m) return fail(where, `unreadable react subsite path "${path}"`);
  if (reactIds && !reactIds.has(m[1])) fail(where, `the react subsite has no entry "${m[1]}"`);
}

// ---- pages and their ids -------------------------------------------------
const pages = walk(DIST, (p) => p.endsWith('.html'));
const idsOf = new Map();
function ids(file) {
  if (!idsOf.has(file)) {
    const html = readFileSync(file, 'utf8');
    idsOf.set(file, new Set([...html.matchAll(/\s(?:id|name)="([^"]+)"/g)].map((m) => m[1])));
  }
  return idsOf.get(file);
}

/** the file a url path is served from, or null. */
function fileFor(pathname) {
  if (!pathname.startsWith(BASE)) return null;
  const rel = decodeURIComponent(pathname.slice(BASE.length));
  const candidates = rel === '' || rel.endsWith('/') ? [join(DIST, rel, 'index.html')] : [join(DIST, rel), join(DIST, rel, 'index.html')];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? null;
}

/** check one internal url (absolute path, query and hash). */
function checkUrl(where, url) {
  const { pathname, search, hash } = url;
  if (pathname === BASE + 'react/' || pathname === BASE + 'react/index.html' || pathname === BASE + 'react/iframe.html') {
    if (search) checkReactQuery(where, search);
    if (!reactIds) return;
  } else if ((pathname === BASE || pathname === BASE + 'index.html') && new URLSearchParams(search).has('path')) {
    return fail(where, `links to an old storybook url (${pathname}${search}); link to its new page`);
  }
  if (!reactIds && pathname.startsWith(BASE + 'react/')) return;
  const file = fileFor(pathname);
  if (!file) return fail(where, `no page at ${pathname}`);
  if (hash && hash !== '#' && file.endsWith('.html') && !pathname.startsWith(BASE + 'react/')) {
    const id = decodeURIComponent(hash.slice(1));
    if (!ids(file).has(id)) fail(where, `${pathname} has no #${id}`);
  }
}

const SKIP = /^(mailto:|tel:|javascript:|data:|blob:)/;
let linkCount = 0;

for (const file of pages) {
  const rel = relative(DIST, file);
  if (rel.startsWith('react/')) continue; // the storybook's own shell: checked through its index
  const pageUrl = new URL(BASE + rel.replace(/index\.html$/, ''), ORIGIN);
  const html = readFileSync(file, 'utf8');
  // inline scripts and json can hold strings that look like attributes.
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (s) => (/\ssrc=/.test(s.slice(0, s.indexOf('>'))) ? s.slice(0, s.indexOf('>') + 1) : ''));
  for (const m of markup.matchAll(/\s(href|src)="([^"]*)"/g)) {
    const raw = m[2].replace(/&amp;/g, '&');
    if (!raw || SKIP.test(raw)) continue;
    let url;
    try {
      url = new URL(raw, pageUrl);
    } catch {
      fail(rel, `unreadable url "${raw}"`);
      continue;
    }
    if (url.origin !== ORIGIN) continue; // another site
    linkCount++;
    if (!url.pathname.startsWith(BASE)) {
      fail(rel, `${raw} points outside ${BASE}`);
      continue;
    }
    checkUrl(`${rel} → ${raw}`, url);
  }
}

// ---- the storybook mdx ---------------------------------------------------
const mdxFiles = walk(join(ROOT, 'stories'), (p) => p.endsWith('.mdx'));
for (const file of mdxFiles) {
  const rel = relative(ROOT, file);
  const text = readFileSync(file, 'utf8');
  for (const m of text.matchAll(/\]\(([^)\s]+)\)|href="([^"]+)"/g)) {
    const raw = m[1] ?? m[2];
    if (raw.startsWith('?path=')) {
      linkCount++;
      checkReactQuery(`${rel} → ${raw}`, raw);
    } else if (raw.startsWith(ORIGIN + BASE) || raw.startsWith(BASE)) {
      linkCount++;
      checkUrl(`${rel} → ${raw}`, new URL(raw, ORIGIN));
    }
  }
}

// ---- the old urls --------------------------------------------------------
for (const [title, target] of Object.entries(MOVED)) {
  checkUrl(`redirect map: ${title}`, new URL(BASE + target, ORIGIN));
}
const old = JSON.parse(readFileSync(join(ROOT, 'site/test/storybook-0.3.0.json'), 'utf8'));
let oldCount = 0;
for (const [kind, list] of [['docs', old.docs], ['story', old.stories]]) {
  for (const id of list) {
    for (const [pathname, search] of [
      [BASE, `?path=/${kind}/${id}`],
      [BASE + 'iframe.html', `?id=${id}&viewMode=${kind === 'docs' ? 'docs' : 'story'}`],
    ]) {
      oldCount++;
      const to = resolveOld(pathname, search, '', BASE, MOVED, STORIES_STAY);
      if (!to) {
        fail(`old url ${pathname}${search}`, 'not redirected');
        continue;
      }
      checkUrl(`old url ${pathname}${search} → ${to}`, new URL(to, ORIGIN));
    }
  }
}

if (errors.length) {
  console.error(errors.map((e) => `  ✗ ${e}`).join('\n'));
  console.error(`\n${errors.length} broken of ${linkCount} links and ${oldCount} old urls.`);
  process.exit(1);
}
console.log(
  `${linkCount} internal links in ${pages.length} pages and ${mdxFiles.length} storybook files, and ${oldCount} old urls: all resolve.` +
    (reactIds ? '' : ' (react subsite ids skipped)'),
);

// the guidelines site: static html, built with the design system itself.
//
//   npm run site:dev     dev server on :4321, at /design-system/
//   npm run site:build   static site -> site/dist/
//
// the react subsite (the storybook) is built separately into site/dist/react/
// by the pages workflow; see .github/workflows/pages.yml.
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import { satteri } from '@astrojs/markdown-satteri';
import { codeTheme } from './src/lib/code-theme.mjs';
import { wrapTables } from './src/lib/wrap-tables.mjs';
import { demoteIncludedHeadings } from './src/lib/included-docs.mjs';
import { astroRedirects } from './redirects.mjs';

const here = (path) => fileURLToPath(new URL(path, import.meta.url));
const BASE = '/design-system/';

export default defineConfig({
  site: 'https://nalet.github.io',
  base: BASE,
  trailingSlash: 'always',
  // a renamed page keeps its old address: see RENAMED in site/redirects.mjs.
  redirects: astroRedirects(BASE),
  // the brand files (icons/, splash-plates/, terminal/) keep the urls the
  // storybook served them at: /design-system/icons/nalet_128.png and so on.
  publicDir: '../assets',
  outDir: './dist',
  devToolbar: { enabled: false },
  integrations: [react(), mdx()],
  markdown: {
    // straight quotes and dashes stay as they are written; the docs quote code.
    processor: satteri({ features: { smartPunctuation: false }, hastPlugins: [wrapTables, demoteIncludedHeadings] }),
    shikiConfig: { theme: codeTheme },
  },
  vite: {
    // the site imports the library, its stories and its tokens from the repo
    // root. "@nalet/design-system" is the library's source, so every page
    // shows the components as they are on this branch, written the way an
    // app imports them.
    resolve: {
      alias: [
        { find: /^@nalet\/design-system$/, replacement: here('../src/index.ts') },
        { find: /^@nalet\/design-system\/tokens\.css$/, replacement: here('../src/styles/tokens.css') },
        { find: /^@site\//, replacement: here('./src/') },
        { find: /^@stories\//, replacement: here('../stories/') },
      ],
    },
    server: { fs: { allow: ['..'] } },
    build: {
      // fonts stay files, never base64 inside the stylesheet.
      assetsInlineLimit: 0,
      // the interactive examples share the storybook portable-stories runtime
      // in one chunk; it is loaded only when an interactive example scrolls into view.
      chunkSizeWarningLimit: 1500,
    },
  },
});

import type { Preview } from '@storybook/react-vite';
import docsTheme from './theme';

// the generated tokens stylesheet: css-vars + @font + base. produced by
// tokens/build.mjs into src/styles/tokens.css. if storybook is started before
// the tokens build has run, run `npm run build-tokens` first.
import '../src/styles/tokens.css';

// dark terminal canvas + brand fonts for the preview iframe + docs.
import './preview.css';

// on docs pages, storybook's docs typography (`.sbdocs …:not(.sb-unstyled *)`)
// outranks a component's own class styles, so a live component written into
// the mdx — in a table cell, say — would take the page's font. every library
// element (class nc-…) on a docs page is marked sb-unstyled, which the docs
// styles skip. docs only: nothing here reaches the library.
if (typeof document !== 'undefined' && typeof MutationObserver !== 'undefined') {
  const mark = (root: ParentNode) => {
    for (const el of Array.from(root.querySelectorAll('[class*="nc-"]:not(.sb-unstyled)'))) {
      el.classList.add('sb-unstyled');
    }
  };
  const start = () => {
    const docs = document.getElementById('storybook-docs');
    if (!docs) return;
    let queued = false;
    mark(docs);
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        mark(docs);
      });
    }).observe(docs, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
}

const preview: Preview = {
  // every component gets a material-style docs page (overview + live examples +
  // auto api table) without a per-story opt-in.
  tags: ['autodocs'],

  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // dark canvas only — nalet has no light theme.
    backgrounds: {
      options: {
        bg: { name: 'bg', value: '#0B0F19' },
        "bg-2": { name: 'bg-2', value: '#0D1117' },
        surface: { name: 'surface', value: '#11161F' }
      }
    },
    docs: {
      // render the docs pages on the same dark/square chrome as the manager.
      theme: docsTheme,
      // right-rail anchor table-of-contents with scroll-spy.
      // headings inside live examples (an illustrated message's title, a tile
      // group's legend) are part of the example, not of the page outline.
      toc: {
        headingSelector: 'h2, h3',
        title: 'on this page',
        ignoreSelector: '.docs-story *, .skip-toc, .dsdoc-dodont *, .dsdoc-example *',
      },
      // real, copy-able tsx snippets under each live example.
      source: { type: 'dynamic', language: 'tsx' },
    },
    options: {
      // the sidebar is the site's table of contents: guidelines first, then
      // the components by role, then the floorplans and patterns built on them.
      storySort: {
        order: [
          'Introduction',
          ['overview', 'getting started', 'changelog'],
          'Foundations',
          [
            'colour',
            'typography',
            'space & grid',
            'iconography',
            'voice & content',
            'motion',
            'accessibility',
            'brand',
          ],
          'Components',
          [
            'overview',
            'actions',
            'inputs',
            'data display',
            'feedback & status',
            'layout & structure',
            'overlays',
            'navigation',
          ],
          'Patterns',
          [
            'worklist',
            'status vocabulary',
            'message handling',
            'empty states',
            'selection and bulk actions',
            'forms and settings',
            'portal',
          ],
        ],
      },
    },
  },

  initialGlobals: {
    backgrounds: {
      value: 'bg'
    }
  }
};

export default preview;

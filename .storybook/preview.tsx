import type { Preview } from '@storybook/react';
import docsTheme from './theme';

// the generated tokens stylesheet: css-vars + @font + base. produced by
// tokens/build.mjs into src/styles/tokens.css. if storybook is started before
// the tokens build has run, run `npm run build-tokens` first.
import '../src/styles/tokens.css';

// dark terminal canvas + brand fonts for the preview iframe + docs.
import './preview.css';

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
      default: 'bg',
      values: [
        { name: 'bg', value: '#0B0F19' },
        { name: 'bg-2', value: '#0D1117' },
        { name: 'surface', value: '#11161F' },
      ],
    },
    docs: {
      // render the docs pages on the same dark/square chrome as the manager.
      theme: docsTheme,
      // right-rail anchor table-of-contents with scroll-spy.
      toc: { headingSelector: 'h2, h3', title: 'on this page' },
      // real, copy-able tsx snippets under each live example.
      source: { type: 'dynamic', language: 'tsx' },
    },
    options: {
      storySort: {
        order: [
          'Foundations',
          ['Guidelines', 'Colors', 'Type', 'Space', 'Brand'],
          'Components',
          ['overview'],
          'Patterns',
          ['portal', 'tile', 'tile group'],
        ],
      },
    },
  },
};

export default preview;

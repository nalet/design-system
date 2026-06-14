import type { Preview } from '@storybook/react';

// the generated tokens stylesheet: css-vars + @font + base. produced by
// tokens/build.mjs into src/styles/tokens.css. if storybook is started before
// the tokens build has run, run `npm run build:tokens` first.
import '../src/styles/tokens.css';

// dark terminal canvas + brand fonts for the preview iframe + docs.
import './preview.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // dark canvas only — nalet.cloud has no light theme.
    backgrounds: {
      default: 'bg',
      values: [
        { name: 'bg', value: '#0B0F19' },
        { name: 'bg-2', value: '#0D1117' },
        { name: 'surface', value: '#11161F' },
      ],
    },
    options: {
      storySort: {
        order: [
          'Foundations',
          ['Guidelines', 'Colors', 'Type', 'Space', 'Brand'],
          'Components',
        ],
      },
    },
  },
};

export default preview;

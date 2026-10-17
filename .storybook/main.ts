import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(ts|tsx)',
    '../src/**/*.stories.@(ts|tsx)',
  ],

  addons: [
    '@storybook/addon-a11y',
    {
      // github-flavoured markdown in the mdx guidelines: tables (keyboard maps,
      // decision tables) and strikethrough.
      name: '@storybook/addon-docs',
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  core: {
    disableTelemetry: true,
  },

  staticDirs: ['../assets'],

  // the storybook is the react subsite of the guidelines: github pages serves
  // it at /design-system/react/ (the guidelines site is /design-system/). without
  // a matching base the built assets resolve at "/" and 404 under the subpath.
  // the dev server is the known-bad subpath case, so allow an env override to
  // run it at "/": `STORYBOOK_BASE_PATH=/ npm run storybook`.
  async viteFinal(cfg) {
    return mergeConfig(cfg, {
      base: process.env.STORYBOOK_BASE_PATH ?? '/design-system/react/',
    });
  }
};

export default config;

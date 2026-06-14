import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(ts|tsx)',
    '../src/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../assets'],

  // github pages serves this project at the /design-system/ subpath. without a
  // matching base the built assets resolve at "/" and 404 under the subpath.
  // the dev server is the known-bad subpath case, so allow an env override to
  // run it at "/": `STORYBOOK_BASE_PATH=/ npm run storybook`.
  async viteFinal(cfg) {
    return mergeConfig(cfg, {
      base: process.env.STORYBOOK_BASE_PATH ?? '/design-system/',
    });
  },
};

export default config;

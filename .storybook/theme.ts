import { create } from '@storybook/theming/create';

// nalet.cloud storybook chrome — dark canvas, mono brand, cloud-blue accent.
export default create({
  base: 'dark',

  brandTitle: '> nalet.cloud / design-system',
  brandUrl: 'https://kb.nalet.cloud/standards/design-system',
  brandTarget: '_blank',

  // canvas
  appBg: '#0B0F19',
  appContentBg: '#0B0F19',
  appPreviewBg: '#0B0F19',
  appBorderColor: '#1F2633',
  appBorderRadius: 0,

  // brand / signal
  colorPrimary: '#58A6FF',
  colorSecondary: '#58A6FF',

  // text
  textColor: '#E6E6E6',
  textInverseColor: '#0B0F19',
  textMutedColor: '#AEB8C2',

  // toolbar
  barTextColor: '#AEB8C2',
  barSelectedColor: '#58A6FF',
  barHoverColor: '#58A6FF',
  barBg: '#0D1117',

  // form controls
  inputBg: '#11161F',
  inputBorder: '#2A3142',
  inputTextColor: '#E6E6E6',
  inputBorderRadius: 0,

  fontBase: '"Inter", system-ui, sans-serif',
  fontCode: '"JetBrains Mono", ui-monospace, monospace',
});

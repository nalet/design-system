// the code block theme: a few token colours, read from tokens/tokens.json so it
// can't drift. calm on purpose: keywords in the action blue, names in cyan,
// strings brighter than the text, comments dim. every colour is a text token,
// so each meets 4.5:1 on --bg-2 (tokens/contrast.test.ts checks them).
import tokens from '../../../tokens/tokens.json' with { type: 'json' };
import { flattenColors } from '../../../tokens/contrast.mjs';

const c = flattenColors(tokens);

export const codeTheme = {
  name: 'nalet',
  type: 'dark',
  colors: {
    'editor.background': c['bg-2'],
    'editor.foreground': c['fg-2'],
  },
  tokenColors: [
    { settings: { foreground: c['fg-2'] } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: c['fg-dim'] } },
    {
      scope: [
        'keyword',
        'storage',
        'storage.type',
        'storage.modifier',
        'keyword.control',
        'keyword.operator.new',
        'keyword.operator.expression',
        'keyword.operator.logical',
        'constant.language',
      ],
      settings: { foreground: c['cloud-blue'] },
    },
    {
      scope: ['string', 'string.quoted', 'string.template', 'punctuation.definition.string', 'constant.numeric'],
      settings: { foreground: c.fg },
    },
    {
      scope: [
        'entity.name.tag',
        'support.class.component',
        'entity.name.type',
        'entity.name.function',
        'support.function',
        'meta.function-call entity.name.function',
        'support.type.property-name.css',
      ],
      settings: { foreground: c['cloud-cyan'] },
    },
    {
      scope: ['punctuation', 'meta.brace', 'keyword.operator', 'entity.other.attribute-name'],
      settings: { foreground: c['fg-muted'] },
    },
  ],
};

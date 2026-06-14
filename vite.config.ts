import { resolve } from 'node:path';
import { copyFileSync, mkdirSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

// Copy the generated token stylesheet into dist so the "./tokens.css" export
// (-> dist/tokens.css) resolves for consumers. tokens.css is emitted by
// `node tokens/build.mjs` (runs before vite via the build/prebuild scripts).
function copyTokensCss(): Plugin {
  return {
    name: 'nalet-copy-tokens-css',
    apply: 'build',
    closeBundle() {
      const src = resolve(__dirname, 'src/styles/tokens.css');
      const outDir = resolve(__dirname, 'dist');
      mkdirSync(outDir, { recursive: true });
      copyFileSync(src, resolve(outDir, 'tokens.css'));
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['**/*.stories.tsx'],
      rollupTypes: false,
    }),
    copyTokensCss(),
  ],
  build: {
    target: 'es2021',
    cssCodeSplit: true,
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        tokens: resolve(__dirname, 'src/tokens.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      // never bundle the host's React or icon library
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'lucide-react',
      ],
      output: {
        preserveModules: false,
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});

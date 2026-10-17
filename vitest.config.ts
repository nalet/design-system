import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// unit + accessibility tests. jsdom renders the components; axe-core checks
// each rendered state (colour contrast is not computable in jsdom — the token
// test covers it, and the storybook a11y addon checks it in a real browser).
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tokens/**/*.test.ts'],
  },
});

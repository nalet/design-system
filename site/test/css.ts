import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// The rules of every stylesheet in the library and the site, for the tests that
// guard what all of them keep to.
const ROOT = process.cwd(); // vitest runs from the repository root
const DIRS = ['src', join('site', 'src')];

export interface CssRule {
  file: string;
  selector: string;
  body: string;
}

function cssFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...cssFiles(p));
    else if (name.endsWith('.css')) out.push(p);
  }
  return out;
}

export function cssRules(): CssRule[] {
  const rules: CssRule[] = [];
  for (const file of DIRS.flatMap((d) => cssFiles(join(ROOT, d)))) {
    const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    for (const [, selector, body] of css.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
      rules.push({ file: relative(ROOT, file), selector: selector.trim(), body });
    }
  }
  return rules;
}

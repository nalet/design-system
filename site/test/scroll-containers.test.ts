import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// A box that scrolls sideways must also be a positioned box. Text hidden for
// screen readers (`nc-sr-only`) is absolutely positioned; inside a scroll box
// that is not positioned, it escapes the box and widens the whole page — on a
// phone the page then scrolls sideways (Safari) or zooms out (Chrome).
const ROOT = process.cwd(); // vitest runs from the repository root
const DIRS = ['src', join('site', 'src')];

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

describe('scroll containers', () => {
  it('every box that scrolls is positioned, so nothing inside can widen the page', () => {
    const offenders: string[] = [];
    for (const file of DIRS.flatMap((d) => cssFiles(join(ROOT, d)))) {
      const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
      for (const m of css.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
        const [, selector, body] = m;
        if (/overflow(-x|-y)?\s*:\s*(auto|scroll)\b/.test(body) && !/\bposition\s*:/.test(body)) {
          offenders.push(`${relative(ROOT, file)}: ${selector.trim()}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});

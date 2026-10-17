// the contrast tables on the colour page, generated from tokens/tokens.json by
// the same policy the token test enforces (tokens/contrast.mjs). nothing here
// is typed by hand: change a token and the table changes with it.
import tokens from '../../../tokens/tokens.json';
import {
  BACKGROUNDS,
  EXEMPT,
  TEXT,
  contrastReport,
  flattenColors,
  type ContrastRow,
} from '../../../tokens/contrast.mjs';
import '../../../src/lib/a11y.css';

const colors = flattenColors(tokens);
const report = contrastReport(colors);

/** a rule's name as the start of a caption, which is set in the body face. */
const sentence = (rule: string) => (rule.charAt(0).toUpperCase() + rule.slice(1)).replace(/\bui\b/, 'UI');

function Verdict({ row }: { row: ContrastRow }) {
  return (
    <span className={row.pass ? 'ds-cpass' : 'ds-cfail'}>
      {row.ratio.toFixed(2)}
      <span className="nc-sr-only">{row.pass ? ', passes' : `, fails: needs ${row.min}`}</span>
      <span aria-hidden="true">{row.pass ? ' ✓' : ' ✗'}</span>
    </span>
  );
}

/** every text token on every background: the matrix the test walks. */
export function TextContrastMatrix() {
  const at = (fg: string, bg: string) => report.find((r) => r.rule === 'text' && r.fg === fg && r.bg === bg)!;
  return (
    <div className="ds-table-frame">
    <table className="ds-ctable">
      <caption>Text on every background — each cell needs 4.5:1 (WCAG 2.2 AA, any size)</caption>
      <thead>
        <tr>
          <th scope="col">text token</th>
          {BACKGROUNDS.map((bg) => (
            <th key={bg} scope="col">
              <span className="ds-cswatch" style={{ background: colors[bg] }} aria-hidden="true" />
              --{bg}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {TEXT.map((fg) => (
          <tr key={fg}>
            <th scope="row">
              <span className="ds-cswatch" style={{ background: colors[fg] }} aria-hidden="true" />
              --{fg}
            </th>
            {BACKGROUNDS.map((bg) => (
              <td key={bg} className="ds-cnum" style={{ background: colors[bg] }}>
                <span className="ds-csample" style={{ color: colors[fg] }} aria-hidden="true">
                  Aa
                </span>{' '}
                <Verdict row={at(fg, bg)} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

/** the other rules: state text on its tint, body text on tints, non-text ui, fills. */
export function OtherContrastRules() {
  const rules = Array.from(new Set(report.filter((r) => r.rule !== 'text').map((r) => r.rule)));
  return (
    <>
      {rules.map((rule) => (
        <div key={rule} className="ds-table-frame">
        <table className="ds-ctable">
          <caption>
            {sentence(rule)} — needs {report.find((r) => r.rule === rule)!.min}:1
          </caption>
          <thead>
            <tr>
              <th scope="col">foreground</th>
              <th scope="col">on</th>
              <th scope="col">sample</th>
              <th scope="col">ratio</th>
            </tr>
          </thead>
          <tbody>
            {report
              .filter((r) => r.rule === rule)
              .map((r) => (
                <tr key={`${r.fg}|${r.bg}`}>
                  <td>--{r.fg}</td>
                  <td>--{r.bg}</td>
                  <td style={{ background: colors[r.bg] }}>
                    {rule === 'non-text ui' ? (
                      <span
                        aria-hidden="true"
                        style={{ display: 'inline-block', width: 40, height: 14, border: `2px solid ${colors[r.fg]}` }}
                      />
                    ) : (
                      <span className="ds-csample" style={{ color: colors[r.fg] }}>
                        sample text
                      </span>
                    )}
                  </td>
                  <td className="ds-cnum">
                    <Verdict row={r} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        </div>
      ))}
    </>
  );
}

/** what the policy deliberately leaves out, and why. */
export function ContrastExemptions() {
  return (
    <div className="ds-table-frame">
    <table className="ds-ctable">
      <caption>Outside the policy, on purpose</caption>
      <thead>
        <tr>
          <th scope="col">tokens</th>
          <th scope="col">why</th>
        </tr>
      </thead>
      <tbody>
        {EXEMPT.map((e) => (
          <tr key={e.tokens.join()}>
            <td>{e.tokens.map((t) => `--${t}`).join(', ')}</td>
            <td style={{ fontFamily: 'var(--ff-ui)' }}>{e.why}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

/** how many pairs are checked, and how many pass. */
export function ContrastSummary() {
  const pass = report.filter((r) => r.pass).length;
  const lowest = report.filter((r) => r.rule === 'text').sort((a, b) => a.ratio - b.ratio)[0];
  return (
    <p>
      {report.length} pairs checked, {pass} pass. The tightest text pair is <code>--{lowest.fg}</code> on{' '}
      <code>--{lowest.bg}</code> at {lowest.ratio.toFixed(2)}:1.
    </p>
  );
}

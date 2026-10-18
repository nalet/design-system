// storyboard drawings for loading and progress: nothing for a blink, the
// loader where the result will appear, a value when progress is known, and
// the shape of the content for a list.
import { Arrow, Block, Button, Line, Loader, Progress, Sketch, Status, Word } from './kit';

function Label({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <Word x={x} y={y} size="xs" tone="dim" mono={false} anchor="middle">
      {children}
    </Word>
  );
}

/** a skeleton list: a title block and rows of blocks, as long as the rows will be. */
function SkeletonRows({ x, y, w, n = 4 }: { x: number; y: number; w: number; n?: number }) {
  return (
    <g>
      <Block x={x} y={y} w={w * 0.4} h={6} />
      {Array.from({ length: n }, (_, i) => (
        <g key={i}>
          <Block x={x} y={y + 14 + i * 12} w={w * [0.62, 0.5, 0.58, 0.45, 0.55][i % 5]} h={5} />
          <Block x={x + w * 0.72} y={y + 14 + i * 12} w={w * 0.24} h={5} />
        </g>
      ))}
    </g>
  );
}

export function LoadingOverview() {
  return (
    <Sketch h={170} label="Four ways to show a wait. A blue button with a small loader before its label, saving changes. A panel with a larger loader and the line Loading the episode list. A progress bar, 62% · 1.4 of 2.2 gb. And grey blocks in the shape of a list that is about to appear.">
      <rect className="sk-screen" x={4} y={4} width={152} height={62} />
      <Button x={30} y={29} w={100} primary />
      <g className="sk-on-accent">
        <Loader x={38} y={31.5} s={6} />
      </g>
      <Word x={50} y={37.5} size="xs" tone="inverse">
        saving changes
      </Word>
      <Label x={80} y={80}>
        In a button
      </Label>
      <rect className="sk-screen" x={164} y={4} width={152} height={62} />
      <Loader x={233} y={18} s={14} />
      <Word x={240} y={50} size="xs" tone="dim" mono={false} anchor="middle">
        Loading the episode list
      </Word>
      <Label x={240} y={80}>
        In a panel
      </Label>
      <rect className="sk-screen" x={4} y={90} width={152} height={62} />
      <Progress x={20} y={114} w={120} value={0.62} />
      <Word x={20} y={132} size="xs" tone="strong">
        62% · 1.4 of 2.2 gb
      </Word>
      <Label x={80} y={166}>
        Progress that is known
      </Label>
      <rect className="sk-screen" x={164} y={90} width={152} height={62} />
      <SkeletonRows x={176} y={100} w={128} n={3} />
      <Label x={240} y={166}>
        A list that loads
      </Label>
    </Sketch>
  );
}

export function LoaderSizes() {
  return (
    <Sketch h={84} label="The loader at three sizes: small in a button, larger in a panel, largest in a player. Each is a faint square frame with three sides lit in blue; the gap runs round the frame.">
      <Loader x={56} y={30} s={8} />
      <Loader x={152} y={22} s={16} />
      <Loader x={248} y={14} s={24} />
      <Label x={60} y={68}>
        In a button
      </Label>
      <Label x={160} y={68}>
        In a panel
      </Label>
      <Label x={260} y={68}>
        In a player
      </Label>
    </Sketch>
  );
}

export function WaitFirst() {
  const frames = [
    { label: 'Under 0.4 s: nothing' },
    { label: 'After it: the loader' },
    { label: 'Done: the content' },
  ];
  return (
    <Sketch h={120} label="A storyboard in three frames along a time line. Under 0.4 seconds, the panel shows nothing new. After that, a loader appears where the content will be. When it is done, the content replaces the loader.">
      {frames.map((f, i) => {
        const x = 4 + i * 108;
        return (
          <g key={f.label}>
            <rect className="sk-screen" x={x} y={6} width={96} height={66} />
            {i === 1 ? <Loader x={x + 41} y={26} s={14} /> : null}
            {i === 2 ? (
              <g>
                <Line x={x + 10} y={18} w={50} strong />
                {[0, 1, 2].map((r) => (
                  <g key={r}>
                    <Line x={x + 10} y={32 + r * 12} w={[44, 36, 40][r]} />
                    <Status x={x + 62} y={30.5 + r * 12} tone="neutral" glyph />
                  </g>
                ))}
              </g>
            ) : null}
            <Label x={x + 48} y={112}>
              {f.label}
            </Label>
          </g>
        );
      })}
      <Arrow x1={4} y1={90} x2={314} y2={90} />
      <line className="sk-arrow" x1={106} x2={106} y1={85} y2={95} />
      <Word x={106} y={82} size="xs" tone="dim" anchor="middle">
        0.4 s
      </Word>
    </Sketch>
  );
}

export function ProgressDo() {
  return (
    <Sketch w={200} h={56} label="A progress bar, a little over half full, with the value in words: 62% · 1.4 of 2.2 gb.">
      <Progress x={20} y={18} w={160} value={0.62} />
      <Word x={20} y={38} size="xs" tone="strong">
        62% · 1.4 of 2.2 gb
      </Word>
    </Sketch>
  );
}

export function ProgressDont() {
  return (
    <Sketch w={200} h={56} label="A copy whose progress is known, shown only as a loader that runs round and round.">
      <Loader x={93} y={14} s={14} />
      <Word x={100} y={46} size="xs" tone="dim" mono={false} anchor="middle">
        Copying
      </Word>
    </Sketch>
  );
}

export function SkeletonDo() {
  return (
    <Sketch w={240} h={110} label="A list loading for the first time, drawn as grey blocks in the shape of its title and its rows.">
      <rect className="sk-screen" x={1} y={1} width={238} height={108} />
      <SkeletonRows x={14} y={14} w={210} n={6} />
    </Sketch>
  );
}

export function LoaderInSpaceDont() {
  return (
    <Sketch w={240} h={110} label="A list loading for the first time, drawn as one loader in the middle of empty space.">
      <rect className="sk-screen" x={1} y={1} width={238} height={108} />
      <Loader x={112} y={47} s={16} />
    </Sketch>
  );
}

export function Refreshing() {
  return (
    <Sketch h={104} label="A list that refreshes: its rows stay in place at full strength, and a short blue line runs along its top edge.">
      <rect className="sk-screen" x={1} y={1} width={318} height={102} />
      <Line x={14} y={12} w={80} strong />
      <line className="sk-rule" x1={12} x2={308} y1={24} y2={24} />
      <rect className="sk-fill-info" x={84} y={23} width={70} height={2} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <Line x={14} y={32 + i * 14} w={[90, 70, 84, 64, 76][i]} strong />
          <Status x={220} y={31 + i * 14} tone="neutral" text="missing" glyph />
        </g>
      ))}
    </Sketch>
  );
}

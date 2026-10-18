// storyboard drawings for the interaction foundation: the keyboard's way
// through a page. each component is one tab stop, and the arrow keys move
// inside it; without that, tab stops at every control on the page.
import { Box, Button, Callout, Chevron, Dots, Line, Marker, Screen, Sketch, Word } from './kit';

const ROWS = [86, 104, 122, 140];

/** a page with a search field, a toolbar, a table of four rows and a show-more button. */
function Page({ focusedRow }: { focusedRow?: boolean }) {
  return (
    <g>
      <Screen />
      <Chevron x={8} y={5} />
      <Line x={20} y={7} w={40} strong />
      <rect className="sk-button" x={30} y={30} width={110} height={12} />
      <Line x={36} y={34} w={50} />
      <Button x={196} y={31} w={30} />
      <Button x={230} y={31} w={30} />
      <Button x={264} y={31} w={40} primary />
      <rect className="sk-card" x={30} y={62} width={274} height={90} />
      <Line x={52} y={68} w={40} strong />
      <line className="sk-rule" x1={30} x2={304} y1={76} y2={76} />
      {ROWS.map((y, i) => (
        <g key={y}>
          {focusedRow && i === 0 ? <Marker x={30} y={y - 6} h={16} /> : null}
          <Box x={38} y={y - 2} w={7} h={7} />
          <Line x={52} y={y} w={i % 2 ? 110 : 140} />
          <Dots x={286} y={y + 1} />
        </g>
      ))}
      <Button x={127} y={164} w={70} />
    </g>
  );
}

export function OneTabStopEach() {
  return (
    <Sketch label="A page with a search field, a toolbar, a table and a show-more button. Tab stops four times, once per component; the arrow keys move between the toolbar's buttons and between the table's rows.">
      <Page focusedRow />
      <Callout x={18} y={36} n={1} />
      <Callout x={184} y={37} n={2} />
      <Word x={250} y={56} size="sm" tone="accent" anchor="middle">← →</Word>
      <Callout x={18} y={88} n={3} />
      <Word x={18} y={110} size="sm" tone="accent" anchor="middle">↑</Word>
      <Word x={18} y={124} size="sm" tone="accent" anchor="middle">↓</Word>
      <Callout x={115} y={170} n={4} />
    </Sketch>
  );
}

export function TabStopEverywhere() {
  const stops: [number, number][] = [
    [18, 36],
    [211, 24],
    [245, 24],
    [284, 24],
    ...ROWS.flatMap((y): [number, number][] => [
      [18, y + 2],
      [311, y + 2],
    ]),
    [115, 170],
  ];
  return (
    <Sketch label="The same page where Tab stops at every control: the search field, each toolbar button, every row's checkbox and menu, and the show-more button, thirteen stops in all.">
      <Page />
      {stops.map(([x, y], i) => (
        <Callout key={`${x}-${y}`} x={x} y={y} n={i + 1} />
      ))}
    </Sketch>
  );
}

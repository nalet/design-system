// storyboard drawings for forms and settings: switches that apply at once,
// a form that waits for save, and errors that show when people save.
import type { ReactNode } from 'react';
import { Arrow, Banner, Callout, Checkbox, Chevron, Field, FocusRing, LabelButton, Line, Pointer, Screen, Sketch, Status, Toast, Toggle, Word } from './kit';

/** the footer of a form: the unsaved-changes signal, cancel, and the one emphasized save. */
function Footer({ x, y, right, unsaved = true }: { x: number; y: number; right: number; unsaved?: boolean }) {
  return (
    <g>
      {unsaved ? <Status x={x} y={y + 3} tone="info" text="unsaved changes" glyph /> : null}
      <Word x={right - 118} y={y + 8} size="xs" tone="strong">
        cancel
      </Word>
      <LabelButton x={right - 73} y={y} text="save changes" primary />
    </g>
  );
}

/** a settings page: a card of switches that apply at once, and a form that waits for save. */
function SettingsPage({ callouts }: { callouts?: boolean }) {
  return (
    <g>
      <Screen h={262} />
      <Chevron x={8} y={5} />
      <Line x={20} y={7} w={36} strong />
      <Word x={14} y={36} size="md" tone="strong">
        backup settings
      </Word>
      <Line x={14} y={43} w={120} />
      <rect className="sk-card" x={12} y={54} width={296} height={50} />
      <Word x={20} y={67} size="xs" tone="strong">
        alerts
      </Word>
      <Toggle x={20} y={74} on />
      <Word x={40} y={81} size="xs" tone="strong" mono={false}>
        Email me when a backup fails
      </Word>
      <Toggle x={20} y={88} />
      <Word x={40} y={95} size="xs" tone="strong" mono={false}>
        Weekly summary
      </Word>
      <rect className="sk-card" x={12} y={114} width={296} height={140} />
      <Word x={20} y={127} size="xs" tone="strong">
        schedule
      </Word>
      <Field x={20} y={136} w={130} label={40} value={44} />
      <Field x={160} y={136} w={130} label={56} value={20} />
      <Line x={20} y={170} w={50} strong />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Checkbox x={20} y={178 + i * 13} state={i === 1 ? 'off' : 'on'} />
          <Line x={33} y={179.5 + i * 13} w={[70, 56, 80][i]} />
        </g>
      ))}
      <line className="sk-rule" x1={12} x2={308} y1={222} y2={222} />
      <Footer x={20} y={231} right={300} />
      {callouts ? (
        <g>
          <Callout x={142} y={32} n={1} />
          <Pointer x1={136} y1={32} x2={127} y2={32} />
          <Callout x={296} y={79} n={2} />
          <Callout x={296} y={127} n={3} />
          <Callout x={110} y={135} n={4} />
          <Pointer x1={110} y1={141} x2={110} y2={143} />
          <Callout x={140} y={186} n={5} />
          <Pointer x1={134} y1={186} x2={116} y2={186} />
          <Callout x={142} y={236} n={6} />
        </g>
      ) : null}
    </g>
  );
}

export function SettingsOverview() {
  return (
    <Sketch h={266} label="A settings page, backup settings. At the top, a card of switches, alerts, that apply at once and have no save button. Below, a form, schedule, with two fields and three checkboxes, and a footer that says unsaved changes, with cancel and a blue save changes button.">
      <SettingsPage />
    </Sketch>
  );
}

export function SettingsAnatomy() {
  return (
    <Sketch h={266} label="The settings page, close up: 1 the page title, 2 the card of switches that apply at once, 3 the form, 4 its fields, 5 a group of options, 6 the footer with unsaved changes, cancel and save changes.">
      <SettingsPage callouts />
    </Sketch>
  );
}

/* ---- the story of a save with errors ----------------------------------------------- */

export function ValidationStory() {
  const frame = (x: number, after: boolean) => (
    <g>
      <rect className="sk-screen" x={x} y={1} width={150} height={150} />
      {after ? <Banner x={x + 8} y={9} w={134} tone="err" text={0.6} /> : null}
      <Field x={x + 10} y={after ? 34 : 14} w={130} label={40} value={after ? 20 : 20} invalid={after} />
      {after ? <FocusRing x={x + 10} y={41} w={130} h={11} /> : null}
      <Field x={x + 10} y={after ? 70 : 46} w={130} label={50} value={30} />
      <Field x={x + 10} y={after ? 98 : 78} w={130} label={36} value={10} invalid={after} />
      <LabelButton x={x + 67} y={after ? 132 : 128} text="save changes" primary />
    </g>
  );
  return (
    <Sketch h={170} label="Two frames. Before saving, the form shows no errors, even though two values are wrong. After pressing save, a red summary at the top counts what needs a fix, the two fields turn red with their errors under them, and the focus is on the first one.">
      {frame(1, false)}
      <Arrow x1={155} y1={76} x2={166} y2={76} />
      {frame(169, true)}
      <Word x={76} y={166} size="xs" tone="dim" mono={false} anchor="middle">
        While people type: no errors
      </Word>
      <Word x={244} y={166} size="xs" tone="dim" mono={false} anchor="middle">
        On save: errors, focus on the first
      </Word>
    </Sketch>
  );
}

/* ---- do and don't ------------------------------------------------------------------ */

export function CheckboxInForm() {
  return (
    <Sketch w={200} h={60} label="In a form, an option drawn as a checkbox, Back up configuration, with a blue save changes button below it.">
      <Checkbox x={20} y={12} state="on" />
      <Word x={33} y={18.5} size="xs" tone="strong" mono={false}>
        Back up configuration
      </Word>
      <LabelButton x={20} y={36} text="save changes" primary />
    </Sketch>
  );
}

export function SwitchAboveSave() {
  return (
    <Sketch w={200} h={60} label="A switch, Back up configuration, placed above a blue save changes button.">
      <Toggle x={20} y={11.5} on />
      <Word x={40} y={18.5} size="xs" tone="strong" mono={false}>
        Back up configuration
      </Word>
      <LabelButton x={20} y={36} text="save changes" primary />
    </Sketch>
  );
}

export function OneEmphasis() {
  return (
    <Sketch w={220} h={34} label="A footer: unsaved changes, a quiet cancel, and one blue save changes button.">
      <Footer x={8} y={12} right={212} />
    </Sketch>
  );
}

export function TwoEmphasized() {
  return (
    <Sketch w={220} h={34} label="A footer with two blue buttons side by side: cancel and save changes.">
      <LabelButton x={84} y={12} text="cancel" primary />
      <LabelButton x={134} y={12} text="save changes" primary />
    </Sketch>
  );
}

export function SaveEnabled() {
  return (
    <Sketch w={220} h={34} label="A footer that says unsaved changes, with the save changes button ready to press.">
      <Status x={8} y={15} tone="info" text="unsaved changes" glyph />
      <LabelButton x={134} y={12} text="save changes" primary />
    </Sketch>
  );
}

export function SaveDisabled() {
  return (
    <Sketch w={220} h={34} label="A save changes button that is greyed out, with nothing saying why.">
      <g className="sk-faded">
        <LabelButton x={134} y={12} text="save changes" primary />
      </g>
    </Sketch>
  );
}

function FormBit({ children, label }: { children?: ReactNode; label: string }) {
  return (
    <Sketch w={240} h={110} label={label}>
      <rect className="sk-screen" x={1} y={1} width={238} height={108} />
      {children}
    </Sketch>
  );
}

export function SaveFailedStrip() {
  return (
    <FormBit label="At the top of a form, a red banner says the settings couldn't be saved, with a try again button. The fields below keep what people typed.">
      <Banner x={10} y={10} w={220} tone="err" text={0.5} action />
      <Field x={14} y={36} w={100} label={40} value={50} />
      <Field x={126} y={36} w={100} label={50} value={30} />
      <Field x={14} y={66} w={100} label={36} value={40} />
    </FormBit>
  );
}

export function SaveFailedToast() {
  return (
    <FormBit label="A form whose save failed, with only a short red message in the corner: Couldn't save the settings. It will leave on its own.">
      <Field x={14} y={12} w={100} label={40} value={50} />
      <Field x={126} y={12} w={100} label={50} value={30} />
      <Field x={14} y={42} w={100} label={36} value={40} />
      <Toast x={96} y={84} w={134} tone="err" lines={["Couldn't save the settings"]} />
    </FormBit>
  );
}

export function SavedToast() {
  return (
    <FormBit label="A form after a save, with a short message in the corner: Settings saved. It leaves on its own.">
      <Field x={14} y={12} w={100} label={40} value={50} />
      <Field x={126} y={12} w={100} label={50} value={30} />
      <Field x={14} y={42} w={100} label={36} value={40} />
      <Toast x={130} y={84} w={100} lines={['Settings saved']} />
    </FormBit>
  );
}

export function SavedStrip() {
  return (
    <FormBit label="A form after a save, with a green banner at the top that says Settings saved and stays there.">
      <Banner x={10} y={10} w={220} tone="ok" text={0.3} />
      <Field x={14} y={36} w={100} label={40} value={50} />
      <Field x={126} y={36} w={100} label={50} value={30} />
      <Field x={14} y={66} w={100} label={36} value={40} />
    </FormBit>
  );
}

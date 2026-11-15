// the do and don't examples of the slider page. a field wires its label, hint
// and error to its control by cloning it, so the pair is composed here, in
// react, and rendered as static html. the words stay in the page, as plain props.
import { Field, Slider, type SliderProps } from '@nalet/design-system';

const frame = { width: '100%', maxWidth: '20rem' };
const percent = (n: number) => `${n}%`;

/** a slider in a field: the label, a hint or an error, and the slider's own props. `percent` writes its value as a share. */
export function SliderField({
  label,
  hint,
  error,
  percent: asPercent,
  ...slider
}: SliderProps & { label: string; hint?: string; error?: string; percent?: boolean }) {
  return (
    <div style={frame}>
      <Field label={label} hint={hint} error={error}>
        <Slider formatValue={asPercent ? percent : undefined} {...slider} />
      </Field>
    </div>
  );
}

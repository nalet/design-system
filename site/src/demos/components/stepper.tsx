// the do and don't examples of the stepper page. a field wires its label, hint
// and error to its control by cloning it, so the pair is composed here, in
// react, and rendered as static html. the words stay in the page, as plain props.
import { Field, Stepper, type StepperProps } from '@nalet/design-system';

const frame = { width: '100%', maxWidth: '20rem' };

/** a stepper in a field: the label, a hint or an error, and the stepper's own props. */
export function StepperField({
  label,
  hint,
  error,
  ...stepper
}: StepperProps & { label: string; hint?: string; error?: string }) {
  return (
    <div style={frame}>
      <Field label={label} hint={hint} error={error}>
        <Stepper {...stepper} />
      </Field>
    </div>
  );
}

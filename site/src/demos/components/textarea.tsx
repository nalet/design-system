// the do and don't examples of the textarea page. a field wires its label,
// hint and error to its control by cloning it, so the pair is composed here,
// in react, and rendered as static html. the words stay in the page, as plain
// props. (the input in a field, for the one-line example, is in ./input.)
import { Field, Textarea, type TextareaProps } from '@nalet/design-system';

const frame = { width: '100%', maxWidth: 420 };

/** a textarea in a field: the label, a hint or an error, and the textarea's own props. */
export function TextareaField({
  label,
  hint,
  error,
  ...textarea
}: TextareaProps & { label: string; hint?: string; error?: string }) {
  return (
    <div style={frame}>
      <Field label={label} hint={hint} error={error}>
        <Textarea {...textarea} />
      </Field>
    </div>
  );
}

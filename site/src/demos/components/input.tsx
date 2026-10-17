// the do and don't examples of the input page. a field wires its label, hint
// and error to its control by cloning it, so the pair is composed here, in
// react, and rendered as static html. the words stay in the page, as plain props.
import { Field, Input, type InputProps } from '@nalet/design-system';

const frame = { width: '100%', maxWidth: 320 };

/** an input in a field: the label, a hint or an error, and the input's own props. */
export function InputField({
  label,
  hint,
  error,
  ...input
}: InputProps & { label: string; hint?: string; error?: string }) {
  return (
    <div style={frame}>
      <Field label={label} hint={hint} error={error}>
        <Input {...input} />
      </Field>
    </div>
  );
}

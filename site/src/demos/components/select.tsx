// the do and don't examples of the select page. a field wires its label, hint
// and error to its control by cloning it, so the pair is composed here, in
// react, and rendered as static html: a native select needs no script. the
// words stay in the page, as plain props.
import { Field, Select, type SelectProps } from '@nalet/design-system';

const frame = { width: '100%', maxWidth: 320 };

/** a select in a field: the label, a hint or an error, and the select's own props. */
export function SelectField({
  label,
  hint,
  error,
  ...select
}: SelectProps & { label: string; hint?: string; error?: string }) {
  return (
    <div style={frame}>
      <Field label={label} hint={hint} error={error}>
        <Select {...select} />
      </Field>
    </div>
  );
}

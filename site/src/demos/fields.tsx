// fields for the guideline pages. a field wires its label, hint and error to
// its control, so it is composed here, in react, and rendered as static html.
import { Field, Input } from '@nalet/design-system';

/** a field with an error, as message handling shows it. */
export function FieldWithError({
  label,
  value,
  error,
  hint,
}: {
  label: string;
  value: string;
  error?: string;
  hint?: string;
}) {
  return (
    <div style={{ width: '100%', maxWidth: 320 }}>
      <Field label={label} hint={hint} error={error}>
        <Input defaultValue={value} />
      </Field>
    </div>
  );
}

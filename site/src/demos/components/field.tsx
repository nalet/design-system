// the do and don't examples of the field page. a field wires its label, hint
// and error to its control by cloning it, so it is composed here, in react,
// and rendered as static html. the words stay in the page, as plain props.
import { Checkbox, Field, Input } from '@nalet/design-system';

const frame = { width: '100%', maxWidth: 320 };

/** a field around an input: a label, a hint or an error, and a value or a placeholder. */
export function InputField({
  label,
  hint,
  error,
  value,
  placeholder,
}: {
  label: string;
  hint?: string;
  error?: string;
  value?: string;
  placeholder?: string;
}) {
  return (
    <div style={frame}>
      <Field label={label} hint={hint} error={error}>
        <Input defaultValue={value} placeholder={placeholder} />
      </Field>
    </div>
  );
}

/** a field around a checkbox: the hint, and a field label only where a don't needs one. */
export function CheckboxField({ checkbox, hint, label }: { checkbox: string; hint?: string; label?: string }) {
  return (
    <div style={frame}>
      <Field label={label} hint={hint}>
        <Checkbox label={checkbox} />
      </Field>
    </div>
  );
}

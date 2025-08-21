import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface FormFieldProps {
  id: string;
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  label: string;
  error?: string;
}

export function FormField({
  id,
  name,
  type,
  required = false,
  defaultValue,
  label,
  error,
}: FormFieldProps) {
  return (
    <div data-slot="form-item" className="grid gap-2">
      <Label
        data-slot="form-label"
        data-error={error !== undefined}
        className="data-[error=true]:text-destructive"
        htmlFor={id}
      >
        {label}:
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={error !== undefined}
      />
      {error && (
        <p data-slot="form-message" className="text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  );
}

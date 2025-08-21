import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface FormFieldProps {
  id: string;
  type: string;
  placeHolder?: string;
  required: boolean;
  defaultValue?: string;
  label: string;
  error?: string;
}

export function FormField({
  id,
  type,
  placeHolder,
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
        name={id}
        type={type}
        required={required}
        placeholder={placeHolder ?? label}
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

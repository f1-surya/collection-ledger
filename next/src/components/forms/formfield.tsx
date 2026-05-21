import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface FormFieldProps {
  id: string;
  type?: string;
  placeHolder?: string;
  required?: boolean;
  defaultValue?: string;
  label: string;
  error?: string;
  disabled?: boolean;
}

export function FormField({
  id,
  type = "text",
  placeHolder,
  required = false,
  defaultValue,
  label,
  error,
  disabled,
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
        disabled={disabled}
      />
      {error && (
        <p data-slot="form-message" className="text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  );
}

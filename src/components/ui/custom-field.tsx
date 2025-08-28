import type { ComponentProps, HTMLInputTypeAttribute } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FormFieldComponentProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute | "textarea";
  required?: boolean;
} & (
  | {
      type?: HTMLInputTypeAttribute;
      inputProps?: Omit<ComponentProps<typeof Input>, "placeholder">;
    }
  | {
      type: "textarea";
      textareaProps?: Omit<ComponentProps<typeof Textarea>, "placeholder">;
    }
);

export function CustomFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder,
  type = "input",
  required,
  ...props
}: FormFieldComponentProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && "*"}:
          </FormLabel>
          <FormControl>
            {type !== "textarea" ? (
              <Input
                {...field}
                placeholder={placeholder}
                required={required}
                type={type}
                {...("inputProps" in props ? props.inputProps : {})}
              />
            ) : (
              <Textarea
                {...field}
                placeholder={placeholder}
                required={required}
                {...("textareaProps" in props ? props.textareaProps : {})}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

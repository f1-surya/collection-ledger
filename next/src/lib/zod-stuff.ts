import z, { type ZodError } from "zod";

export const connectionSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Name should contain at least 4 characterns" })
    .trim()
    .toUpperCase(),
  phoneNumber: z
    .string()
    .min(10, { message: "Not a valid phone number" })
    .trim()
    .optional(),
  boxNumber: z
    .string()
    .min(10, { message: "Smartcard should be at least 10 characters long" })
    .trim()
    .toUpperCase(),
  area: z.nanoid({ message: "Required field" }),
  basePack: z.nanoid({ message: "Required field" }),
});

export const connectionUpdateSchema = z.object({
  id: z.nanoid(),
  name: z
    .string()
    .min(4, { message: "Name should contain at least 4 characterns" })
    .trim()
    .toUpperCase(),
  phoneNumber: z
    .string()
    .min(10, { message: "Not a valid phone number" })
    .trim()
    .optional(),
  boxNumber: z
    .string()
    .min(10, { message: "Smartcard should be at least 10 characters long" })
    .trim()
    .toUpperCase(),
  area: z.nanoid({ message: "Required field" }),
});

export function formatZodErrors(errors: ZodError) {
  const flattened = z.flattenError(errors).fieldErrors;
  const formatter = new Intl.ListFormat("en-IN", { type: "conjunction" });
  const formatted: { [key: string]: string } = {};
  for (const field in flattened) {
    // @ts-expect-error
    formatted[field] = formatter.format(flattened[field]);
  }

  return formatted;
}

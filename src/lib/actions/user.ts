"use server";

import "server-only";
import { cookies } from "next/headers";
import z from "zod";

interface UserFormState {
  name?: string;
  email?: string;
  phone?: string;
  errors?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  error?: string;
}

const userSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Name should have at least 4 characters." })
    .trim(),
  email: z.email(),
});

export async function updateUser(
  _pref: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  const cookieJar = await cookies();
  const data = {
    name: formData.get("name")?.toString(),
    email: formData.get("email")?.toString(),
  };

  const validation = userSchema.safeParse(data);
  if (!validation.success) {
    const errors = z.flattenError(validation.error).fieldErrors;
    return {
      errors: {
        name: (errors.name ?? [])[0],
        email: (errors.email ?? [])[0],
      },
      ...data,
    };
  }

  const res = await fetch(`${process.env.API_URL}/user`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${cookieJar.get("access_token")?.value}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validation.data),
  });

  if (!res.ok) {
    const resData = await res.json();
    return {
      errors: {
        name: resData.name,
        email: resData.email,
      },
      error: resData.message,
      ...data,
    };
  }

  return { ...data };
}

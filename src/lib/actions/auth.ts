"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import "server-only";
import z from "zod";

export interface LoginFormState {
  emailError?: string;
  passwordError?: string;
  email?: string;
  password?: string;
}

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters." })
  .regex(/[a-z]/, { message: "Password must contain a lowercase letter." })
  .regex(/[A-Z]/, { message: "Password must contain an uppercase letter." })
  .regex(/\d/, { message: "Password must contain a digit." })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain a special character.",
  });

const loginSchema = z.object({
  email: z.email(),
  password: passwordSchema,
});

export async function login(
  _prev: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const cookieJar = await cookies();
  const data = {
    email: formData.get("email")?.toString(),
    password: formData.get("password")?.toString(),
  };
  const validationRes = loginSchema.safeParse(data);

  if (!validationRes.success) {
    const errors = z.flattenError(validationRes.error).fieldErrors;
    return {
      emailError: (errors.email ?? []).at(0),
      passwordError: (errors.password ?? []).at(0),
      ...data,
    };
  }

  try {
    const res = await fetch(`${process.env.API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify(validationRes.data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const tokens = await res.json();
      cookieJar.set({
        name: "access_token",
        value: tokens.accessToken,
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 15,
      });
      cookieJar.set({
        name: "refresh_token",
        value: tokens.refreshToken,
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
      });
      redirect("/dashboard");
    } else {
      const resData = await res.json();
      return {
        emailError: resData.email,
        passwordError: resData.password,
        ...data,
      };
    }
  } catch (e) {
    console.error(e);
  }

  return { ...data };
}

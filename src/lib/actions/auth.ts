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
  error?: string;
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
      console.error(resData);

      return {
        emailError: resData.email,
        passwordError: resData.password,
        ...data,
        error: "Something went wrong, please try again later.",
      };
    }
  } catch (e) {
    console.error(e);
  }

  return { ...data, error: "Something went wrong, please try again later." };
}

interface SignupState {
  name?: string;
  email?: string;
  password?: string;
  passwordRepeat?: string;
  errors?: {
    name?: string;
    email?: string;
    password?: string;
    passwordRepeat?: string;
  };
  errorMessage?: string;
}

const signupSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long" }),
    email: z.email(),
    password: passwordSchema,
    passwordRepeat: passwordSchema,
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: "Passwords do not match.",
    path: ["passwordRepeat"],
  });

export async function signup(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const data = {
    name: formData.get("name")?.toString(),
    email: formData.get("email")?.toString(),
    password: formData.get("password")?.toString(),
    passwordRepeat: formData.get("passwordRepeat")?.toString(),
  };

  const validation = signupSchema.safeParse(data);
  if (!validation.success) {
    const errors = z.flattenError(validation.error).fieldErrors;
    return {
      errors: {
        name: (errors.name ?? []).at(0),
        email: (errors.email ?? []).at(0),
        password: (errors.password ?? []).at(0),
        passwordRepeat: (errors.passwordRepeat ?? []).at(0),
      },
      ...data,
    };
  }

  try {
    const res = await fetch(`${process.env.API_URL}/auth/signup`, {
      method: "POST",
      body: JSON.stringify(validation.data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const cookieJar = await cookies();
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
      redirect("/create-company");
    } else {
      const resData = await res.json();
      console.error(resData);

      return {
        errors: {
          name: resData.name,
          email: resData.email,
          password: resData.password,
        },
        ...data,
        errorMessage: "Something went wrong, please try again later.",
      };
    }
  } catch (e) {
    console.error(e);
  }
  return {
    ...data,
    errorMessage: "Something went wrong, please try again later.",
  };
}

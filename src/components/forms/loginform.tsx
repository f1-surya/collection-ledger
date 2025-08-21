"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions/auth";
import SubmitButton from "../ui/submit-button";
import { FormField } from "./formfield";

export default function LoginForm() {
  const [state, formAction] = useActionState(login, {});

  return (
    <form action={formAction} className="space-y-4 text-start">
      <FormField
        id="email"
        name="email"
        type="email"
        label="Email"
        required
        defaultValue={state.email}
        error={state.emailError}
      />
      <FormField
        id="password"
        name="password"
        type="password"
        label="Password"
        required
        defaultValue={state.password}
        error={state.passwordError}
      />
      <SubmitButton>Login</SubmitButton>
    </form>
  );
}

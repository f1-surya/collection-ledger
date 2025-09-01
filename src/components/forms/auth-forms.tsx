"use client";

import { LoaderCircle } from "lucide-react";
import { useActionState } from "react";
import { login, signup } from "@/lib/actions/auth";
import { Button } from "../ui/button";
import { FormField } from "./formfield";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, {});

  return (
    <form action={formAction} className="space-y-4 text-start">
      <FormField
        id="email"
        type="email"
        label="Email"
        placeHolder="rick@dalton.com"
        required
        defaultValue={state.email}
        error={state.emailError}
        disabled={pending}
      />
      <FormField
        id="password"
        type="password"
        label="Password"
        placeHolder="MyStrong#Password23"
        required
        defaultValue={state.password}
        error={state.passwordError}
        disabled={pending}
      />
      {state.error && (
        <div className="w-full bg-destructive/30 rounded p-4">
          {state.error}
        </div>
      )}
      <Button className="w-full" type="submit" disabled={pending}>
        {pending ? <LoaderCircle className="animate-spin" /> : "Login"}
      </Button>
    </form>
  );
}

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, {});

  return (
    <form action={action} className="space-y-4 text-start">
      <FormField
        id="name"
        type="text"
        label="Name"
        placeHolder="Rick Dalton"
        required
        defaultValue={state.name}
        error={state.errors?.name}
        disabled={pending}
      />
      <FormField
        id="email"
        type="email"
        label="Email"
        placeHolder="rick@dalton.com"
        required
        defaultValue={state.email}
        error={state.errors?.email}
        disabled={pending}
      />
      <FormField
        id="password"
        type="password"
        label="Password"
        placeHolder="StrongPassword@0203"
        required
        defaultValue={state.password}
        error={state.errors?.password}
        disabled={pending}
      />
      <FormField
        id="passwordRepeat"
        type="password"
        label="Enter password again"
        placeHolder="StrongPassword@0203"
        required
        defaultValue={state.passwordRepeat}
        error={state.errors?.passwordRepeat}
        disabled={pending}
      />
      {state.errorMessage && (
        <div className="w-full bg-destructive/30 rounded p-4">
          {state.errorMessage}
        </div>
      )}
      <Button className="w-full" type="submit" disabled={pending}>
        {pending ? <LoaderCircle className="animate-spin" /> : "Signup"}
      </Button>
    </form>
  );
}

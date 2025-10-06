"use client";

import { useActionState } from "react";
import { FormField } from "@/components/forms/formfield";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { updateUser } from "@/lib/actions/user";

interface UserFormProps {
  defaultValues?: {
    name?: string;
    email?: string;
  };
}

export function UserForm({ defaultValues }: UserFormProps) {
  const [state, action, isPending] = useActionState(updateUser, {});

  return (
    <form action={action} className="space-y-4 text-start">
      <FormField
        id="name"
        type="text"
        label="Full name"
        placeHolder="John Doe"
        required
        defaultValue={state.name ?? defaultValues?.name}
        error={state.errors?.name}
      />
      <FormField
        id="email"
        type="email"
        label="Email address"
        placeHolder="john@example.com"
        required
        defaultValue={state.email ?? defaultValues?.email}
        error={state.errors?.email}
      />
      {state.error && (
        <div className="w-full bg-destructive/30 rounded p-4">
          {state.error}
        </div>
      )}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? <Spinner /> : "Update account"}
      </Button>
    </form>
  );
}

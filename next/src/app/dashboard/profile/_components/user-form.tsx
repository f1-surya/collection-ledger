"use client";

import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/forms/formfield";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

export function UserForm({ name }: { name?: string }) {
  const [isPending, setIsPending] = useState(false);

  const updateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const { error } = await authClient.updateUser({
      name: formData.get("fullname")?.toString(),
    });
    if (error) {
      toast.error(error.message);
    }
    setIsPending(false);
  };

  return (
    <form onSubmit={updateUser} className="space-y-4 text-start">
      <FormField
        id="fullname"
        type="text"
        label="Full name"
        placeHolder="John Doe"
        required
        defaultValue={name}
      />
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? <Spinner /> : "Update account"}
      </Button>
    </form>
  );
}

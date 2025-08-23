"use client";

import { LoaderCircle } from "lucide-react";
import { useActionState } from "react";
import { saveCompany } from "@/lib/actions/company";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { FormField } from "./formfield";

export function CreateCompanyForm() {
  const [state, action, isPending] = useActionState(saveCompany, {});

  return (
    <form action={action} className="space-y-4 text-start">
      <FormField
        id="name"
        type="text"
        label="Company name"
        placeHolder="Dalton ltd."
        required
        defaultValue={state.name}
        error={state.errors?.name}
      />
      <FormField
        id="email"
        type="email"
        label="Company email"
        placeHolder="contact@dalton.com"
        required
        defaultValue={state.email}
        error={state.errors?.email}
      />
      <FormField
        id="phone"
        type="tel"
        label="Company phone number"
        placeHolder="+91-8905495648"
        required
        defaultValue={state.phone}
        error={state.errors?.phone}
      />
      <div className="grid gap-2">
        <Label
          htmlFor="address"
          className={`${state.errors?.address && "text-destructive"}`}
        >
          Company address*:
        </Label>
        <Textarea
          id="address"
          name="address"
          placeholder="10969 Alta View Drive, Studio City, CA"
          defaultValue={state.address}
          aria-invalid={state.errors?.address !== undefined}
          required
        />
        {state.errors?.address && (
          <p className="text-destructive text-sm">{state.errors.address}</p>
        )}
      </div>
      {state.error && (
        <div className="w-full bg-destructive/30 rounded p-4">
          {state.error}
        </div>
      )}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? <LoaderCircle className="animate-spin" /> : "Save"}
      </Button>
    </form>
  );
}

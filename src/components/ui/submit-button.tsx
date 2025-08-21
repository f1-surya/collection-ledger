"use client";

import { LoaderCircle } from "lucide-react";
import type { ReactElement } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./button";

export default function SubmitButton({ children }: { children: string }) {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? <LoaderCircle className="animate-spin" /> : children}
    </Button>
  );
}

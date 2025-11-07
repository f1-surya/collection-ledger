"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import type z from "zod";
import { Button } from "@/components/ui/button";
import { CustomFormField } from "@/components/ui/custom-field";
import CustomSelect from "@/components/ui/custom-select";
import { Form } from "@/components/ui/form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { fetcher } from "@/lib/fetcher";
import { connectionSchema } from "@/lib/zod-stuff";

interface Props {
  open: boolean;
  onOpenChange: (state: boolean) => void;
}

export default function CreateConnection({ open, onOpenChange }: Props) {
  const [saving, setSaving] = useState(false);
  const form = useForm<z.infer<typeof connectionSchema>>({
    resolver: zodResolver(connectionSchema),
  });
  const isMobile = useIsMobile();
  const { data: areas } = useSWR("/api/area", fetcher);
  const { data: basePacks } = useSWR("/api/packs", fetcher);
  const router = useRouter();

  const save = async (data: z.infer<typeof connectionSchema>) => {
    setSaving(true);
    const res = await fetch("/api/connection", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      router.push(`/dashboard/connections/${data.boxNumber}`);
    } else if (res.status !== 500 && res.status !== 200) {
      const errors = (await res.json()) as { [key: string]: string };
      for (const field in errors) {
        // @ts-expect-error
        form.setError(field, { message: [errors[field]] });
      }
    }
    setSaving(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isMobile ? "bottom" : "right"}>
        <form onSubmit={form.handleSubmit(save)}>
          <SheetHeader>
            <SheetTitle>Create connection</SheetTitle>
            <SheetDescription>Enter connection details</SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <div className="space-y-4 px-4">
              <CustomFormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="John Shelby"
                required
              />
              <CustomFormField
                control={form.control}
                name="boxNumber"
                label="Smartcard"
                placeholder="83060001AE86"
                required
              />
              <CustomFormField
                control={form.control}
                name="phoneNumber"
                label="Phone"
                placeholder="+91-9874343433"
                type="tel"
              />
              <CustomSelect
                control={form.control}
                name="area"
                label="Area"
                placeHolder="Select an area"
                items={areas ?? []}
                required
              />
              <CustomSelect
                control={form.control}
                name="basePack"
                label="Base pack"
                placeHolder="Select a base pack"
                items={basePacks ?? []}
                required
              />
            </div>
          </Form>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="destructive">Cancel</Button>
            </SheetClose>
            <Button type="submit" disabled={saving}>
              {saving ? <Spinner /> : "Save"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

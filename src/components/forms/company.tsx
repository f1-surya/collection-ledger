"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { Alert, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { CustomFormField } from "../ui/custom-field";
import { Form } from "../ui/form";
import { Spinner } from "../ui/spinner";

const companySchema = z.object({
  name: z
    .string()
    .min(5, { message: "Company name should have at least 5 characters." })
    .trim(),
  slug: z.email(),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number should contain at least 10 digits." })
    .trim(),
  address: z
    .string()
    .min(10, { message: "Address should have at least 10 characters." })
    .trim(),
});

interface CompanyFormProps {
  defaultValues?: z.infer<typeof companySchema>;
}

export function CompanyForm({ defaultValues }: CompanyFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [alert, setAlert] = useState<string | undefined>();
  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues,
  });

  const update = async (data: z.infer<typeof companySchema>) => {
    setIsPending(true);
    setAlert(undefined);
    const { error } = await authClient.organization.update({
      data,
    });
    if (error) {
      setAlert(error.message);
    }
    setIsPending(false);
  };

  return (
    <form onSubmit={form.handleSubmit(update)} className="space-y-4 text-start">
      <Form {...form}>
        <CustomFormField
          control={form.control}
          name="name"
          label="Company name"
          placeholder="Dalton ltd."
          required
        />
        <CustomFormField
          control={form.control}
          name="slug"
          label="Company email"
          placeholder="contact@dalton.com"
          type="email"
          required
        />
        <CustomFormField
          control={form.control}
          name="phoneNumber"
          label="Company phone number"
          placeholder="+91-8905495648"
          type="tel"
          required
        />
        <CustomFormField
          control={form.control}
          name="address"
          label="Company address"
          placeholder="10969 Alta View Drive, Studio City, CA"
          type="textarea"
          required
        />
      </Form>
      {alert && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>{alert}</AlertTitle>
        </Alert>
      )}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? <Spinner /> : "Update company"}
      </Button>
    </form>
  );
}

export function CreateCompanyForm() {
  const [isPending, setIsPending] = useState(false);
  const [alert, setAlert] = useState<string | undefined>();
  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
  });
  const router = useRouter();

  const save = async (data: z.infer<typeof companySchema>) => {
    setIsPending(true);
    setAlert(undefined);

    const { data: slugCheck } = await authClient.organization.checkSlug({
      slug: data.slug,
    });
    if (!slugCheck?.status) {
      setAlert("A company with same email already exists");
    } else {
      const { error } = await authClient.organization.create({
        ...data,
      });
      if (error) {
        setAlert(error.message);
      } else {
        router.push("/dashboard");
      }
    }
    setIsPending(false);
  };

  return (
    <form onSubmit={form.handleSubmit(save)} className="space-y-4 text-start">
      <Form {...form}>
        <CustomFormField
          control={form.control}
          name="name"
          label="Company name"
          placeholder="Dalton ltd."
          required
        />
        <CustomFormField
          control={form.control}
          name="slug"
          label="Company email"
          placeholder="contact@dalton.com"
          type="email"
          required
        />
        <CustomFormField
          control={form.control}
          name="phoneNumber"
          label="Company phone number"
          placeholder="+91-8905495648"
          type="tel"
          required
        />
        <CustomFormField
          control={form.control}
          name="address"
          label="Company address"
          placeholder="10969 Alta View Drive, Studio City, CA"
          type="textarea"
          required
        />
      </Form>
      {alert && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>{alert}</AlertTitle>
        </Alert>
      )}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? <Spinner /> : "Save"}
      </Button>
    </form>
  );
}

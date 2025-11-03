"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { Alert, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { CustomFormField } from "../ui/custom-field";
import { Field, FieldLabel } from "../ui/field";
import { Form } from "../ui/form";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

export function LoginForm() {
  const [pending, setPending] = useState(false);
  const [alert, setAlert] = useState<string | undefined>();
  const router = useRouter();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setAlert(undefined);

    const formData = new FormData(e.currentTarget);
    const { error } = await authClient.signIn.email({
      email: formData.get("email")!.toString(),
      password: formData.get("password")!.toString(),
    });

    if (error) {
      setAlert(error.message);
      setPending(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-start">
      <Field>
        <FieldLabel htmlFor="email">Email:</FieldLabel>
        <Input id="email" name="email" placeholder="rick@dalton.com" type='email' required />
      </Field>
      <Field>
        <FieldLabel htmlFor="password">Password:</FieldLabel>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Strong#Password12"
          required
        />
      </Field>
      {alert && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>{alert}</AlertTitle>
        </Alert>
      )}
      <Button className="w-full" type="submit" disabled={pending}>
        {pending ? <Spinner /> : "Login"}
      </Button>
    </form>
  );
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

const signupSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long" })
      .trim(),
    email: z.email(),
    password: passwordSchema,
    passwordRepeat: passwordSchema,
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: "Passwords do not match.",
    path: ["passwordRepeat"],
  });

export function SignupForm() {
  const [pending, setPending] = useState(false);
  const [alert, setAlert] = useState<string | undefined>();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });
  const router = useRouter();

  const signup = async (data: z.infer<typeof signupSchema>) => {
    setPending(true);
    setAlert(undefined);
    const { error } = await authClient.signUp.email({
      ...data,
    });
    if (error) {
      setAlert(error.message);
    } else {
      router.push("/create-company");
    }
    setPending(false);
  };

  return (
    <form className="space-y-4 text-start" onSubmit={form.handleSubmit(signup)}>
      <Form {...form}>
        <div className="space-y-4">
          <CustomFormField
            control={form.control}
            name="name"
            label="Name"
            placeholder="Cliff Booth"
            required
          />
          <CustomFormField
            control={form.control}
            name="email"
            label="Email"
            placeholder="cliff@dalton.com"
            required
          />
          <CustomFormField
            control={form.control}
            name="password"
            label="Password"
            placeholder="Strong@Password123"
            required
            type="password"
          />
          <CustomFormField
            control={form.control}
            name="passwordRepeat"
            label="Enter password again"
            placeholder=""
            required
            type="password"
          />
        </div>
      </Form>
      {alert && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>{alert}</AlertTitle>
        </Alert>
      )}
      <Button className="w-full" type="submit" disabled={pending}>
        {pending ? <Spinner /> : "Signup"}
      </Button>
    </form>
  );
}

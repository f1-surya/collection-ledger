import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SignupForm } from "@/components/forms/auth-forms";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";

export default async function Signup() {
  const [session, t] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getTranslations("Signup"),
  ]);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex items-center justify-center h-dvh w-dvw">
      <Card className="md:w-[40%] m-1 text-center">
        <CardHeader className="flex flex-col justify-center items-center">
          <CardTitle>Collection ledger</CardTitle>
          <CardDescription>{t("signupDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
        <CardFooter>
          <p className="text-center w-full">
            Already have an account?,{" "}
            <Link href="/login" className="text-blue-600">
              Login here
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}

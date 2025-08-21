import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SignupForm } from "@/components/forms/auth-forms";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Signup() {
  const [cookieJar, t] = await Promise.all([
    cookies(),
    getTranslations("Signup"),
  ]);
  const authed = cookieJar.get("refresh_token");

  if (authed) {
    redirect("/dashboard");
  }

  return (
    <main className="flex items-center justify-center h-dvh w-dvw">
      <Card className="md:w-[40%] m-1 text-center">
        <CardHeader className="flex flex-col justify-center items-center">
          <CardTitle className="text-xl">Collection ledger</CardTitle>
          <CardFooter>{t("signupDescription")}</CardFooter>
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

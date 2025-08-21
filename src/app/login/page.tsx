import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/forms/auth-forms";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Login to continue",
};

export default async function Login() {
  const cookieJar = await cookies();
  const authed = cookieJar.get("refresh_token");

  if (authed) {
    redirect("/dashboard");
  }

  return (
    <main className="flex items-center justify-center h-dvh w-dvw">
      <Card className="md:w-[40%] m-2 text-center">
        <CardHeader>
          <CardTitle className="text-xl">Login to continue</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter>
          <p className="text-center w-full">
            Don&apos;t have an account?,{" "}
            <Link href="/signup" className="text-blue-600">
              Signup here
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CreateCompanyForm } from "@/components/forms/company";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function CreateCompany() {
  const [cookieJar, t] = await Promise.all([
    cookies(),
    getTranslations("CreateCompany"),
  ]);

  const res = await fetch(`${process.env.API_URL}/company`, {
    headers: {
      Authorization: `bearer ${cookieJar.get("access_token")?.value}`,
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    redirect("/dashboard");
  } else if (res.status !== 404) {
    redirect("/error");
  }

  return (
    <main className="flex items-center justify-center h-dvh w-dvw">
      <Card className="md:w-[40%] text-center m-1">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateCompanyForm />
        </CardContent>
      </Card>
    </main>
  );
}

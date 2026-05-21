import { headers } from "next/headers";
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
import { auth } from "@/lib/auth";

export default async function CreateCompany() {
  const [t, h] = await Promise.all([
    getTranslations("CreateCompany"),
    headers(),
  ]);

  const orgs = await auth.api.listOrganizations({ headers: h });
  if (orgs.length > 0) {
    redirect("/dashboard");
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

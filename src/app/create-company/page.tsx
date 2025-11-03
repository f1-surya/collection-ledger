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
import { getOrg } from "@/lib/get-org";

export default async function CreateCompany() {
  const t = await getTranslations("CreateCompany");

  const org = await getOrg();
  if (org) {
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

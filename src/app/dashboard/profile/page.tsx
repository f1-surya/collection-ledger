import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CompanyForm } from "@/components/forms/company";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { UserForm } from "./_components/user-form";

export default async function Profile() {
  const t = await getTranslations("Profile");
  const h = await headers();
  const [res, comp] = await Promise.all([
    auth.api.getSession({ headers: h }),
    auth.api.getFullOrganization({ headers: h }),
  ]);

  if (!res || !comp) {
    redirect("/login");
  }

  return (
    <main className="p-4 space-y-6 md:grid md:grid-cols-2 md:gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("userTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm name={res.user.name} />
        </CardContent>
      </Card>
      <Card id="company-card">
        <CardHeader>
          <CardTitle>{t("companyTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <CompanyForm defaultValues={comp} />
        </CardContent>
      </Card>
    </main>
  );
}

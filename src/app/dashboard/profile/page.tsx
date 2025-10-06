import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CompanyForm } from "@/components/forms/company";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authedFetch } from "@/lib/authed-fetch";
import { UserForm } from "./_components/user-form";

export default async function Profile() {
  const t = await getTranslations("Profile");
  const [
    { data: user, error: userError },
    { data: company, error: companyError },
  ] = await Promise.all([authedFetch("/user"), authedFetch("/company")]);

  if (userError || companyError) {
    console.error(userError || companyError);
    redirect("/error");
  }

  return (
    <main className="p-4 space-y-6 md:grid md:grid-cols-2 md:gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("userTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm defaultValues={user as any} />
        </CardContent>
      </Card>
      <Card id="company-card">
        <CardHeader>
          <CardTitle>{t("companyTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <CompanyForm defaultValues={company as any} />
        </CardContent>
      </Card>
    </main>
  );
}

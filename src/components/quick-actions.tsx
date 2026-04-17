"use client";

import { Download, Plus, Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const CreateConnection = dynamic(
  () => import("@/app/dashboard/connections/_components/create"),
);

export function QuickActions() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const t = useTranslations("Dashboard");

  const navigate = () => {
    router.push(`/dashboard/connections?search=${search.toUpperCase()}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("quickActionsTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <CreateConnection>
              <Button data-icon="inline-start">
                <Plus />
                {t("addNewConnection")}
              </Button>
            </CreateConnection>
            <Button variant="outline" asChild>
              <a href="/api/payment/sheet" download>
                <Download className="mr-2 h-4 w-4" />
                {t("exportPaymentsThisMonth")}
              </a>
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  navigate();
                }
              }}
            />
            <Button onClick={navigate} size="icon">
              <Search />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

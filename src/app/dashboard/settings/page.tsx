"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ThemeOption = "system" | "light" | "dark";
type Language = "en" | "ta";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState<Language>("en");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("Settings");

  useEffect(() => {
    const cookie = document.cookie
      .split(";")
      .find((row) => row.trim().startsWith("locale"));
    if (cookie) {
      const [, value] = cookie.split("=");
      setLanguage(value as Language);
    }
  }, []);

  const handleLanguageChange = (value: Language) => {
    setLanguage(value);
    // biome-ignore lint/suspicious/noDocumentCookie: It's okay to use document.cookie here.
    document.cookie = `locale=${value}; path=/`;
    window.location.reload();
  };

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      toast.error("Invalid file format. Please upload an XLSX file.");
    }

    const prom = fetch("/api/data", {
      method: "POST",
      body: file,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });

    toast.promise(prom, {
      loading: "Uploading data...",
      success: "Data uploaded successfully!",
      error: "Failed to upload data",
    });

    await prom;
  };

  const onExport = async () => {
    const prom = fetch(`/api/data`, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });

    toast.promise(prom, {
      loading: "Downloading payments...",
      success: "Payments downloaded successfully!",
      error: "Failed to download payments",
    });

    const response = await prom;

    if (!response.ok) {
      throw new Error("Failed to download payments");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Collection-Ledger-Data.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-pretty">{t("appearanceTitle")}</CardTitle>
          <CardDescription>{t("appearanceDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <Label htmlFor="theme-select">{t("themeLabel")}</Label>
            <span className="text-muted-foreground text-sm">
              {t("themeHint")}
            </span>
          </div>
          <Select value={theme} onValueChange={(v: ThemeOption) => setTheme(v)}>
            <SelectTrigger
              id="theme-select"
              aria-label="Select theme"
              className="md:w-40"
            >
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="system">{t("system")}</SelectItem>
              <SelectItem value="light">{t("light")}</SelectItem>
              <SelectItem value="dark">{t("dark")}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader>
          <CardTitle className="text-pretty">{t("languageTitle")}</CardTitle>
          <CardDescription>{t("languageDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <Label htmlFor="language-select">{t("languageLabel")}</Label>
            <span className="text-muted-foreground text-sm">
              {t("languageHint")}
            </span>
          </div>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger
              id="language-select"
              aria-label="Select language"
              className="md:w-40"
            >
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="en">{t("english")}</SelectItem>
              <SelectItem value="ta">{t("tamil")}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      {/* Data import/export */}
      <Card>
        <CardHeader>
          <CardTitle className="text-pretty">{t("dataTitle")}</CardTitle>
          <CardDescription>{t("dataDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <Label>{t("importLabel")}</Label>
              <span className="text-muted-foreground text-sm">
                {t("importHint")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx"
                onChange={onFileSelected}
                className="hidden"
                aria-hidden="true"
                tabIndex={-1}
              />
              <Button
                variant="secondary"
                className="md:w-40"
                onClick={() => fileInputRef.current?.click()}
              >
                {t("importButton")}
              </Button>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <Label>{t("exportLabel")}</Label>
              <span className="text-muted-foreground text-sm">
                {t("exportHint")}
              </span>
            </div>
            <Button className="md:w-40" onClick={onExport}>
              {t("exportButton")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

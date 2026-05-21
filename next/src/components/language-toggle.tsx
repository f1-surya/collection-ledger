"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Locale = "en" | "ta";

type LanguageToggleProps = {
  className?: string;
};

export function LanguageToggle({ className }: LanguageToggleProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const t = useTranslations("LanguageToggle");

  const setLocale = (nextLocale: string) => {
    if (nextLocale === locale) {
      return;
    }

    // biome-ignore lint/suspicious/noDocumentCookie: Locale preference is persisted in a simple cookie.
    document.cookie = `locale=${nextLocale}; path=/`;
    router.refresh();
  };

  return (
    <Select value={locale} onValueChange={setLocale}>
      <SelectTrigger
        aria-label={t("ariaLabel")}
        className={cn("w-[140px]", className)}
        size="sm"
      >
        <Languages className="size-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="en">{t("english")}</SelectItem>
        <SelectItem value="ta">{t("tamil")}</SelectItem>
      </SelectContent>
    </Select>
  );
}

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LanguageToggle } from "@/components/language-toggle";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Privacy Policy - Collection Ledger",
  description: "Privacy Policy for Collection Ledger",
};

export default async function PrivacyPolicy() {
  const t = await getTranslations("PrivacyPage");

  const sectionKeys = [
    "introduction",
    "collection",
    "usage",
    "security",
    "changes",
    "contact",
  ] as const;

  const collectionItems = [
    "sections.collection.list.personal",
    "sections.collection.list.customer",
    "sections.collection.list.usage",
    "sections.collection.list.cookies",
  ] as const;

  const usageItems = [
    "sections.usage.list.provide",
    "sections.usage.list.notify",
    "sections.usage.list.features",
    "sections.usage.list.support",
    "sections.usage.list.improve",
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-foreground">
            Collection Ledger
          </h1>
          <div className="flex items-center gap-3">
            <LanguageToggle className="w-[130px]" />
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("backHome")}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-invert max-w-none space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t("pageTitle")}
            </h1>
            <p className="text-muted-foreground">{t("lastUpdated")}</p>
          </div>

          {sectionKeys.map((key) => (
            <section className="space-y-4" key={key}>
              <h2 className="text-2xl font-bold text-foreground">
                {t(`sections.${key}.heading`)}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t(`sections.${key}.body`)}
              </p>

              {key === "collection" ? (
                <>
                  <h3 className="text-xl font-semibold text-foreground">
                    {t("sections.collection.subHeading")}
                  </h3>
                  <ul className="space-y-2 text-muted-foreground leading-relaxed">
                    {collectionItems.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="text-primary">•</span>
                        <span>{t(item)}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              {key === "usage" ? (
                <ul className="space-y-2 text-muted-foreground leading-relaxed">
                  {usageItems.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="text-primary">•</span>
                      <span>{t(item)}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </main>

      <footer className="border-t bg-muted/30 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Collection Ledger.{" "}
              {t("footerText")}
            </p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <Link
                href="/privacy"
                className="hover:text-foreground transition"
              >
                {t("privacyPolicy")}
              </Link>
              <Link href="/terms" className="hover:text-foreground transition">
                {t("terms")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  Download,
  Shield,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { LanguageToggle } from "@/components/language-toggle";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Collection Ledger - Bulk Payment Management for Cable Operators",
  description:
    "Simplify bulk payment collection for cable TV operators. Import customer data from MSO providers, track payments, and export lists in seconds. Made for South Indian cable operators.",
};

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/dashboard");
  }

  const t = await getTranslations("HomePage");

  const steps = [
    { icon: Upload, key: "import" },
    { icon: CheckCircle, key: "track" },
    { icon: Download, key: "export" },
  ] as const;

  const benefits = [
    { icon: Clock, key: "saveTime" },
    { icon: Users, key: "bulk" },
    { icon: BarChart3, key: "realtime" },
    { icon: Shield, key: "secure" },
  ] as const;

  const workflow = ["download", "import", "track", "submit"] as const;

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Image alt="app icon" src="/icon0.svg" height={35} width={35} />
          </div>
          <LanguageToggle className="w-[130px]" />
        </div>
      </nav>

      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {t("badge")}
              </span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl leading-tight line font-bold text-foreground">
                {t("heroTitle")}
                <span className="block text-primary">{t("heroHighlight")}</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl mx-auto text-balance">
                {t("heroDescription")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-16">
            {steps.map((step) => (
              <div
                key={step.key}
                className="bg-card border rounded-xl p-6 flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t(`steps.${step.key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`steps.${step.key}.description`)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                {t("startFreeTrial")}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                {t("signin")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground">
              {t("benefitsTitle")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("benefitsDescription")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.key} className="bg-card border rounded-xl p-8">
                <benefit.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {t(`benefits.${benefit.key}.title`)}
                </h3>
                <p className="text-muted-foreground">
                  {t(`benefits.${benefit.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground">
              {t("workflowTitle")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("workflowDescription")}
            </p>
          </div>

          <div className="space-y-6">
            {workflow.map((step, index) => (
              <div key={step} className="flex gap-6 items-start">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {t(`workflow.${step}.title`)}
                  </h3>
                  <p className="text-muted-foreground">
                    {t(`workflow.${step}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-4xl sm:text-5xl font-bold mb-2">90%</div>
              <p className="text-sm opacity-90">{t("stats.faster")}</p>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold mb-2">1000+</div>
              <p className="text-sm opacity-90">{t("stats.records")}</p>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold mb-2">
                {t("stats.zeroValue")}
              </div>
              <p className="text-sm opacity-90">{t("stats.errors")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-linear-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-12 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              {t("ctaTitle")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("ctaDescription")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  {t("startFreeToday")}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  {t("alreadyHaveAccount")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-muted/30 py-12">
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

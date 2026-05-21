import { format, startOfMonth } from "date-fns";
import { and, between, count, desc, eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/db/drizzle";
import { basePacks, payments } from "@/db/schema";

export function MonthlyPackPaymentsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-64" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map(() => (
            <div key={`pack-payment-${Math.random()}`} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export async function MonthlyPackPayments({ orgId }: { orgId: string }) {
  const now = new Date();
  const start = startOfMonth(now);
  const paymentCount = count(payments.id);
  const t = await getTranslations("Dashboard");

  const monthlyPackPayments = await db
    .select({
      packId: basePacks.id,
      packName: basePacks.name,
      payments: paymentCount,
    })
    .from(basePacks)
    .leftJoin(
      payments,
      and(
        eq(payments.currentPack, basePacks.id),
        eq(payments.org, orgId),
        between(payments.date, start, now),
      ),
    )
    .where(eq(basePacks.org, orgId))
    .groupBy(basePacks.id)
    .orderBy(desc(paymentCount), basePacks.name);

  const maxPayments = Math.max(
    ...monthlyPackPayments.map((pack) => pack.payments),
    0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("paymentsByPack", { month: format(start, "MMM yyyy") })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {monthlyPackPayments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("noPaymentsThisMonth")}
          </p>
        ) : (
          <div className="space-y-4">
            {monthlyPackPayments.map((pack) => {
              const width =
                maxPayments > 0
                  ? Math.max(Math.round((pack.payments / maxPayments) * 100), 0)
                  : 0;

              return (
                <div key={pack.packId} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{pack.packName}</span>
                    <span className="text-muted-foreground">
                      {pack.payments}
                    </span>
                  </div>
                  <Progress value={width} className="bg-muted" />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

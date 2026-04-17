import { startOfMonth, subMonths } from "date-fns";
import { eq, sql } from "drizzle-orm";
import { AlertTriangle, TrendingUp, Users, Wallet } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/db/drizzle";
import { connections, payments } from "@/db/schema";

export function SummarySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map(() => (
        <Card key={`summary-card-${Math.random()}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-24" />
            </CardTitle>
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export async function Summary({ orgId }: { orgId: string }) {
  const lastMonth = subMonths(startOfMonth(new Date()), 1);
  const start = startOfMonth(new Date());
  const t = await getTranslations("Dashboard");

  const res = await db
    .select({
      totalConnections: sql<number>`count(*)`.mapWith(Number),
      activeConnections:
        sql<number>`count(case when ${connections.lastPayment} >= ${lastMonth} then 1 end)`.mapWith(
          Number,
        ),
      overduePayments:
        sql<number>`count(case when ${connections.lastPayment} <= ${lastMonth} or ${connections.lastPayment} is null then 1 end)`.mapWith(
          Number,
        ),
      monthlyRevenue: sql<number>`(
      select coalesce(sum(${payments.customerPrice}), 0)
      from ${payments}
      where ${payments.org} = ${orgId} and ${payments.date} >= ${start}
      )`.mapWith(Number),
    })
    .from(connections)
    .where(eq(connections.org, orgId));
  const {
    totalConnections,
    activeConnections,
    overduePayments,
    monthlyRevenue,
  } = res[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("totalConnections")}
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalConnections}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("paidConnections")}
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeConnections}</div>
          <p className="text-xs text-muted-foreground">
            {t("ofTotal", {
              percent:
                totalConnections > 0
                  ? ((activeConnections / totalConnections) * 100).toFixed()
                  : 0,
            })}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("monthlyRevenue")}
          </CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹{monthlyRevenue.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("inactiveConnections")}
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overduePayments}</div>
          <p className="text-xs text-muted-foreground">
            {t("requiresAttention")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

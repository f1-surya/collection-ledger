import { startOfMonth, subDays } from "date-fns";
import { and, eq, gte, isNull, lt, or, sql } from "drizzle-orm";
import { AlertTriangle, TrendingUp, Users, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/db/drizzle";
import { connections, payments } from "@/db/schema";
import { getOrg } from "@/lib/get-org";

export function LoadingSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={`summary-card-${i}`}>
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

export async function Summary() {
  const org = await getOrg();

  const thirtyDaysAgo = subDays(new Date(), 30);
  const start = startOfMonth(new Date());

  const [
    totalConnections,
    activeConnections,
    monthlyRevenueResult,
    overduePayments,
  ] = await Promise.all([
    db.$count(connections, eq(connections.org, org.id)),
    db.$count(
      connections,
      and(
        eq(connections.org, org.id),
        gte(connections.lastPayment, thirtyDaysAgo),
      ),
    ),
    db
      .select({ sum: sql<number>`sum(${payments.customerPrice})` })
      .from(payments)
      .where(and(eq(payments.org, org.id), gte(payments.date, start))),
    db.$count(
      connections,
      and(
        eq(connections.org, org.id),
        or(
          isNull(connections.lastPayment),
          lt(connections.lastPayment, thirtyDaysAgo),
        ),
      ),
    ),
  ]);

  const monthlyRevenue = monthlyRevenueResult[0]?.sum || 0;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Connections
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
            Active Connections
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeConnections}</div>
          <p className="text-xs text-muted-foreground">
            {totalConnections > 0
              ? ((activeConnections / totalConnections) * 100).toFixed()
              : 0}
            % of total.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
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
            Overdue Payments
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overduePayments}</div>
          <p className="text-xs text-muted-foreground">Requires attention</p>
        </CardContent>
      </Card>
    </div>
  );
}

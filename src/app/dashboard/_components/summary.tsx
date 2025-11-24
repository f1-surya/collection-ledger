import { startOfMonth, subDays } from "date-fns";
import { eq, sql } from "drizzle-orm";
import { AlertTriangle, TrendingUp, Users, Wallet } from "lucide-react";
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
  const thirtyDaysAgo = subDays(new Date(), 30);
  const start = startOfMonth(new Date());

  const res = await db
    .select({
      totalConnections: sql<number>`count(*)`.mapWith(Number),
      activeConnections:
        sql<number>`count(case when ${connections.lastPayment} >= ${thirtyDaysAgo} then 1 end)`.mapWith(
          Number,
        ),
      overduePayments:
        sql<number>`count(case when ${connections.lastPayment} <= ${thirtyDaysAgo} or ${connections.lastPayment} is null then 1 end)`.mapWith(
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

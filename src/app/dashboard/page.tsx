import { startOfMonth, subDays } from "date-fns";
import { and, desc, eq, gte, isNull, lt, or, sql } from "drizzle-orm";
import { AlertTriangle, TrendingUp, Users, Wallet } from "lucide-react";
import { QuickActions } from "@/components/quick-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db/drizzle";
import { basePacks, connections, payments } from "@/db/schema";
import { getOrg } from "@/lib/get-org";

export default async function Dashboard() {
  const org = await getOrg();

  const thirtyDaysAgo = subDays(new Date(), 60);

  const totalConnections = await db.$count(
    connections,
    eq(connections.org, org.id),
  );

  const activeConnections = await db.$count(
    connections,
    and(
      eq(connections.org, org.id),
      gte(connections.lastPayment, thirtyDaysAgo),
    ),
  );

  const start = startOfMonth(new Date());

  const monthlyRevenueResult = await db
    .select({ sum: sql<number>`sum(${payments.customerPrice})` })
    .from(payments)
    .where(and(eq(payments.org, org.id), gte(payments.date, start)));

  const monthlyRevenue = monthlyRevenueResult[0]?.sum || 0;

  const overduePayments = await db.$count(
    connections,
    and(
      eq(connections.org, org.id),
      or(
        isNull(connections.lastPayment),
        lt(connections.lastPayment, thirtyDaysAgo),
      ),
    ),
  );

  const recentPayments = await db
    .select({
      id: payments.id,

      name: connections.name,

      pack: basePacks.name,

      amount: payments.customerPrice,

      date: sql<string>`to_char(${payments.date}, 'YYYY-MM-DD')`,
    })
    .from(payments)
    .innerJoin(connections, eq(payments.connection, connections.id))
    .innerJoin(basePacks, eq(payments.currentPack, basePacks.id))
    .where(eq(payments.org, org.id))
    .orderBy(desc(payments.date))
    .limit(4);

  const summaryData = {
    totalConnections,

    activeConnections,

    monthlyRevenue,

    overduePayments,
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Connections
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryData.totalConnections}
            </div>
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
            <div className="text-2xl font-bold">
              {summaryData.activeConnections}
            </div>
            <p className="text-xs text-muted-foreground">
              {(
                (summaryData.activeConnections / summaryData.totalConnections) *
                100
              ).toFixed()}
              % of total.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{summaryData.monthlyRevenue.toLocaleString()}
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
            <div className="text-2xl font-bold">
              {summaryData.overduePayments}
            </div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{payment.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.pack}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{payment.amount}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <QuickActions />
      </div>
    </div>
  );
}

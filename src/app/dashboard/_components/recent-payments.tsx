import { desc, eq, sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/db/drizzle";
import { basePacks, connections, payments } from "@/db/schema";
import { getOrg } from "@/lib/get-org";

export function LoadingRecentPayments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-32" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`recent-payment-${i}`}
              className="flex justify-between items-center"
            >
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export async function RecentPayments() {
  const org = await getOrg();

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Payments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentPayments.map((payment) => (
            <div key={payment.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{payment.name}</p>
                <p className="text-sm text-muted-foreground">{payment.pack}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₹{payment.amount}</p>
                <p className="text-sm text-muted-foreground">{payment.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

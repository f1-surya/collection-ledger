import { startOfMonth } from "date-fns";
import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { payments } from "@/db/schema";
import { getOrg } from "@/lib/get-org";
import PaymentList from "./_components/payment-list";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  const { start, end } = await searchParams;
  const now = new Date();
  const startDate = start ? new Date(start) : startOfMonth(now);
  const endDate = end ? new Date(end) : now;

  if (startDate > endDate) {
    return (
      <main className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Invalid Date Range</h1>
      </main>
    );
  }

  const org = await getOrg();
  const data = await db.query.payments.findMany({
    where: and(
      eq(payments.org, org.id),
      gte(payments.date, startDate),
      lte(payments.date, endDate),
    ),
    with: {
      currentPack: true,
      to: true,
      connection: {
        columns: {
          name: true,
        },
      },
    },
  });

  return <PaymentList defaultPayments={data} />;
}

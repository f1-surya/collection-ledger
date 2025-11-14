import { endOfMonth, startOfMonth } from "date-fns";
import { and, between, eq, type SQLWrapper } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { payments } from "@/db/schema";
import { getOrg } from "@/lib/get-org";
import PaymentList from "./_components/payment-list";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    month?: string;
    page?: number;
    type?: "all" | "payments" | "migrations";
  }>;
}) {
  const { month: monthParam, page, type } = await searchParams;
  const month = monthParam ? new Date(monthParam) : new Date();

  const org = await getOrg();

  let typeFilter: SQLWrapper | undefined;
  if (type === "migrations") {
    typeFilter = eq(payments.isMigration, true);
  } else if (type === "payments") {
    typeFilter = eq(payments.isMigration, false);
  }

  const count = await db.$count(
    payments,
    and(
      eq(payments.org, org.id),
      between(payments.date, startOfMonth(month), endOfMonth(month)),
      typeFilter,
    ),
  );
  const maxPages = Math.ceil(count / 20);

  let currPage = Math.min(page ?? 1, maxPages) - 1;
  if (currPage < 0) {
    currPage = 0;
  }

  const data = await db.query.payments.findMany({
    where: and(
      eq(payments.org, org.id),
      between(payments.date, startOfMonth(month), endOfMonth(month)),
      typeFilter,
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
    limit: 20,
    offset: currPage * 20,
  });

  return <PaymentList payments={data} pages={Math.ceil(count / 20)} />;
}

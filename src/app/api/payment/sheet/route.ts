import { endOfMonth, startOfMonth } from "date-fns";
import { and, between, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { db } from "@/db/drizzle";
import { connections, payments } from "@/db/schema";
import { getOrg } from "@/lib/get-org";
import { writeCsv } from "@/lib/sheet";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const month = params.get("month")
    ? // biome-ignore lint/style/noNonNullAssertion: It is asserted at the top, just not with a variable
      new Date(params.get("month")!.toString())
    : new Date();

  const org = await getOrg();
  const data = await db
    .select({ boxNumber: connections.boxNumber })
    .from(payments)
    .where(
      and(
        eq(payments.org, org.id),
        between(payments.date, startOfMonth(month), endOfMonth(month)),
        eq(payments.isMigration, false),
      ),
    )
    .rightJoin(connections, eq(payments.connection, connections.id));

  const csv = writeCsv([["Vc Number"], ...data.map((p) => [p.boxNumber])]);

  return new Response(csv, {
    headers: { "Content-Type": "text/csv" },
  });
}

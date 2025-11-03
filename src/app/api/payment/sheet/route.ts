import { startOfMonth } from "date-fns";
import { and, eq, gte, lte } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { db } from "@/db/drizzle";
import { connections, payments } from "@/db/schema";
import { getOrg } from "@/lib/get-org";
import { writeSheet } from "@/lib/sheet";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const start = params.get("start");
  const end = params.get("end");
  const now = new Date();
  const startDate = start ? new Date(start) : startOfMonth(now);
  const endDate = end ? new Date(end) : now;

  const org = await getOrg();
  const data = await db
    .select({ boxNumber: connections.boxNumber })
    .from(payments)
    .where(
      and(
        eq(payments.org, org.id),
        gte(payments.date, startDate),
        lte(payments.date, endDate),
      ),
    )
    .rightJoin(connections, eq(payments.connection, connections.id));

  const blob = writeSheet({ Payments: data.map((p) => [p.boxNumber]) });

  return new Response(Buffer.from(blob), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
}

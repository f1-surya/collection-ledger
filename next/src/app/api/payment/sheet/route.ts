import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { and, between, eq } from "drizzle-orm";
import JSZip from "jszip";
import type { NextRequest } from "next/server";
import { db } from "@/db/drizzle";
import { basePacks, connections, payments } from "@/db/schema";
import { getOrg } from "@/lib/get-org";
import { writeCsv } from "@/lib/sheet";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const month = params.get("month")
    ? // biome-ignore lint/style/noNonNullAssertion: It is asserted at the top, just not with a variable
      new Date(params.get("month")!.toString())
    : new Date();
  const start = startOfMonth(month);
  const end = endOfMonth(month);

  const org = await getOrg();
  const [currPayments, unpaidConnections] = await Promise.all([
    db
      .select({
        boxNumber: connections.boxNumber,
        isMigration: payments.isMigration,
        to: basePacks.name,
      })
      .from(payments)
      .where(and(eq(payments.org, org.id), between(payments.date, start, end)))
      .rightJoin(connections, eq(payments.connection, connections.id))
      .leftJoin(basePacks, eq(payments.to, basePacks.id)),
    db
      .select({ boxNumber: connections.boxNumber })
      .from(connections)
      .where(
        and(
          eq(connections.org, org.id),
          between(
            connections.lastPayment,
            subMonths(start, 1),
            subMonths(end, 1),
          ),
        ),
      ),
  ]);

  const zip = new JSZip();

  zip.file(
    "Paid_SMCS.csv",
    writeCsv([
      ["Vc Number"],
      ...currPayments
        .filter((pay) => !pay.isMigration)
        .map((p) => [p.boxNumber]),
    ]),
  );

  const migrations = currPayments
    .filter((pay) => pay.isMigration)
    .reduce(
      (acc, payment) => {
        const packName = payment.to ?? "";
        const smcs = acc[packName] ?? [];
        acc[packName] = [...smcs, [payment.boxNumber]];
        return acc;
      },
      {} as { [key: string]: string[][] },
    );

  if (Object.keys(migrations).length > 0) {
    for (const pack in migrations) {
      zip.file(
        `MIGRATION_${pack.replaceAll(" ", "_")}.csv`,
        writeCsv([["Vc Number"], ...migrations[pack]]),
      );
    }
  }

  if (unpaidConnections.length > 0) {
    zip.file(
      "UNPAID_SMCS.csv",
      writeCsv([
        ["Vc Number"],
        ...unpaidConnections.map((con) => [con.boxNumber]),
      ]),
    );
  }

  const content = await zip.generateAsync({ type: "blob" });

  return new Response(content, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename=${format(start, "MMM-yyyy")}.zip`,
    },
  });
}

import { startOfMonth } from "date-fns";
import { and, eq, gte, lte } from "drizzle-orm";
import { nanoid } from "nanoid";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { basePacks, connections, payments } from "@/db/schema";
import { getOrg } from "@/lib/get-org";

export async function POST(req: NextRequest) {
  const connectionId = req.nextUrl.searchParams.get("connectionId");
  const to = req.nextUrl.searchParams.get("to");

  if (!connectionId || !to) {
    return NextResponse.json(
      { message: "Please provide required parameters to make migration." },
      { status: 400 },
    );
  }

  const org = await getOrg();

  const [connection, toPack] = await Promise.all([
    db.query.connections.findFirst({
      where: and(eq(connections.id, connectionId), eq(connections.org, org.id)),
    }),
    db.query.basePacks.findFirst({
      where: and(eq(basePacks.id, to), eq(basePacks.org, org.id)),
    }),
  ]);

  if (!connection) {
    return NextResponse.json(
      { message: "The connection you're trying to migrate doesn't exist" },
      { status: 400 },
    );
  }

  if (!toPack) {
    return NextResponse.json(
      { message: "The pack you've selected doesn't exist" },
      { status: 400 },
    );
  }

  if (connection.basePack === to) {
    return NextResponse.json(
      { message: "Choose a different pack" },
      { status: 400 },
    );
  }

  const now = new Date();

  const currentMonthPayment = await db.query.payments.findFirst({
    where: and(
      eq(payments.connection, connectionId),
      eq(payments.org, org.id),
      gte(payments.date, startOfMonth(now)),
      lte(payments.date, now),
    ),
  });

  if (
    currentMonthPayment?.isMigration &&
    currentMonthPayment.currentPack === to
  ) {
    return NextResponse.json(
      { message: "You can't migrate to the same pack" },
      { status: 400 },
    );
  }

  const data = await db.transaction(async (tx) => {
    let latestPayment: typeof payments.$inferInsert | undefined;

    if (currentMonthPayment) {
      latestPayment = (
        await tx
          .update(payments)
          .set({ to, isMigration: true, date: now })
          .where(
            and(
              eq(payments.org, org.id),
              eq(payments.id, currentMonthPayment.id),
            ),
          )
          .returning()
      )[0];
    } else {
      latestPayment = (
        await tx
          .insert(payments)
          .values({
            id: nanoid(),
            connection: connection.id,
            currentPack: connection.basePack,
            isMigration: true,
            to,
            lcoPrice: toPack.lcoPrice,
            customerPrice: toPack.customerPrice,
            date: now,
            org: org.id,
          })
          .returning()
      )[0];
    }

    await tx
      .update(connections)
      .set({ basePack: to, lastPayment: now })
      .where(
        and(eq(connections.org, org.id), eq(connections.id, connectionId)),
      );

    return { ...latestPayment, to: toPack };
  });

  return NextResponse.json(data, { status: 200 });
}

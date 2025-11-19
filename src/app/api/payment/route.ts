import { isThisMonth, startOfMonth } from "date-fns";
import { and, between, desc, eq, ne } from "drizzle-orm";
import { nanoid } from "nanoid";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { connections, payments } from "@/db/schema";
import { getOrg } from "@/lib/get-org";

export async function GET(req: NextRequest) {
  const connectionId = req.nextUrl.searchParams.get("connectionId");
  if (!connectionId) {
    return NextResponse.json(
      { message: "Please provide a connection id" },
      { status: 400 },
    );
  }

  const org = await getOrg();
  const data = await db.query.payments.findMany({
    where: and(eq(payments.org, org.id), eq(payments.connection, connectionId)),
    with: {
      currentPack: true,
      to: true,
    },
    orderBy: desc(payments.date),
  });

  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: NextRequest) {
  const connectionId = req.nextUrl.searchParams.get("connectionId");
  if (!connectionId) {
    return NextResponse.json(
      { message: "Please provide connection id" },
      { status: 400 },
    );
  }

  const org = await getOrg();

  const connection = await db.query.connections.findFirst({
    where: and(eq(connections.org, org.id), eq(connections.id, connectionId)),
    with: {
      basePack: true,
    },
  });

  if (!connection) {
    return NextResponse.json(
      {
        message:
          "The connection for the connectionId you have provided doesn't exist.",
      },
      { status: 400 },
    );
  }

  const now = new Date();
  const thisMonthPayment = await db
    .select({ id: payments.id })
    .from(payments)
    .where(
      and(
        eq(payments.connection, connectionId),
        eq(payments.org, org.id),
        between(payments.date, startOfMonth(now), now),
      ),
    );

  if (thisMonthPayment.length > 0) {
    return NextResponse.json(
      {
        message: "A payment for this month already exists for this connection.",
      },
      { status: 400 },
    );
  }

  const data = await db.transaction(async (tx) => {
    const [newPayments] = await Promise.all([
      tx
        .insert(payments)
        .values({
          id: nanoid(),
          connection: connectionId,
          currentPack: connection.basePack.id,
          org: org.id,
          lcoPrice: connection.basePack.lcoPrice,
          customerPrice: connection.basePack.customerPrice,
          date: now,
        })
        .returning(),
      tx
        .update(connections)
        .set({ lastPayment: now })
        .where(eq(connections.id, connection.id)),
    ]);

    return newPayments[0];
  });

  return NextResponse.json(
    { ...data, currentPack: connection.basePack },
    { status: 200 },
  );
}

export async function DELETE(req: NextRequest) {
  const paymentId = req.nextUrl.searchParams.get("paymentId");
  if (!paymentId) {
    return NextResponse.json(
      { message: "Please provide payment id" },
      { status: 400 },
    );
  }

  const org = await getOrg();

  const paymentToDelete = await db.query.payments.findFirst({
    where: and(eq(payments.org, org.id), eq(payments.id, paymentId)),
  });
  if (!paymentToDelete) {
    return NextResponse.json(
      { message: "The payment you're trying to delete doesn't exist" },
      { status: 400 },
    );
  }

  if (!isThisMonth(paymentToDelete.date)) {
    return NextResponse.json(
      { message: "You can only delete payments for the current month." },
      { status: 400 },
    );
  }

  await db.transaction(async (tx) => {
    const previousPayment = await tx.query.payments.findFirst({
      where: and(
        eq(payments.org, org.id),
        eq(payments.connection, paymentToDelete.connection),
        ne(payments.id, paymentToDelete.id),
      ),
      orderBy: desc(payments.date),
    });

    let lastPayment: Date | null = null;

    if (previousPayment) {
      lastPayment = previousPayment.date;
    }

    await tx
      .update(connections)
      .set({ lastPayment, basePack: paymentToDelete.currentPack })
      .where(
        and(
          eq(connections.org, org.id),
          eq(connections.id, paymentToDelete.connection),
        ),
      );
    await tx
      .delete(payments)
      .where(and(eq(payments.org, org.id), eq(payments.id, paymentId)));
  });

  return NextResponse.json({}, { status: 200 });
}

"use server";

import { isThisMonth, startOfMonth } from "date-fns";
import { and, desc, eq, gte, lte, ne } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getOrg } from "@/lib/get-org";
import "server-only";
import { db } from "./drizzle";
import { basePacks, connections, payments } from "./schema";

export async function markConnectionAsPaid(connectionId: string) {
  const org = await getOrg();
  const currConnection = await db.query.connections.findFirst({
    where: and(eq(connections.org, org.id), eq(connections.id, connectionId)),
    with: { basePack: true },
  });

  if (!currConnection) {
    throw new Error(
      `No connection found for the provided connectionId: ${connectionId}`,
    );
  }

  const lastPayment = currConnection?.lastPayment;
  if (lastPayment && isThisMonth(lastPayment)) {
    throw new Error("This connection has already been marked as paid");
  }

  const data = await db.transaction(async (tx) => {
    const now = new Date();
    const [newPayments] = await Promise.all([
      tx
        .insert(payments)
        .values({
          id: nanoid(),
          connection: connectionId,
          currentPack: currConnection.basePack.id,
          org: org.id,
          lcoPrice: currConnection.basePack.lcoPrice,
          customerPrice: currConnection.basePack.customerPrice,
          date: now,
        })
        .returning(),
      tx
        .update(connections)
        .set({ lastPayment: now })
        .where(eq(connections.id, connectionId)),
    ]);

    return newPayments[0];
  });

  return { ...data, currentPack: currConnection.basePack, to: null };
}

export async function deletePayment(paymentId: string) {
  const org = await getOrg();
  const paymentToDelete = await db.query.payments.findFirst({
    where: and(eq(payments.org, org.id), eq(payments.id, paymentId)),
  });

  if (!paymentToDelete) {
    throw new Error("No payment found with the given ID.");
  }
  if (!isThisMonth(paymentToDelete.date)) {
    throw new Error("Only payments of this month can be deleted");
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
}

export async function migrateConnection(
  connectionId: string,
  toPackId: string,
) {
  const org = await getOrg();

  const [connection, toPack] = await Promise.all([
    db.query.connections.findFirst({
      where: and(eq(connections.id, connectionId), eq(connections.org, org.id)),
      with: { basePack: true },
    }),
    db.query.basePacks.findFirst({
      where: and(eq(basePacks.id, toPackId), eq(basePacks.org, org.id)),
    }),
  ]);

  if (!connection) {
    throw new Error("The connection you're trying to migrate doesn't exist");
  }
  if (!toPack) {
    throw new Error("The pack you've selected doesn't exist");
  }
  if (connection.basePack === toPackId) {
    throw new Error("Choose a different pack");
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
    currentMonthPayment.currentPack === toPackId
  ) {
    throw new Error("You can't migrate to the same pack");
  }

  const data = await db.transaction(async (tx) => {
    let latestPayment: typeof payments.$inferSelect | undefined;

    if (currentMonthPayment) {
      latestPayment = (
        await tx
          .update(payments)
          .set({ to: toPackId, isMigration: true, date: now })
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
            to: toPackId,
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
      .set({ basePack: toPackId, lastPayment: now })
      .where(
        and(eq(connections.org, org.id), eq(connections.id, connectionId)),
      );

    return latestPayment;
  });

  return {
    ...data,
    connection: { name: connection.name },
    currentPack: connection.basePack,
    to: toPack,
  };
}

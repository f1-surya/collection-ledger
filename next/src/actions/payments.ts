"use server";

import { isThisMonth, startOfMonth } from "date-fns";
import { and, desc, eq, gte, lte, ne } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getOrg } from "@/lib/get-org";
import "server-only";
import { db } from "../db/drizzle";
import {
  basePacks,
  connectionAddons,
  connections,
  payments,
} from "../db/schema";
import { type ActionResult, fail, ok, okVoid } from "./result-type";

export type PaymentItem = {
  id: string;
  name: string;
  lcoPrice: number;
  customerPrice: number;
};

type PaymentActionData = Omit<
  typeof payments.$inferSelect,
  "currentPack" | "to" | "connection"
> & {
  currentPack: typeof basePacks.$inferSelect;
  to: typeof basePacks.$inferSelect | null;
  connection: { name: string };
};

export async function getConnectionAddons(connectionId: string, orgId: string) {
  const items: PaymentItem[] = [];
  let addonsPrice = 0;
  let lcoPrice = 0;

  const currAddons = await db.query.connectionAddons.findMany({
    where: and(
      eq(connectionAddons.org, orgId),
      eq(connectionAddons.connection, connectionId),
    ),
    with: {
      addon: true,
    },
    columns: {
      createdAt: false,
      org: false,
    },
  });

  if (currAddons.length > 0) {
    for (const c of currAddons) {
      addonsPrice += c.addon.customerPrice;
      lcoPrice += c.addon.lcoPrice;
      items.push(c.addon);
    }
  }

  return { addonsPrice, lcoPrice, items };
}

export async function markConnectionAsPaid(
  connectionId: string,
): Promise<ActionResult<PaymentActionData>> {
  try {
    const org = await getOrg();
    const currConnection = await db.query.connections.findFirst({
      where: and(eq(connections.org, org.id), eq(connections.id, connectionId)),
      with: { basePack: true },
    });

    if (!currConnection) {
      return fail(
        `No connection found for the provided connectionId: ${connectionId}`,
      );
    }

    const lastPayment = currConnection.lastPayment;
    if (lastPayment && isThisMonth(lastPayment)) {
      return fail("This connection has already been marked as paid");
    }

    const data = await db.transaction(async (tx) => {
      const now = new Date();
      const basePack = currConnection.basePack;
      const { addonsPrice, lcoPrice, items } = await getConnectionAddons(
        connectionId,
        org.id,
      );
      items.push({
        id: basePack.id,
        name: basePack.name,
        lcoPrice: basePack.lcoPrice,
        customerPrice: basePack.customerPrice,
      });

      const [newPayments] = await Promise.all([
        tx
          .insert(payments)
          .values({
            id: nanoid(),
            connection: connectionId,
            currentPack: currConnection.basePack.id,
            org: org.id,
            lcoPrice: basePack.lcoPrice + lcoPrice,
            customerPrice: basePack.customerPrice + addonsPrice,
            items,
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

    return ok({
      ...data,
      currentPack: currConnection.basePack,
      to: null,
      connection: { name: currConnection.name },
    });
  } catch (e) {
    console.error(e);
    return fail("Something went wrong");
  }
}

export async function deletePayment(
  paymentId: string,
): Promise<ActionResult<void>> {
  try {
    const org = await getOrg();
    const paymentToDelete = await db.query.payments.findFirst({
      where: and(eq(payments.org, org.id), eq(payments.id, paymentId)),
    });

    if (!paymentToDelete) {
      return fail("No payment found with the given ID.");
    }
    if (!isThisMonth(paymentToDelete.date)) {
      return fail("Only payments of this month can be deleted");
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

    return okVoid();
  } catch (e) {
    console.error(e);
    return fail("Something went wrong");
  }
}

export async function migrateConnection(
  connectionId: string,
  toPackId: string,
): Promise<ActionResult<PaymentActionData>> {
  try {
    const org = await getOrg();

    const [connection, toPack] = await Promise.all([
      db.query.connections.findFirst({
        where: and(
          eq(connections.id, connectionId),
          eq(connections.org, org.id),
        ),
        with: { basePack: true },
      }),
      db.query.basePacks.findFirst({
        where: and(eq(basePacks.id, toPackId), eq(basePacks.org, org.id)),
      }),
    ]);

    if (!connection) {
      return fail("The connection you're trying to migrate doesn't exist");
    }
    if (!toPack) {
      return fail("The pack you've selected doesn't exist");
    }
    if (connection.basePack === toPackId) {
      return fail("Choose a different pack");
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
      return fail("You can't migrate to the same pack");
    }

    const { addonsPrice, lcoPrice, items } = await getConnectionAddons(
      connectionId,
      org.id,
    );

    const data = await db.transaction(async (tx) => {
      let latestPayment: typeof payments.$inferSelect | undefined;

      if (currentMonthPayment) {
        latestPayment = (
          await tx
            .update(payments)
            .set({
              to: toPackId,
              isMigration: true,
              date: now,
              customerPrice: toPack.customerPrice + addonsPrice,
              lcoPrice: toPack.lcoPrice + lcoPrice,
              items: [
                ...items,
                {
                  id: toPack.id,
                  name: toPack.name,
                  lcoPrice: toPack.lcoPrice,
                  customerPrice: toPack.customerPrice,
                },
              ],
            })
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
              currentPack: connection.basePack.id,
              isMigration: true,
              to: toPackId,
              lcoPrice: toPack.lcoPrice + lcoPrice,
              customerPrice: toPack.customerPrice + addonsPrice,
              date: now,
              items: [
                ...items,
                {
                  id: toPack.id,
                  name: toPack.name,
                  lcoPrice: toPack.lcoPrice,
                  customerPrice: toPack.customerPrice,
                },
              ],
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

    return ok({
      ...data,
      connection: { name: connection.name },
      currentPack: connection.basePack,
      to: toPack,
    });
  } catch (e) {
    console.error(e);
    return fail("Something went wrong");
  }
}

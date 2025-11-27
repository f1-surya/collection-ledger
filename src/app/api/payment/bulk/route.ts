import { isThisMonth } from "date-fns";
import { and, eq, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";
import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import { db } from "@/db/drizzle";
import { basePacks, connections, payments } from "@/db/schema";
import { getOrg } from "@/lib/get-org";

const schema = z.object({
  smcs: z.array(z.string()).min(1),
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { data, error } = schema.safeParse(json);
  if (error) {
    return NextResponse.json(
      { message: "Please provide SMCs list to pay." },
      { status: 409 },
    );
  }

  const org = await getOrg();
  const now = new Date();

  const allCons = await db
    .select({
      id: connections.id,
      name: connections.name,
      boxNumber: connections.boxNumber,
      lastPayment: connections.lastPayment,
      basePack: { ...basePacks },
    })
    .from(connections)
    .where(
      and(
        inArray(connections.boxNumber, data.smcs),
        eq(connections.org, org.id),
      ),
    )
    .innerJoin(basePacks, eq(connections.basePack, basePacks.id));

  const [consToPay, consToIgnore] = allCons.reduce(
    ([a, b], item) => {
      if (!item.lastPayment || !isThisMonth(item.lastPayment)) {
        a.push(item);
      } else {
        b.push(item);
      }
      return [a, b];
    },
    [[], []] as [typeof allCons, typeof allCons],
  );

  if (consToPay.length === 0) {
    return NextResponse.json({
      paid: [],
      ignored: consToIgnore.map((con) => [con.name, con.boxNumber]),
    });
  }

  await db.transaction(async (tx) => {
    const newPayments = consToPay.map((con) => ({
      id: nanoid(),
      connection: con.id,
      date: now,
      currentPack: con.basePack.id,
      lcoPrice: con.basePack.lcoPrice,
      customerPrice: con.basePack.customerPrice,
      items: [
        {
          id: con.basePack.id,
          name: con.basePack.name,
          lcoPrice: con.basePack.lcoPrice,
          customerPrice: con.basePack.customerPrice,
        },
      ],
      org: org.id,
    }));

    await Promise.all([
      tx
        .insert(payments)
        // @ts-expect-error It'll be okay in runtime
        .values(newPayments),
      tx
        .update(connections)
        .set({ lastPayment: now })
        .where(
          and(
            eq(connections.org, org.id),
            inArray(
              connections.id,
              consToPay.map((con) => con.id),
            ),
          ),
        ),
    ]);
  });

  return NextResponse.json({
    paid: consToPay.map((con) => [con.name, con.boxNumber]),
    ignored: consToIgnore.map((con) => [con.name, con.boxNumber]),
  });
}

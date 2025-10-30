"use server";

import { count, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { basePacks, connections } from "@/db/schema";
import "server-only";
import { getOrg } from "./get-org";

export async function getBasePacks() {
  const org = await getOrg();
  const packs = await db
    .select({
      id: basePacks.id,
      name: basePacks.name,
      lcoPrice: basePacks.lcoPrice,
      customerPrice: basePacks.customerPrice,
      connections: count(connections.id),
    })
    .from(basePacks)
    .where(eq(basePacks.org, org.id))
    .leftJoin(connections, eq(connections.basePack, basePacks.id))
    .groupBy(basePacks.id)
    .orderBy(basePacks.name);

  return packs;
}

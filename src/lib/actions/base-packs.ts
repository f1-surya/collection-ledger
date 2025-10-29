"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { basePacks } from "@/db/schema";
import "server-only";
import { getOrg } from "../get-org";

export async function getBasePacks() {
  const org = await getOrg();
  const packs = await db
    .select({
      id: basePacks.id,
      name: basePacks.name,
      lcoPrice: basePacks.lcoPrice,
      customerPrice: basePacks.customerPrice,
    })
    .from(basePacks)
    .where(eq(basePacks.org, org.id));

  // Add connections count (currently hardcoded to 0 until connections table is implemented)
  return packs.map((pack) => ({ ...pack, connections: 0 }));
}

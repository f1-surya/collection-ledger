"use server";

import { count, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { addons, connectionAddons } from "@/db/schema";
import "server-only";
import { getOrg } from "./get-org";

export async function getAddons() {
  const org = await getOrg();
  const addonList = await db
    .select({
      id: addons.id,
      name: addons.name,
      lcoPrice: addons.lcoPrice,
      customerPrice: addons.customerPrice,
      connections: count(connectionAddons.id),
    })
    .from(addons)
    .where(eq(addons.org, org.id))
    .leftJoin(connectionAddons, eq(connectionAddons.addonId, addons.id))
    .groupBy(addons.id)
    .orderBy(addons.name);

  return addonList;
}

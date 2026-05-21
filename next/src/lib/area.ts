"use server";

import { count, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { areas, connections } from "@/db/schema";
import "server-only";
import { getOrg } from "./get-org";

export async function getAreas() {
  const org = await getOrg();
  const orgAreas = await db
    .select({
      id: areas.id,
      name: areas.name,
      connections: count(connections.id),
    })
    .from(areas)
    .where(eq(areas.org, org.id))
    .leftJoin(connections, eq(connections.area, areas.id))
    .groupBy(areas.id)
    .orderBy(areas.name);

  return orgAreas;
}

"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { areas } from "@/db/schema";
import "server-only";
import { getOrg } from "./get-org";

export async function getAreas() {
  const org = await getOrg();
  const orgAreas = await db
    .select({ id: areas.id, name: areas.name })
    .from(areas)
    .where(eq(areas.org, org.id))
    .orderBy(areas.name);

  return orgAreas;
}

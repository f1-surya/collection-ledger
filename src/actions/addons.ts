"use server";

import { and, count, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { addons, connectionAddons } from "@/db/schema";
import "server-only";
import { nanoid } from "nanoid";
import z from "zod";
import type { Addon } from "@/app/dashboard/addons/_components/types";
import { getOrg } from "../lib/get-org";
import type { ActionResult } from "./result-type";

const createSchema = z.object({
  name: z.string().min(3).toUpperCase(),
  lcoPrice: z.string().transform((v) => parseInt(v, 10)),
  customerPrice: z.string().transform((v) => parseInt(v, 10)),
});

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

export async function createNewAddon(data: {
  [k: string]: FormDataEntryValue;
}): Promise<ActionResult<Addon>> {
  const parsed = createSchema.safeParse(data);
  if (parsed.error) {
    return {
      success: false,
      error: "Wrong data format",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    const org = await getOrg();
    const rows = await db
      .insert(addons)
      .values({ id: nanoid(), ...parsed.data, org: org.id })
      .returning();
    return { success: true, data: rows[0] };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Something went wrong" };
  }
}

const updateSchema = createSchema.extend({ id: z.nanoid() });

export async function updateAddon(addon: {
  [k: string]: FormDataEntryValue;
}): Promise<ActionResult<Addon>> {
  const org = await getOrg();
  const res = updateSchema.safeParse(addon);

  if (res.error) {
    return {
      success: false,
      error: "Validation error",
      fieldErrors: z.flattenError(res.error).fieldErrors,
    };
  }

  const data = res.data;
  try {
    const rows = await db
      .update(addons)
      .set({
        name: data.name,
        lcoPrice: data.lcoPrice,
        customerPrice: data.customerPrice,
      })
      .where(and(eq(addons.org, org.id), eq(addons.id, data.id)))
      .returning();
    return { success: true, data: rows[0] };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Something went wrong" };
  }
}

export async function deleteAddon(id: string): Promise<ActionResult> {
  const res = z.nanoid().safeParse(id);

  if (res.error) {
    return { success: false, error: "Provide a valid ID" };
  }

  try {
    const org = await getOrg();
    const conns = await db
      .select({ id: connectionAddons.id })
      .from(connectionAddons)
      .where(
        and(eq(connectionAddons.addonId, id), eq(connectionAddons.org, org.id)),
      );

    if (conns.length > 0) {
      return {
        success: false,
        error:
          "Some connections are still using this addon. Until you remove them this can't be deleted",
      };
    }

    await db
      .delete(addons)
      .where(and(eq(addons.id, id), eq(addons.org, org.id)));

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Something went wrong" };
  }
}

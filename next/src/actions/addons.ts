"use server";

import { and, count, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { addons, connectionAddons, connections } from "@/db/schema";
import "server-only";
import { nanoid } from "nanoid";
import z from "zod";
import { getOrg } from "../lib/get-org";
import { fail, ok, okVoid } from "./result-type";

const createSchema = z.object({
  name: z.string().min(3).toUpperCase(),
  lcoPrice: z.string().transform((v) => parseInt(v, 10)),
  customerPrice: z.string().transform((v) => parseInt(v, 10)),
});
const updateSchema = createSchema.extend({ id: z.nanoid() });
const Id = z.nanoid();

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
    .leftJoin(connectionAddons, eq(connectionAddons.addon, addons.id))
    .groupBy(addons.id)
    .orderBy(addons.name);

  return addonList;
}

export async function createNewAddon(data: {
  [k: string]: FormDataEntryValue;
}) {
  const parsed = createSchema.safeParse(data);
  if (parsed.error) {
    return fail("Wrong data format", z.flattenError(parsed.error).fieldErrors);
  }

  try {
    const org = await getOrg();
    const rows = await db
      .insert(addons)
      .values({ id: nanoid(), ...parsed.data, org: org.id })
      .returning();
    return ok(rows[0]);
  } catch (e) {
    console.error(e);
    return fail("Something went wrong");
  }
}

export async function updateAddon(addon: { [k: string]: FormDataEntryValue }) {
  const org = await getOrg();
  const res = updateSchema.safeParse(addon);

  if (res.error) {
    return fail("Validation error", z.flattenError(res.error).fieldErrors);
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
    return ok(rows[0]);
  } catch (e) {
    console.error(e);
    return fail("Something went wrong");
  }
}

export async function deleteAddon(id: string) {
  const res = z.nanoid().safeParse(id);

  if (res.error) {
    return fail("Provide a valid ID");
  }

  try {
    const org = await getOrg();
    const conns = await db
      .select({ id: connectionAddons.id })
      .from(connectionAddons)
      .where(
        and(eq(connectionAddons.addon, id), eq(connectionAddons.org, org.id)),
      );

    if (conns.length > 0) {
      return fail(
        "Some connections are still using this addon. Until you remove them this can't be deleted",
      );
    }

    await db
      .delete(addons)
      .where(and(eq(addons.id, id), eq(addons.org, org.id)));

    return okVoid();
  } catch (e) {
    console.error(e);
    return fail("Something went wrong");
  }
}

export async function connectAddon(connectionId: string, addonId: string) {
  const conRes = Id.safeParse(connectionId);
  const addonRes = Id.safeParse(addonId);

  if (conRes.error || addonRes.error) {
    return fail("Provide a proper ID.");
  }

  const org = await getOrg();
  try {
    const prev = await db.query.connectionAddons.findFirst({
      where: and(
        eq(connectionAddons.org, org.id),
        eq(connectionAddons.connection, conRes.data),
        eq(connectionAddons.addon, addonRes.data),
      ),
    });
    if (prev) {
      return fail(
        "This addon is already added to the connection you've provided",
      );
    }

    const [con, addon] = await Promise.all([
      db
        .select({ id: connections.id })
        .from(connections)
        .where(
          and(eq(connections.org, org.id), eq(connections.id, connectionId)),
        ),
      db
        .select({ id: addons.id })
        .from(addons)
        .where(and(eq(addons.org, org.id), eq(addons.id, addonId))),
    ]);

    if (con.length === 0) {
      return fail("The connection you've specified doesn't exist");
    }

    if (addon.length === 0) {
      return fail("The addon you've specified doesn't exist");
    }

    const rows = await db
      .insert(connectionAddons)
      .values({
        id: nanoid(),
        org: org.id,
        connection: connectionId,
        addon: addonId,
      })
      .returning();
    return ok(rows);
  } catch (e) {
    console.error(e);
    return fail("Something went wrong");
  }
}

export async function removeAddon(id: string) {
  const res = Id.safeParse(id);

  if (res.error) return fail("Provide a proper id");

  const org = await getOrg();

  try {
    await db
      .delete(connectionAddons)
      .where(
        and(eq(connectionAddons.org, org.id), eq(connectionAddons.id, id)),
      );

    return okVoid();
  } catch (e) {
    console.error(e);
    return fail("Something went wrong");
  }
}

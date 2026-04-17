import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import { db } from "@/db/drizzle";
import { addons, connectionAddons } from "@/db/schema";
import { getAddons } from "@/lib/addons";
import { getOrg } from "@/lib/get-org";

const addonSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, { message: "Addon name must be at least 1 character long" })
    .toUpperCase(),
  lcoPrice: z.coerce.number().min(0),
  customerPrice: z.coerce.number().min(0),
});

export async function GET() {
  const addonList = await getAddons();
  return NextResponse.json(addonList);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const name = formData.get("name")?.toString();
  const lcoPrice = formData.get("lcoPrice")?.toString();
  const customerPrice = formData.get("customerPrice")?.toString();

  if (!name || !lcoPrice || !customerPrice) {
    return NextResponse.json(
      { message: "Name, LCO price, and customer price are required" },
      { status: 400 },
    );
  }

  const org = await getOrg();
  const newAddon = await db
    .insert(addons)
    .values({
      id: nanoid(),
      name: name.toUpperCase(),
      lcoPrice: parseInt(lcoPrice, 10),
      customerPrice: parseInt(customerPrice, 10),
      org: org.id,
    })
    .returning();

  return NextResponse.json({ ...newAddon[0], connections: 0 });
}

export async function PUT(req: NextRequest) {
  const { data, error } = addonSchema.safeParse(
    Object.fromEntries((await req.formData()).entries()),
  );

  if (error) {
    return NextResponse.json(
      {
        message: error.issues.map(
          (issue) => `${issue.path.join(".")} needs to be ${issue.message}`,
        ),
      },
      { status: 400 },
    );
  }

  const org = await getOrg();
  const updated = await db
    .update(addons)
    .set({
      name: data.name,
      lcoPrice: data.lcoPrice,
      customerPrice: data.customerPrice,
    })
    .where(and(eq(addons.org, org.id), eq(addons.id, data.id)))
    .returning();

  return NextResponse.json({ ...updated[0], connections: 0 });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { message: "Id of the addon to be deleted must be provided" },
      { status: 400 },
    );
  }

  const conns = await db
    .select({ id: connectionAddons.id })
    .from(connectionAddons)
    .where(eq(connectionAddons.addonId, id));

  if (conns.length > 0) {
    return NextResponse.json(
      {
        message:
          "There are a few connections using this addon, so it can't be deleted.",
      },
      { status: 409 },
    );
  }

  const org = await getOrg();
  await db.delete(addons).where(and(eq(addons.id, id), eq(addons.org, org.id)));

  return new Response(null, { status: 200 });
}

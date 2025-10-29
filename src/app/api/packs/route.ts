import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import { db } from "@/db/drizzle";
import { basePacks } from "@/db/schema";
import { getBasePacks } from "@/lib/actions/base-packs";
import { getOrg } from "@/lib/get-org";

const packSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, { message: "Pack name must be at least 1 character long" })
    .toUpperCase(),
  lcoPrice: z.coerce.number().min(0),
  customerPrice: z.coerce.number().min(0),
});

export async function GET() {
  const packs = await getBasePacks();
  return NextResponse.json(packs);
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
  const newPack = await db
    .insert(basePacks)
    .values({
      id: nanoid(),
      name: name.toUpperCase(),
      lcoPrice: parseInt(lcoPrice, 10),
      customerPrice: parseInt(customerPrice, 10),
      org: org.id,
    })
    .returning();

  return NextResponse.json({ ...newPack[0], connections: 0 });
}

export async function PUT(req: NextRequest) {
  const { data, error } = packSchema.safeParse(
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
    .update(basePacks)
    .set({
      name: data.name,
      lcoPrice: data.lcoPrice,
      customerPrice: data.customerPrice,
    })
    .where(and(eq(basePacks.org, org.id), eq(basePacks.id, data.id)))
    .returning();
  return NextResponse.json({ ...updated[0], connections: 0 });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { message: "Id of the pack to be deleted must be provided" },
      { status: 400 },
    );
  }

  await db.delete(basePacks).where(eq(basePacks.id, id));

  return new Response(null, { status: 200 });
}

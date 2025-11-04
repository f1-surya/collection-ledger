import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import { db } from "@/db/drizzle";
import { areas, connections } from "@/db/schema";
import { getOrg } from "@/lib/get-org";

const areaSchema = z.object({
  id: z.nanoid(),
  name: z
    .string()
    .min(3, { message: "Area name must be at least 3 letters long" })
    .toUpperCase(),
});

export async function GET() {
  const org = await getOrg();

  const currAreas = await db.query.areas.findMany({
    where: eq(areas.org, org.id),
  });

  return NextResponse.json(currAreas);
}

export async function POST(req: NextRequest) {
  const name = (await req.formData()).get("name")?.toString();

  if (!name) {
    return NextResponse.json(
      { message: "Name should be provided to create an area" },
      { status: 400 },
    );
  }

  const org = await getOrg();
  const newArea = await db
    .insert(areas)
    .values({ id: nanoid(), name: name.toUpperCase(), org: org.id })
    .returning();

  return NextResponse.json(newArea[0]);
}

export async function PUT(req: NextRequest) {
  const { data, error } = areaSchema.safeParse(
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
    .update(areas)
    .set({ name: data.name })
    .where(and(eq(areas.org, org.id), eq(areas.id, data.id)))
    .returning();
  return NextResponse.json(updated[0]);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { message: "Id of the area to be deleted must be provided" },
      { status: 400 },
    );
  }

  const org = await getOrg();
  const conns = await db
    .select({ id: connections.id })
    .from(connections)
    .where(and(eq(connections.area, id), eq(connections.org, org.id)));

  if (conns.length > 0) {
    return NextResponse.json(
      {
        message:
          "There are a few connections in this area, so it can't be deleted.",
      },
      { status: 409 },
    );
  }

  await db.delete(areas).where(and(eq(areas.id, id), eq(areas.org, org.id)));

  return new Response(null, { status: 200 });
}

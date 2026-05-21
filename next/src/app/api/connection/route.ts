import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { connections } from "@/db/schema";
import { getOrg } from "@/lib/get-org";
import {
  connectionSchema,
  connectionUpdateSchema,
  formatZodErrors,
} from "@/lib/zod-stuff";

async function checkBoxNumber(boxNumber: string, orgId: string) {
  const connection = await db
    .select({ name: connections.name })
    .from(connections)
    .where(
      and(eq(connections.org, orgId), eq(connections.boxNumber, boxNumber)),
    );
  if (connection.length > 0) {
    return `Box number ${boxNumber} is already assigned to ${connection[0].name}`;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data, error } = connectionSchema.safeParse(body);
  if (error) {
    return NextResponse.json(formatZodErrors(error), { status: 400 });
  }

  const org = await getOrg();

  const conflict = await checkBoxNumber(data.boxNumber, org.id);
  if (conflict) {
    return NextResponse.json({ boxNumber: conflict }, { status: 400 });
  }

  await db.insert(connections).values({ id: nanoid(), ...data, org: org.id });

  return NextResponse.json({ message: "Connection saved successfully." });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  const { data, error } = connectionUpdateSchema.safeParse(body);

  if (error) {
    return NextResponse.json(formatZodErrors(error), { status: 400 });
  }

  const org = await getOrg();

  const oldConnection = await db.query.connections.findFirst({
    where: and(eq(connections.org, org.id), eq(connections.id, data.id)),
  });

  if (!oldConnection) {
    return NextResponse.json(
      { message: "The connection you're trying to edit doesn't exist." },
      { status: 404 },
    );
  }

  if (oldConnection.boxNumber !== data.boxNumber) {
    const conflict = await checkBoxNumber(data.boxNumber, org.id);
    if (conflict) {
      return NextResponse.json({ boxNumber: conflict }, { status: 400 });
    }
  }

  await db
    .update(connections)
    .set({ ...data })
    .where(and(eq(connections.org, org.id), eq(connections.id, body.id)));

  return NextResponse.json({ message: "Connection updated successfully." });
}

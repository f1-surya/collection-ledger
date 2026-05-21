import { and, desc, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { payments } from "@/db/schema";
import { getOrg } from "@/lib/get-org";

export async function GET(req: NextRequest) {
  const connectionId = req.nextUrl.searchParams.get("connectionId");
  if (!connectionId) {
    return NextResponse.json(
      { message: "Please provide a connection id" },
      { status: 400 },
    );
  }

  const org = await getOrg();
  const data = await db.query.payments.findMany({
    where: and(eq(payments.org, org.id), eq(payments.connection, connectionId)),
    with: {
      currentPack: true,
      to: true,
    },
    orderBy: desc(payments.date),
  });

  return NextResponse.json(data, { status: 200 });
}

import { type NextRequest, NextResponse } from "next/server";
import { authedFetch } from "@/lib/authed-fetch";

export async function POST(req: NextRequest) {
  const connectionId = req.nextUrl.searchParams.get("connectionId");
  if (!connectionId) {
    return NextResponse.json(
      { message: "Please provide connection id" },
      { status: 400 },
    );
  }

  const { error } = await authedFetch(
    `/payment?connectionId=${connectionId}`,
    {
      method: "POST",
    },
    true,
  );
  if (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }

  return NextResponse.json({}, { status: 200 });
}

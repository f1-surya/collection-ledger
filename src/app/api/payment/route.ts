import { type NextRequest, NextResponse } from "next/server";
import type { Payment } from "@/app/dashboard/connections/[boxNumber]/_components/types";
import { authedFetch } from "@/lib/authed-fetch";

export async function GET(req: NextRequest) {
  const connectionId = req.nextUrl.searchParams.get("connectionId");
  if (!connectionId) {
    return NextResponse.json(
      { message: "Please provide connection id" },
      { status: 400 },
    );
  }

  const { data, error } = await authedFetch(`/payment/${connectionId}`);
  if (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: NextRequest) {
  const connectionId = req.nextUrl.searchParams.get("connectionId");
  if (!connectionId) {
    return NextResponse.json(
      { message: "Please provide connection id" },
      { status: 400 },
    );
  }

  const { data, error } = await authedFetch<Payment>(
    `/payment?connectionId=${connectionId}`,
    {
      method: "POST",
    },
  );
  if (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

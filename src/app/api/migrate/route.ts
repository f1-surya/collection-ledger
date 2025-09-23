import { type NextRequest, NextResponse } from "next/server";
import type { Payment } from "@/app/dashboard/connections/[boxNumber]/_components/types";
import { authedFetch } from "@/lib/authed-fetch";

export async function POST(req: NextRequest) {
  const connectionId = req.nextUrl.searchParams.get("connectionId");
  const to = req.nextUrl.searchParams.get("to");

  if (!connectionId || !to) {
    return NextResponse.json(
      { message: "Please provide required parameters to make migration." },
      { status: 400 },
    );
  }

  const { data, error } = await authedFetch<Payment>(
    `/payment/migrate?connectionId=${connectionId}&to=${to}`,
    {
      method: "POST",
    },
  );

  if (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

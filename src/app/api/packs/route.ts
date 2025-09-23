import { NextResponse } from "next/server";
import type { BasePack } from "@/app/dashboard/base-packs/_components/types";
import { authedFetch } from "@/lib/authed-fetch";

export async function GET() {
  const { data, error } = await authedFetch<BasePack>("/pack");

  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: error.status },
    );
  }

  return NextResponse.json(data);
}

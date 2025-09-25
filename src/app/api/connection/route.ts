import { type NextRequest, NextResponse } from "next/server";
import { authedFetch } from "@/lib/authed-fetch";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { error } = await authedFetch(
    "/connection",
    { method: "POST", body: JSON.stringify(body) },
    true,
  );
  if (error) {
    if (error.status === 500) {
      console.error(error);
    }
    return NextResponse.json(error.errorData, { status: error.status });
  }

  return NextResponse.json({ message: "Connection saved successfully." });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  const { error } = await authedFetch(
    "/connection",
    { method: "PUT", body: JSON.stringify(body) },
    true,
  );
  if (error) {
    if (error.status === 500) {
      console.error(error);
    }
    console.error(error);
    return NextResponse.json(error.errorData, { status: error.status });
  }

  return NextResponse.json({ message: "Connection updated successfully." });
}

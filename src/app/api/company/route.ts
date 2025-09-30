import { NextResponse } from "next/server";
import handleSession from "@/lib/handle-session";

export async function GET() {
  const token = await handleSession();

  const res = await fetch(`${process.env.API_URL}/company`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    return NextResponse.json(
      { message: error.message },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieJar = await cookies();

  const res = await fetch(`${process.env.API_URL}/company`, {
    headers: {
      Authorization: `Bearer ${cookieJar.get("access_token")?.value}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const error = await res.json();
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  const data = await res.json();
  return NextResponse.json(data);
}

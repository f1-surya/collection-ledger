import { type NextRequest, NextResponse } from "next/server";
import handleSession from "@/lib/handle-session";

export async function POST(req: NextRequest) {
  const accessToken = await handleSession();
  const body = await req.json();

  const res = await fetch(`${process.env.API_URL}/connection`, {
    method: "POST",
    headers: {
      Authorization: `Bearen ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const content = await res.json();
    if (res.status === 500) {
      console.error(content);
    }
    return NextResponse.json(content, { status: res.status });
  }

  return NextResponse.json({ message: "Connection saved successfully." });
}

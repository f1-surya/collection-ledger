import { NextResponse } from "next/server";
import handleSession from "@/lib/handle-session";

export async function GET() {
  const accessToken = await handleSession();

  const res = await fetch(`${process.env.API_URL}/area`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    const areas = await res.json();
    return NextResponse.json(areas);
  }

  const error = await res.json();
  console.error(error);
  return NextResponse.json(
    { message: "Something went wrong" },
    { status: 500 },
  );
}

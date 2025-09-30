import { type NextRequest, NextResponse } from "next/server";
import handleSession from "@/lib/handle-session";

export async function GET(req: NextRequest) {
  const token = await handleSession();
  const res = await fetch(
    `${process.env.API_URL}/data-transfer/payments?${req.nextUrl.searchParams}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    console.error("Failed to fetch data:", await res.text());
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: res.status },
    );
  }

  return new Response(await res.blob(), {
    headers: {
      "Content-Type":
        res.headers.get("Content-Type") || "application/octet-stream",
    },
  });
}

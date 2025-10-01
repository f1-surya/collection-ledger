import { NextResponse } from "next/server";
import handleSession from "@/lib/handle-session";

export async function GET() {
  const token = await handleSession();

  const res = await fetch(`${process.env.API_URL}/data-transfer/export`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error(await res.text());
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: res.status },
    );
  }

  const blob = await res.blob();

  return new NextResponse(blob, {
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });
}

export async function POST(request: Request) {
  const token = await handleSession();

  const res = await fetch(`${process.env.API_URL}/data-transfer/import`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    body: await request.arrayBuffer(),
  });

  if (!res.ok) {
    console.error(await res.text());
    return NextResponse.json(
      { error: "Failed to import data" },
      { status: res.status },
    );
  }

  return NextResponse.json({ message: "Data imported successfully" });
}

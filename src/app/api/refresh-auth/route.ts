import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieJar = await cookies();
  const destiny = req.nextUrl.searchParams.get("redirect");
  const refreshToken = cookieJar.get("refresh_token")?.value;
  if (!refreshToken) {
    redirect("/login");
  }
  const res = await fetch(`${process.env.API_URL}/auth/refresh`, {
    method: "POST",
    body: JSON.stringify({ token: refreshToken }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    const tokens = await res.json();
    cookieJar.set("access_token", tokens.accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 15,
    });
    cookieJar.set("refresh_token", tokens.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });
    return NextResponse.redirect(new URL(destiny ?? "/dashboard", req.url));
  } else {
    cookieJar.delete("refresh_token");
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

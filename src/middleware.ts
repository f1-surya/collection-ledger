import { type NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  if (!req.cookies.has("access_token")) {
    if (!req.cookies.has("refresh_token")) {
      return NextResponse.redirect("/login");
    }
    const redirectUrl = new URL("/api/refresh-auth", req.url);
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/create-company", "/dashboard/:path*"],
};

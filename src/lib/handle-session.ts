import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function handleSession(): Promise<string> {
  const cookieJar = await cookies();
  const accessToken = cookieJar.get("access_token")?.value;

  if (!accessToken) {
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

      return tokens.accessToken;
    } else {
      redirect("/error");
    }
  }

  return accessToken;
}

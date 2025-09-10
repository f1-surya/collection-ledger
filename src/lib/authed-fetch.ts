import { cookies } from "next/headers";
import "server-only";

export async function authedFetch<T>(
  url: string,
  options?: RequestInit,
  noJson?: boolean,
) {
  const cookieJar = await cookies();
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${cookieJar.get("access_token")?.value}`,
  };

  try {
    const res = await fetch(`${process.env.API_URL}${url}`, {
      ...options,
      headers: { ...defaultHeaders, ...options?.headers },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! Status: ${res.status}`);
    }

    if (noJson) return;

    return res.json() as Promise<T>;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

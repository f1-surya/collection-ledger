import { cookies } from "next/headers";
import "server-only";

type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: { status: number; message: string; error?: E; errorData: object };
};

type NoJson = {
  data: null;
  error: null;
};

type Result<T, E = Error> = Success<T> | Failure<E> | NoJson;

export async function authedFetch<T, E = Error>(
  url: string,
  options?: RequestInit,
  noJson?: false,
): Promise<Success<T> | Failure<E>>;

export async function authedFetch<E = Error>(
  url: string,
  options: RequestInit | undefined,
  noJson: true,
): Promise<NoJson | Failure<E>>;

export async function authedFetch<T, E = Error>(
  url: string,
  options?: RequestInit,
  noJson?: boolean,
): Promise<Result<T, E>> {
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
      return {
        data: null,
        error: {
          status: res.status,
          message:
            errorData.message || (`HTTP error! Status: ${res.status}` as E),
          errorData,
        },
      };
    }

    if (noJson) return { data: null, error: null };

    const data = (await res.json()) as T;

    return { data, error: null };
  } catch (e) {
    console.error(e);
    throw e;
  }
}

import { authedFetch } from "@/lib/authed-fetch";

export async function GET() {
  const { data, error } = await authedFetch("/user");
  if (error) {
    return new Response(error.message, { status: error.status });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

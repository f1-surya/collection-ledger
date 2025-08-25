import { cookies } from "next/headers";
import { columns } from "@/components/connections/columns";
import ConnectionView from "@/components/connections/connections";
import { ConnectionTable } from "@/components/connections/connections-table";

export default async function Connections() {
  const cookieJar = await cookies();

  const res = await fetch(`${process.env.API_URL}/connection`, {
    headers: {
      Authorization: `Bearer ${cookieJar.get("access_token")?.value}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    return (
      <div className="flex h-dvh w-dvw justify-center items-center">
        Something went wrong while fetching your connections.
      </div>
    );
  }
  const connections = await res.json();

  return (
    <main className="p-4">
      <ConnectionView connections={connections} />
    </main>
  );
}

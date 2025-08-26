import { cookies } from "next/headers";
import { columns } from "@/components/connections/columns";
import ConnectionsList from "@/components/connections/connections-list";
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

  const isMobile = cookieJar.get("is-mobile")?.value === "true";

  return (
    <main className="p-4">
      {isMobile ? (
        <ConnectionsList connections={connections} />
      ) : (
        <ConnectionTable columns={columns} data={connections} />
      )}
    </main>
  );
}

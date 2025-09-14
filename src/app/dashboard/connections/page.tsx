import { cookies } from "next/headers";
import { authedFetch } from "@/lib/authed-fetch";
import { type Connection, columns } from "./_components/columns";
import ConnectionsList from "./_components/connections-list";
import { ConnectionTable } from "./_components/connections-table";

export default async function Connections() {
  const { data, error } = await authedFetch<Connection[]>("/connection");

  const cookieJar = await cookies();

  if (error || !data) {
    return (
      <div className="flex h-dvh w-dvw justify-center items-center">
        Something went wrong while fetching your connections.
      </div>
    );
  }

  const isMobile = cookieJar.get("is-mobile")?.value === "true";

  return (
    <main className="p-4">
      {isMobile ? (
        <ConnectionsList connections={data} />
      ) : (
        <ConnectionTable columns={columns} data={data} />
      )}
    </main>
  );
}

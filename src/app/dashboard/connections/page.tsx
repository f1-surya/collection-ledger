import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/db/drizzle";
import { connections } from "@/db/schema";
import { getOrg } from "@/lib/get-org";
import { columns } from "./_components/columns";
import ConnectionsList from "./_components/connections-list";
import { ConnectionTable } from "./_components/connections-table";

export default async function Connections() {
  const [org, cookieJar] = await Promise.all([getOrg(), cookies()]);

  const conns = await db.query.connections.findMany({
    where: eq(connections.org, org.id),
    with: {
      area: true,
      basePack: true,
    },
    orderBy: connections.name,
  });

  const isMobile = cookieJar.get("is-mobile")?.value === "true";

  return (
    <main className="p-4">
      {isMobile ? (
        <ConnectionsList connections={conns} />
      ) : (
        <ConnectionTable columns={columns} data={conns} />
      )}
    </main>
  );
}

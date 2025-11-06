import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { connections } from "@/db/schema";
import { getOrg } from "@/lib/get-org";
import Connections from "./_components/connections";

export default async function ConnectionsPage() {
  const org = await getOrg();

  const conns = await db.query.connections.findMany({
    where: eq(connections.org, org.id),
    with: {
      area: true,
      basePack: true,
    },
    orderBy: connections.name,
  });

  return (
    <main className="p-4">
      <Connections connections={conns} />
    </main>
  );
}

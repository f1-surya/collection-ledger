import { and, eq, ilike, type SQL } from "drizzle-orm";
import { Suspense } from "react";
import { db } from "@/db/drizzle";
import { connections } from "@/db/schema";
import { getOrg } from "@/lib/get-org";
import Connections, { ConnectionsSkeleton } from "./_components/connections";

export default async function ConnectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: number }>;
}) {
  const { search, page } = await searchParams;
  const org = await getOrg();

  let filter: SQL | undefined = eq(connections.org, org.id);
  if (search && search.length > 0) {
    filter = and(
      eq(connections.org, org.id),
      ilike(connections.name, `%${search.trim()}%`),
    );
  }

  const count = await db.$count(connections, filter);
  const maxPages = Math.ceil(count / 20);

  const conns = await db.query.connections.findMany({
    where: filter,
    with: {
      area: true,
      basePack: true,
    },
    orderBy: connections.name,
    limit: 20,
    offset: Math.min(page ?? 0, maxPages - 1) * 20,
  });

  return (
    <main className="p-4">
      <Suspense fallback={<ConnectionsSkeleton />}>
        <Connections connections={conns} pages={Math.round(maxPages)} />
      </Suspense>
    </main>
  );
}

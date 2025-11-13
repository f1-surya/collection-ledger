import { and, eq, ilike, or, type SQL } from "drizzle-orm";
import { TvMinimal } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { db } from "@/db/drizzle";
import { connections } from "@/db/schema";
import { getOrg } from "@/lib/get-org";
import Connections, { ConnectionsSkeleton } from "./_components/connections";
import CreateConnection from "./_components/create";

export default async function ConnectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: number }>;
}) {
  const { search, page } = await searchParams;
  const [org, t] = await Promise.all([
    getOrg(),
    getTranslations("Connections"),
  ]);

  let filter: SQL | undefined = eq(connections.org, org.id);
  if (search && search.length > 0) {
    filter = and(
      eq(connections.org, org.id),
      or(
        ilike(connections.name, `%${search.trim().toUpperCase()}%`),
        ilike(connections.boxNumber, `%${search.trim().toUpperCase()}%`),
      ),
    );
  }

  const count = await db.$count(connections, filter);

  if (count === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <TvMinimal />
          </EmptyMedia>
          <EmptyTitle>{t("noConnections")}</EmptyTitle>
        </EmptyHeader>
        <CreateConnection />
      </Empty>
    );
  }

  const maxPages = Math.ceil(count / 20);

  const conns = await db.query.connections.findMany({
    where: filter,
    with: {
      area: true,
      basePack: true,
    },
    orderBy: connections.name,
    limit: 20,
    offset: (Math.min(page ?? 1, maxPages) - 1) * 20,
  });

  return (
    <main className="p-4">
      <Suspense fallback={<ConnectionsSkeleton />}>
        <Connections connections={conns} pages={Math.round(maxPages)} />
      </Suspense>
    </main>
  );
}

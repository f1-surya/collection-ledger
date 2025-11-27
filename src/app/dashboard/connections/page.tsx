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
import { areas, basePacks, connections } from "@/db/schema";
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

  if (count === 0 && !(page || searchParams)) {
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

  let currPage = Math.min(page ?? 1, maxPages) - 1;
  if (currPage < 0) {
    currPage = 0;
  }
  const conns = await db
    .select({
      id: connections.id,
      name: connections.name,
      boxNumber: connections.boxNumber,
      lastPayment: connections.lastPayment,
      phoneNumber: connections.phoneNumber,
      area: {
        id: areas.id,
        name: areas.name,
      },
      basePack: {
        id: basePacks.id,
        name: basePacks.name,
        lcoPrice: basePacks.lcoPrice,
        customerPrice: basePacks.customerPrice,
      },
    })
    .from(connections)
    .innerJoin(areas, eq(connections.area, areas.id))
    .innerJoin(basePacks, eq(connections.basePack, basePacks.id))
    .where(filter)
    .orderBy(connections.name)
    .limit(20)
    .offset(currPage * 20);

  return (
    <main className="p-4">
      <Suspense fallback={<ConnectionsSkeleton />}>
        <Connections connections={conns} pages={Math.round(maxPages)} />
      </Suspense>
    </main>
  );
}

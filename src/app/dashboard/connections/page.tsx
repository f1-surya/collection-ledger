import { and, eq, ilike, or } from "drizzle-orm";
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
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { search, page } = await searchParams;
  const [org, t] = await Promise.all([
    getOrg(),
    getTranslations("Connections"),
  ]);

  const q = search?.trim();
  const hasSearch = Boolean(q);
  const trimmed = search?.trim();
  const filter = hasSearch
    ? and(
        eq(connections.org, org.id),
        or(
          ilike(connections.name, `%${trimmed}%`),
          ilike(connections.boxNumber, `%${trimmed}%`),
        ),
      )
    : eq(connections.org, org.id);

  const perPage = 20;
  const parsedPage = Number(page);
  const requestedPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const count = hasSearch ? undefined : await db.$count(connections, filter);

  if (!hasSearch && count === 0 && !page) {
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

  const maxPages = hasSearch
    ? Number.POSITIVE_INFINITY
    : Math.max(1, Math.ceil((count ?? 0) / perPage));

  let currPage = Math.min(requestedPage, maxPages) - 1;
  if (currPage < 0) {
    currPage = 0;
  }
  const rows = await db
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
    .limit(hasSearch ? perPage + 1 : perPage)
    .offset(currPage * perPage);

  const hasNextPage = hasSearch && rows.length > perPage;
  const conns = hasNextPage ? rows.slice(0, perPage) : rows;
  const effectiveMaxPages = hasSearch
    ? currPage + (hasNextPage ? 2 : 1)
    : maxPages;

  return (
    <main className="p-4">
      <Suspense fallback={<ConnectionsSkeleton />}>
        <Connections
          connections={conns}
          pages={Math.round(effectiveMaxPages)}
        />
      </Suspense>
    </main>
  );
}

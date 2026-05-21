import { and, eq, ilike, or, sql } from "drizzle-orm";
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
import {
  addons,
  areas,
  basePacks,
  connectionAddons,
  connections,
} from "@/db/schema";
import { getOrg } from "@/lib/get-org";
import Connections, { ConnectionsSkeleton } from "./_components/connections";
import CreateConnection from "./_components/create";

const prepared = db
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
    addonPrices: sql<number>`
      COALESCE(
        (
          SELECT SUM(${addons.customerPrice})
          FROM ${addons}
          JOIN ${connectionAddons} ON ${addons.id} = ${connectionAddons.addon}
          WHERE ${connectionAddons.connection} = ${connections.id} AND ${connectionAddons.org} = ${sql.placeholder("orgId")}
        ),
        0
      )::integer
`,
    addonLcoPrices: sql<number>`
      COALESCE(
        (
          SELECT SUM(${addons.lcoPrice})
          FROM ${addons}
          JOIN ${connectionAddons} ON ${addons.id} = ${connectionAddons.addon}
          WHERE ${connectionAddons.connection} = ${connections.id} AND ${connectionAddons.org} = ${sql.placeholder("orgId")}
        ),
        0
      )::integer
`,
  })
  .from(connections)
  .innerJoin(areas, eq(connections.area, areas.id))
  .innerJoin(basePacks, eq(connections.basePack, basePacks.id))
  .where(
    and(
      eq(connections.org, sql.placeholder("orgId")),
      or(
        sql`${sql.placeholder("search")}::text is null`,
        ilike(connections.name, sql.placeholder("search")),
        ilike(connections.boxNumber, sql.placeholder("search")),
      ),
    ),
  )
  .orderBy(connections.name)
  .limit(sql.placeholder("limit"))
  .offset(sql.placeholder("offset"))
  .prepare("connections");

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
  const rows = await prepared.execute({
    orgId: org.id,
    search: hasSearch ? `%${trimmed}%` : null,
    limit: hasSearch ? perPage + 1 : perPage,
    offset: currPage * perPage,
  });

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

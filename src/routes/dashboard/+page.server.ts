import { db } from "$lib/server/db";
import {
  addons,
  areas,
  basePacks,
  connectionAddons,
  connections,
} from "$lib/server/db/schema";
import { sql, eq, and, or, ilike } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { getOrg } from "$lib/server/get-org";

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

export const load: PageServerLoad = async ({ url, request }) => {
  const search = url.searchParams.get("search");
  const page = url.searchParams.get("page");

  const org = await getOrg(request.headers);

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

  return { conns, pages: Math.round(effectiveMaxPages) };
};

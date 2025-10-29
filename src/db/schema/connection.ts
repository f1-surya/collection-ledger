import { index, integer, pgTable, text } from "drizzle-orm/pg-core";
import { organization } from "./auth";

export const areas = pgTable(
  "areas",
  {
    id: text().primaryKey(),
    name: text().notNull(),
    org: text("organization_id")
      .notNull()
      .references(() => organization.id),
  },
  (table) => [index("org_area_index").on(table.org)],
);

export const basePacks = pgTable(
  "base_packs",
  {
    id: text().primaryKey(),
    name: text().notNull(),
    lcoPrice: integer().notNull(),
    customerPrice: integer().notNull(),
    org: text("organization_id")
      .notNull()
      .references(() => organization.id),
  },
  (table) => [index("org_base_pack_index").on(table.org)],
);

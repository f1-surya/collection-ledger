import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
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

export const connections = pgTable("connection", {
  id: text().primaryKey(),
  name: text().notNull(),
  boxNumber: text().notNull().unique(),
  phoneNumber: text(),
  area: text()
    .notNull()
    .references(() => areas.id),
  basePack: text()
    .notNull()
    .references(() => basePacks.id),
  org: text()
    .notNull()
    .references(() => organization.id),
  lastPayment: timestamp({ withTimezone: true }),
  createdAt: timestamp().defaultNow(),
  updateddAt: timestamp().defaultNow(),
});

export const connectionsRelations = relations(connections, ({ one }) => ({
  area: one(areas, {
    fields: [connections.area],
    references: [areas.id],
  }),
  basePack: one(basePacks, {
    fields: [connections.basePack],
    references: [basePacks.id],
  }),
}));

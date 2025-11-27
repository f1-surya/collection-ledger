import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
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

export const connections = pgTable(
  "connection",
  {
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
  },
  (table) => [
    index("connection_org_index").on(table.org),
    index("connection_id_index").on(table.id),
    index("connection_org_boxNumber_index").on(table.org, table.boxNumber),
    index("connection_org_name_index").on(table.org, table.name),
  ],
);

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

export const payments = pgTable(
  "payments",
  {
    id: text().primaryKey(),
    connection: text()
      .notNull()
      .references(() => connections.id),
    date: timestamp().notNull().defaultNow(),
    to: text().references(() => basePacks.id),
    currentPack: text()
      .notNull()
      .references(() => basePacks.id),
    isMigration: boolean().notNull().default(false),
    lcoPrice: integer().notNull(),
    customerPrice: integer().notNull(),
    items: jsonb()
      .notNull()
      .$type<
        [{ id: string; name: string; lcoPrice: number; customerPrice: number }]
      >(),
    org: text()
      .notNull()
      .references(() => organization.id),
  },
  (table) => [
    index("payments_org_date_index").on(table.org, table.date),
    index("payments_connection_index").on(table.connection),
    index("payments_org_index").on(table.org),
    index("payments_monthly_check_idx").on(
      table.connection,
      table.org,
      table.date,
    ),
  ],
);

export const paymentRelations = relations(payments, ({ one }) => ({
  connection: one(connections, {
    fields: [payments.connection],
    references: [connections.id],
  }),
  currentPack: one(basePacks, {
    fields: [payments.currentPack],
    references: [basePacks.id],
  }),
  to: one(basePacks, {
    fields: [payments.to],
    references: [basePacks.id],
  }),
}));

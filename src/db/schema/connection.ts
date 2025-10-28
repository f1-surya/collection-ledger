import { index, pgTable, text } from "drizzle-orm/pg-core";
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
  (table) => [index("org_index").on(table.org)],
);

import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";
import { DATABASE_URL } from "$env/static/private";

const DB_URL = DATABASE_URL;
if (!DB_URL) {
  throw new Error("DATABASE_URL not present in the environment");
}

export const db = drizzle(DB_URL, { schema });

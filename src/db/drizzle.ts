import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "@/db/schema";

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  throw new Error("DATABASE_URL not present in the environment");
}

export const db = drizzle(DB_URL, { schema });

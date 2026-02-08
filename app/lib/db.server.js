import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
}
const client = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(client);
export default db;

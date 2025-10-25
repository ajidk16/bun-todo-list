import { neon } from "@neondatabase/serverless";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { drizzle as postgresDrizzle } from "drizzle-orm/postgres-js";
import * as schema from "../schema";
import postgres from "postgres";

const neonClient = neon(process.env.DATABASE_URL!);

const postgresClient = postgres(process.env.DATABASE_URL!, {
  max: 10, // connection pool
  prepare: true,
});

const isProduction = process.env.NODE_ENV === "production";

export const db = isProduction
    ? neonDrizzle(neonClient, { schema })
    : postgresDrizzle(postgresClient, { schema });

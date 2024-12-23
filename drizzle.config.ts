/* eslint-disable @typescript-eslint/no-unsafe-call */
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!, //Must use process.env instead of the validated env from @/env for use with drizzle-kit, which won't run any of the JS needed to create that env
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});

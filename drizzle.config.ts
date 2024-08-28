import dotenv from "dotenv";
dotenv.config();

import { defineConfig } from "drizzle-kit";
if (!process.env.DB_URL) {
  throw new Error("Missing DB_URL environment variable");
}
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL,
  },
  verbose: true,
  strict: true,
});

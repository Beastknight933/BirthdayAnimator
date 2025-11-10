// Load dotenv only in local development (not in Replit)
if (typeof process.env.REPL_ID === 'undefined') {
  try {
    // Use require for drizzle-kit compatibility
    const dotenv = require("dotenv");
    dotenv.config();
  } catch (e) {
    // dotenv not available, that's okay
  }
}
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});

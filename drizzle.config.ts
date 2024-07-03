import { config } from "@/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./src/server/db/migrations",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: config.env.DB_URL,
    authToken: config.env.DB_AUTH_TOKEN,
  },
});

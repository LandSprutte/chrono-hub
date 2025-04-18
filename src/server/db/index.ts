import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { config } from "@/config";
import * as schema from "./schema";

console.log("[config.env.DB_URL]: ", config);

const client = createClient({
  url: config.env.DB_URL,
  authToken: config.env.DB_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

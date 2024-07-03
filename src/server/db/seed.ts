import * as schema from "@/server/db/schema";
import { createClient } from "@libsql/client";
import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/libsql";

const projectRoot = process.cwd();
loadEnvConfig(projectRoot);

const seedConnection = createClient({
  url: process.env.DB_URL!,
  authToken: process.env.DB_AUTH_TOKEN!,
});

export const db = drizzle(seedConnection, { schema });

(async function () {
  const org = await db
    .insert(schema.organizations)
    .values({
      name: "Ghost Organization",
    })
    .returning()
    .onConflictDoNothing()
    .execute();

  await db
    .insert(schema.invitations)
    .values({
      email: process.env.GHOST!,
      organizationId: org[0].id,
    })
    .execute();
})();

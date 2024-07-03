import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const env = createEnv({
  server: {
    DB_URL: z.string().min(1),
    DB_AUTH_TOKEN: z
      .string()
      .optional()
      .refine((s) => {
        // not needed for local only
        const type = process.env.DATABASE_CONNECTION_TYPE;
        return type === "remote" || type === "local-replica"
          ? s && s.length > 0
          : true;
      }),
    NODE_ENV: z.enum(["development", "production"]),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_USER_INFO_URL: z.string().min(1),
    HOST_URL: z.string().min(1),
    GHOST: z.string().min(1),
    EMAIL_API_KEY: z.string().min(1),
    SENDER_EMAIL: z.string().min(1),
    // TURSO_API_KEY: z.string().min(1),
    // TURSO_ORG_SLUG: z.string().min(1),
  },
  runtimeEnv: process.env,
});

export const config = {
  env,
};

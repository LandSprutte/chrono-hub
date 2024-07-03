// src/auth.ts
import { Lucia } from "lucia";

import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";

import { config } from "@/config";
import { Google } from "arctic";
import { cookies } from "next/headers";
import { db } from "../db";
import { sessions, users } from "../db/schema";

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

const envAliasMap = {
  production: "PROD",
  development: "DEV",
} as const;

const envAlias = envAliasMap[config.env.NODE_ENV];

export const getUserByEmail = (email: string) => {
  return db.query.users.findFirst({
    where: (t, { eq }) => eq(t.email, email),
  });
};

export const validateSession = async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value;

  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const { user, session } = await lucia.validateSession(sessionId);

  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(sessionId);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }

    if (!session) {
      const blank = lucia.createBlankSessionCookie();
      cookies().set(blank.name, blank.value, blank.attributes);
    }

    return {
      user,
      session,
    };
  } catch (error) {
    console.error(error);
  }
};

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (user) => {
    return {
      google_id: user.google_id,
      username: user.username,
      picture: user.picture,
      email: user.email,
    };
  },
});

const clientId = config.env.GOOGLE_CLIENT_ID;
const clientSecret = config.env.GOOGLE_CLIENT_SECRET;

export const google = new Google(
  clientId,
  clientSecret,
  `${config.env.HOST_URL}/login/google/callback`
);

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      google_id: number;
      username: string;
      picture: string;
      email: string;
    };
  }
}

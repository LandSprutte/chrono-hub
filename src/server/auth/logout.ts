"use server";

import { lucia, validateSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "../db";
import { sessions } from "../db/schema";
import { eq } from "drizzle-orm";

export const logout = async () => {
  const session = await validateSession();

  if (!session || !session.session) {
    return;
  }

  try {
    await lucia.invalidateSession(session.session.id);
    await db.delete(sessions).where(eq(sessions.id, session.session.id));

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error) {
    console.error(error);
  }
  redirect("/");
};

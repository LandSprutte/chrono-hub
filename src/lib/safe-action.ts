import { getUserByEmail, lucia } from "@/server/auth";
import { SelectUser } from "@/server/db/schema";
import { createSafeActionClient } from "next-safe-action";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import "server-only";

export const userRole = {
  orgAdmin: "org_admin" as const,
  user: "user" as const,
  ghost: "ghost" as const,
};

type Keys = keyof typeof userRole;
export type UserRoleValues = (typeof userRole)[Keys];

const userHasRoles = (user: SelectUser, roles: UserRoleValues[]) => {
  return roles.some((role) => user.role === role);
};

export const actionClient = createSafeActionClient({
  handleReturnedServerError(e) {
    return "Oh no, something went wrong!, " + e.message;
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value;

  if (!sessionId) {
    redirect("/");
  }

  const { user } = await lucia.validateSession(sessionId);

  if (!user) {
    redirect("/");
  }

  // Return the next middleware with `userId` value in the context
  return next({ ctx: { user } });
});

export const rolesActionClient = (roles: UserRoleValues[]) =>
  authActionClient.use(async ({ next, ctx }) => {
    if (!ctx.user) {
      throw new Error("Not allowed to access this resource");
    }

    const user = await getUserByEmail(ctx.user.email);

    if (!user) {
      throw new Error("Not allowed to access this resource");
    }

    if (!userHasRoles(user, roles)) {
      throw new Error("Not allowed to access this resource");
    }

    return next({ ctx: { user } });
  });

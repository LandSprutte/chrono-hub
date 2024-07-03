"use server";

import { authActionClient } from "@/lib/safe-action";
import { z } from "zod";
import { getAll } from "../repo/organisations-repo";
import { userIsGhost } from "../auth/user-is-ghost";
import { db } from "../db";
import { getUserByEmail } from "../auth";

const ghostClient = authActionClient.use(async ({ next, ctx }) => {
  const isGhost = userIsGhost(ctx.user);

  if (!isGhost) {
    throw new Error("You are not allowed to access this resource");
  }

  return next({ ctx: { user: ctx.user } });
});

export const getOrganisations = ghostClient
  .schema(z.void())
  .action(() => getAll());

export const getUserOrganisation = authActionClient.action(async ({ ctx }) => {
  const user = await getUserByEmail(ctx.user.email);

  if (!user) {
    throw new Error("Not allowed to access this resource");
  }

  if (user.organization_id === null) {
    throw new Error("Not allowed to access this resource");
  }

  const orgId = user.organization_id;

  return db.query.organizations.findFirst({
    where: (t, { eq }) => eq(t.id, orgId),
  });
});

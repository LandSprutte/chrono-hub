"use server";
import { rolesActionClient, userRole } from "@/lib/safe-action";
import { db } from "@/server/db";
import { z } from "zod";
import { validateUserIsPartOfOrg } from "./validation";

export const getOrgUsers = rolesActionClient([
  userRole.orgAdmin,
  userRole.ghost,
])
  .schema(
    z.object({
      orgId: z.number(),
    })
  )
  .action(async ({ parsedInput, ctx: { user } }) => {
    const orgId = validateUserIsPartOfOrg({ orgId: parsedInput.orgId }, user);

    const currentOrg = await db.query.organizations.findFirst({
      where: (t, { eq }) => eq(t.id, orgId),
      with: {
        users: true,
      },
    });

    const pendingOrgUsers = await db.query.invitations.findMany({
      where: (t, { eq, and, isNull }) =>
        and(eq(t.organizationId, orgId), isNull(t.acceptedAt)),
    });

    return { currentOrg, pendingOrgUsers };
  });

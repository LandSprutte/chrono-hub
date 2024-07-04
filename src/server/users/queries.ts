"use server";
import { rolesActionClient, userRole } from "@/lib/safe-action";
import { db } from "@/server/db";

export const getOrgUsers = rolesActionClient([
  userRole.orgAdmin,
  userRole.ghost,
]).action(async ({ ctx: { user } }) => {
  if (!user.organization_id) {
    throw new Error("Not allowed to access this resource");
  }

  if (user.organization_id === null) {
    throw new Error("Not allowed to access this resource");
  }

  const orgId = user.organization_id;

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

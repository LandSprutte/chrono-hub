import { userHasRoles, userRole } from "@/lib/safe-action";
import { SelectUser } from "../db/schema";

export const validateUserIsPartOfOrg = (
  input: { orgId: number },
  user: SelectUser
) => {
  if (userHasRoles([userRole.ghost], user)) {
    return input.orgId;
  }

  if (!user.organization_id) {
    throw new Error("Not allowed to access this resource");
  }

  if (user.organization_id === null) {
    throw new Error("Not allowed to access this resource");
  }

  if (user.organization_id !== input.orgId) {
    throw new Error("Not allowed to access this resource");
  }

  return user.organization_id;
};

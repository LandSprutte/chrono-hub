import { getOrgUsers } from "@/server/users/queries";
import { InviteToOrgForm } from "./invite-to-org-form";
import { OrgUsersTable } from "./org-users-table";

export default async function Component() {
  const usersForOrg = await getOrgUsers();

  if (!usersForOrg?.data) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <InviteToOrgForm />
      <OrgUsersTable
        orgUsers={usersForOrg.data.currentOrgUsers}
        pendingInvites={usersForOrg.data.pendingOrgUsers}
      />
    </div>
  );
}

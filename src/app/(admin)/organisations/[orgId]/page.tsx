import { getOrgUsers } from "@/server/users/queries";
import { InviteToOrgForm } from "./invite-to-org-form";
import { OrgUsersTable } from "./org-users-table";
import { validateUserIsPartOfOrg } from "@/server/organisations/actions";

export default async function OrgPage({
  params,
}: {
  params: {
    orgId: string;
  };
}) {
  await validateUserIsPartOfOrg({ orgId: params.orgId });
  const usersForOrg = await getOrgUsers(undefined);

  if (!usersForOrg?.data) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold mx-5">
        {usersForOrg.data.currentOrg?.name}
      </h2>
      <InviteToOrgForm />
      <OrgUsersTable
        orgUsers={usersForOrg.data.currentOrg?.users ?? []}
        pendingInvites={usersForOrg.data.pendingOrgUsers}
      />
    </div>
  );
}

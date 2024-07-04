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
  const user = await validateUserIsPartOfOrg({ orgId: params.orgId });
  const usersForOrg = await getOrgUsers({
    orgId: parseInt(params.orgId),
  });

  if (!usersForOrg?.data) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-2xl font-bold mx-5">
        {usersForOrg.data.currentOrg?.name}
      </h2>
      <InviteToOrgForm />
      <OrgUsersTable
        user={user?.data?.user}
        orgUsers={usersForOrg.data.currentOrg?.users ?? []}
        pendingInvites={usersForOrg.data.pendingOrgUsers}
      />
    </div>
  );
}

"use client";

import { RoleSelector } from "@/components/admin/role-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SelectInvitation, SelectUser } from "@/server/db/schema";
import { resendInvitationEmail } from "@/server/email/actions";
import { removeUserFromOrganisation } from "@/server/organisations/actions";
import { User } from "lucia";
import { SendIcon } from "lucide-react";
import { useState } from "react";

export const OrgUsersTable = ({
  orgUsers,
  pendingInvites,
  user: currentLoggedInUser,
}: {
  pendingInvites: SelectInvitation[];
  orgUsers: SelectUser[];
  user?: User;
}) => {
  const extractname = (user: SelectUser | SelectInvitation) => {
    if ("name" in user) {
      return user.name;
    }
    return user.email;
  };

  const isInvitation = (
    user: SelectUser | SelectInvitation
  ): user is SelectInvitation => "acceptedAt" in user;

  const [only, setOnly] = useState<"Users" | "PendingInvites" | null>(null);

  const users =
    only === "Users"
      ? orgUsers
      : only === "PendingInvites"
      ? pendingInvites
      : [...orgUsers, ...pendingInvites];

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      <div>
        <Toggle
          pressed={only === null}
          onPressedChange={() => {
            setOnly(null);
          }}
          className="rounded-l-md"
        >
          Both
        </Toggle>
        <Toggle
          pressed={only === null || only === "Users"}
          onPressedChange={() => {
            setOnly(only === "Users" ? null : "Users");
          }}
          className="rounded-none"
        >
          Users
        </Toggle>
        <Toggle
          pressed={only === null || only === "PendingInvites"}
          onPressedChange={() => {
            setOnly(only === "PendingInvites" ? null : "PendingInvites");
          }}
          className="rounded-r-md"
        >
          Pending Invites
        </Toggle>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{extractname(user)}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {isInvitation(user) ? null : (
                  <RoleSelector
                    role={user.role}
                    currentLoggedInUser={currentLoggedInUser}
                  />
                )}
              </TableCell>
              <TooltipProvider>
                <TableCell>
                  <div className="flex gap-2">
                    {"acceptedAt" in user && (
                      <Tooltip>
                        <TooltipTrigger
                          onClick={async () => {
                            await resendInvitationEmail({
                              invitationId: user.id,
                            });
                          }}
                        >
                          <div className="flex items-center gap-2 p-3 border rounded-md">
                            <SendIcon className="h-4 w-4" />
                            <span className="sr-only">Resend</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Resend invitation</TooltipContent>
                      </Tooltip>
                    )}
                    {"username" in user && (
                      <Tooltip>
                        <TooltipTrigger
                          onClick={async () => {
                            await removeUserFromOrganisation({
                              userId: user.id,
                              email: user.email,
                            });
                          }}
                        >
                          <div className="flex items-center gap-2 p-3 border rounded-md">
                            <TrashIcon className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Remove user from org</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
              </TooltipProvider>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
function FilePenIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

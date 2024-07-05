"use client";
import { updateUserRole } from "@/server/organisations/actions";
import { User } from "lucia";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SelectUser } from "@/server/db/schema";

export const RoleSelector = ({
  orgUser,
  currentLoggedInUser,
}: {
  orgUser: SelectUser;
  currentLoggedInUser?: User;
}) => {
  async function onSubmit(data: string) {
    console.log(data);
    const response = await updateUserRole({
      role: data,
      userId: orgUser.id,
    });
    if (response?.data) {
      toast("Role updated successfully");
    } else {
      toast("Failed to update role");
    }
  }
  return (
    <Select
      onValueChange={onSubmit}
      defaultValue={orgUser.role ?? "user"}
      disabled={!currentLoggedInUser?.isOrgAdmin}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={orgUser.role} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="org_admin">admin</SelectItem>
        <SelectItem value="user">user</SelectItem>
        <SelectItem value="ghost" className="hidden">
          ghost
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

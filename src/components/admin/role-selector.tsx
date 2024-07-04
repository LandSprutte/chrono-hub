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

export const RoleSelector = ({
  role,
  currentLoggedInUser,
}: {
  role: string | null;
  currentLoggedInUser?: User;
}) => {
  async function onSubmit(data: string) {
    const response = await updateUserRole({
      role: data,
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
      defaultValue={role ?? "user"}
      disabled={!currentLoggedInUser?.isOrgAdmin}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={role} />
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

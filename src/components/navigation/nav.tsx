"use client";
import { NavLinks } from "@/components/navigation/nav-link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { todayAsYYYYMMDD } from "@/lib/utils";
import { logout } from "@/server/auth/logout";
import { User } from "lucia";
import { ClockIcon } from "lucide-react";
import Link from "next/link";

export const Navigation = ({
  user,
  isAdmin,
}: {
  user: User;
  isAdmin: boolean;
}) => {
  return (
    <nav className="absolute top-2 right-2 flex items-center gap-3">
      <NavLinks href={`/timesheets/${todayAsYYYYMMDD}`}>
        <span className="flex items-center gap-2">New</span>
      </NavLinks>
      <NavLinks href="/timesheets/overview">
        <span className="flex items-center gap-2">
          Overview <ClockIcon className="h-4 w-4" />
        </span>
      </NavLinks>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="shadow-lg">
            <AvatarImage src={user?.picture ?? undefined} alt="profile-image" />
            <AvatarFallback>
              {/* {user?.username ?? user?.username.slice(0, 1) ?? ""} */}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/timesheets/overview">All timesheets</Link>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/organisations">Organisation</Link>
            </DropdownMenuItem>
          )}
          {/* <DropdownMenuItem>Admin</DropdownMenuItem> */}
          <DropdownMenuItem asChild>
            <form action={logout}>
              <button type="submit">Logout</button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

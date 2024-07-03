"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavLinks = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  return (
    <Link href={href}>
      <span
        className={cn(
          "flex items-center gap-2",
          pathname === href && "underline"
        )}
      >
        {children}
      </span>
    </Link>
  );
};

import { Navigation } from "@/components/navigation/nav";
import { Toaster } from "@/components/ui/sonner";
import { userHasRoles, userRole } from "@/lib/safe-action";
import { getUserByEmail } from "@/server/auth";
import { getAuthedUser } from "@/server/auth/validate-session";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAuthedUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await getUserByEmail(user.email);

  const isAdmin = userHasRoles([userRole.orgAdmin, userRole.ghost], dbUser);

  return (
    <main className="pt-14">
      <Navigation user={user} isAdmin={isAdmin} />
      {children}
      <Toaster />
    </main>
  );
}

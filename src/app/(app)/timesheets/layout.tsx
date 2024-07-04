import { Navigation } from "@/components/navigation/nav";
import { userHasRoles, userRole } from "@/lib/safe-action";
import { getUserByEmail } from "@/server/auth";
import { getAuthedUser } from "@/server/auth/validate-session";
import { User } from "lucia";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user: User | undefined = await getAuthedUser();

  if (!user) {
    redirect("/");
  }

  const dbUser = await getUserByEmail(user.email);

  if (user.isOrgAdmin) {
    dbUser?.role !== "ghost" &&
      redirect("/organisations/" + dbUser?.organization_id);
  }

  const isAdmin = userHasRoles([userRole.orgAdmin, userRole.ghost], dbUser);

  return (
    <main className="flex flex-col space-y-4 bg-slate-50">
      <Navigation user={user} isAdmin={isAdmin} />
      {children}
    </main>
  );
}

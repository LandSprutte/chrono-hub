import { Navigation } from "@/components/navigation/nav";
import { Toaster } from "@/components/ui/sonner";
import { userRole } from "@/lib/safe-action";
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

  if (user.isOrgAdmin) {
    const dbUser = await getUserByEmail(user.email);

    dbUser?.role !== userRole.ghost &&
      redirect("/organisations/" + dbUser?.organization_id);
  }

  return (
    <main className="pt-14">
      <Navigation {...user} />
      {children}
      <Toaster />
    </main>
  );
}

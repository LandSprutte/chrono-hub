import { Navigation } from "@/components/navigation/nav";
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

  return (
    <main className="flex flex-col space-y-4 bg-slate-50">
      <Navigation {...user} />
      {children}
    </main>
  );
}

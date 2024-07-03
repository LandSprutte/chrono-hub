import { Toaster } from "@/components/ui/sonner";
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

  return (
    <main>
      {children}
      <Toaster />
    </main>
  );
}

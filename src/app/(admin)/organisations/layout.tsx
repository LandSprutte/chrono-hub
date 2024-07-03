import { Toaster } from "@/components/ui/sonner";
import { getAuthedUser } from "@/server/auth/validate-session";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await getAuthedUser();

  return (
    <main>
      {children}
      <Toaster />
    </main>
  );
}

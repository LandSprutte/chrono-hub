export default async function OverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col  items-center pt-28 h-screen">{children}</div>
  );
}

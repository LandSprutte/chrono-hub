export default function OrgIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full">
      <div className="w-56">
        <h2>OrgId</h2>
      </div>
      <div className="flex w-full">{children}</div>
    </div>
  );
}

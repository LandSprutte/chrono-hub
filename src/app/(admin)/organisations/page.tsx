import { getOrganisations } from "@/server/organisations/queries";
import Link from "next/link";

export default async function Page() {
  const resp = await getOrganisations();

  if (!resp?.data) {
    return null;
  }

  const organisations = resp.data;

  return (
    <div>
      {organisations.map((org) => (
        <Link key={org.id} href={`/organisations/${org.name}`}>
          {org.name}
        </Link>
      ))}
    </div>
  );
}

import { DataTable } from "@/components/ui/data-table";
import { getMyTimesheets } from "@/server/timesheet/queries";
import { columns } from "./columns";

export const OverviewTable = async () => {
  const resp = await getMyTimesheets();

  if (!resp?.data) {
    return null;
  }

  return (
    <div className="md:w-2/3 w-full p-2">
      <DataTable columns={columns} data={resp?.data} />
    </div>
  );
};

import { DataTable } from "@/components/ui/data-table";
import { getMyTimesheets } from "@/server/timesheet/queries";
import { columns } from "./columns";

export const OverviewTable = async () => {
  const resp = await getMyTimesheets(undefined);

  if (!resp?.data) {
    return null;
  }
  return (
    <div className="w-full p-10">
      <DataTable columns={columns} data={resp?.data} />
    </div>
  );
};

import { getLatestUniqueTimesheets } from "@/server/timesheet/queries";
import { LatestRegistrationItem } from "./latest-registration-item";

export const LatestUniqueTimesheets = async ({
  uniquesCount = 1,
}: {
  uniquesCount?: number;
}) => {
  const resp = await getLatestUniqueTimesheets({ count: uniquesCount });

  if (!resp?.data) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 w-full justify-center items-center">
      <h3 className="font-semibold">Latest entry</h3>
      {resp.data.map((timesheet) => (
        <LatestRegistrationItem key={timesheet.id} {...timesheet} />
      ))}
    </div>
  );
};

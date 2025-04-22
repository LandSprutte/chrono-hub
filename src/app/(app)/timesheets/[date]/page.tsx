export const dynamic = "force-dynamic";
import { TimesheetWeekOverviewDayLoading } from "@/components/time-reg/timesheet-overview-day";

import { LatestUniqueTimesheets } from "@/components/time-reg/latest-unique-timesheets";
import { TimesheetFormDialog } from "@/components/time-reg/timesheet-form-dialog";
import { TimesheetWeekOverviewDay } from "@/components/time-reg/timesheet-overview-day";
import { Suspense } from "react";

export default async function Page({ params }: { params: { date: string } }) {
  // Validate the date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(params.date)) {
    throw new Error(
      `Invalid date format. Expected YYYY-MM-DD, got ${params.date}`
    );
  }

  const date = new Date(params.date);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date value: ${params.date}`);
  }

  return (
    <div className="flex flex-col items-center gap-3 min-h-screen pb-10 w-full bg-white">
      <Suspense
        key={params.date}
        fallback={<TimesheetWeekOverviewDayLoading defaultDate={params.date} />}
      >
        <TimesheetWeekOverviewDay date={date} />
      </Suspense>
      <LatestUniqueTimesheets />
      <TimesheetFormDialog
        triggerText="New timesheet"
        customizeBtn={{
          className: "w-full",
        }}
      />
    </div>
  );
}

import { LatestUniqueTimesheets } from "@/components/time-reg/latest-unique-timesheets";
import {
  TimesheetWeekOverviewDay,
  TimesheetWeekOverviewDayLoading,
} from "@/components/time-reg/timesheet-overview-day";
import { TimesheetFormDialog } from "@/components/time-reg/timesheet-form-dialog";
import { Suspense } from "react";
export default async function Page({ params }: { params: { date: string } }) {
  return (
    <div className="flex flex-col items-center gap-3 min-h-screen pb-10 w-full bg-white">
      <Suspense
        key={params.date}
        fallback={<TimesheetWeekOverviewDayLoading defaultDate={params.date} />}
      >
        <TimesheetWeekOverviewDay date={new Date(params.date)} />
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

import { cn, minutesToHours } from "@/lib/utils";
import { GetMyTimesheetsByWeek } from "@/server/timesheet/queries";
import { format, isSameDay } from "date-fns";

export const Timesheet = (props: {
  timesheets: GetMyTimesheetsByWeek[];
  default: string;
}) => {
  const loggedOnDay =
    props.timesheets &&
    Boolean(
      props.timesheets.find((ts) => isSameDay(ts.createdAt, ts.loggedAt))
    );

  const accumulatedHoursAndMinutes = props.timesheets.reduce(
    (acc, ts) => {
      const h = ts.hours ?? 0;
      return {
        hours: h + acc.hours,
        minutes: acc.minutes + ts.minutes ?? 0,
      };
    },
    {
      hours: 0,
      minutes: 0,
    }
  );

  const { hours, minutes } = minutesToHours(accumulatedHoursAndMinutes.minutes);

  return (
    <div
      className={cn(
        "flex flex-col w-full p-1 rounded-md",
        props.timesheets.length > 0 ? "bg-slate-200" : "bg-slate-100",
        loggedOnDay && "bg-lime-100 text-lime-900"
      )}
    >
      {props.timesheets.length > 0 ? (
        <div className="flex flex-col items-center justify-center">
          <div className="font-semibold">
            {format(props.timesheets[0].createdAt, "EEE")}
          </div>
          <div className="text-sm">
            {accumulatedHoursAndMinutes.hours + hours} h
          </div>
          <div className="text-sm">{minutes} m</div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {format(props.default, "EEE")}
        </div>
      )}
    </div>
  );
};

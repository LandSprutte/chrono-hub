import { Skeleton } from "@/components/ui/skeleton";
import {
  GetMyTimesheetsByWeek,
  getMyTimesheetsForTheWeekByDate,
} from "@/server/timesheet/queries";
import { addWeeks, format, subWeeks } from "date-fns";
import { unstable_noStore } from "next/cache";
import Link from "next/link";
import { Timesheet } from "./timesheet";
import { Badge, SkeletonBadge } from "../ui/badge";
import { cn } from "@/lib/utils";

export const TimesheetWeekOverviewDayLayout = ({
  date,
  data,
  demo = false,
}: {
  date: Date;
  data: Record<string, GetMyTimesheetsByWeek[]>;
  demo?: boolean;
}) => {
  const daysInWeek = Object.keys(data);
  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full justify-between mt-6">
        <div className="flex flex-col w-full justify-center items-center">
          <h2 className="text-2xl font-bold capitalize">my Timesheets</h2>
          <div className="flex flex-col rounded-full h-10 shadow-2xl min-w-72 justify-center overflow-hidden my-4 bg-white">
            <div className=" flex items-center justify-between">
              <Link
                aria-disabled={demo}
                className={cn("px-2", demo && "pointer-events-none")}
                href={`/timesheets/${format(subWeeks(date, 1), "yyyy-MM-dd")}`}
              >{`<`}</Link>
              <h3 className="text-xl">
                Week {format(date, "I")} of {format(date, "yyyy")}
              </h3>
              <Link
                aria-disabled={demo}
                className={cn("px-2", demo && "pointer-events-none")}
                href={`/timesheets/${format(addWeeks(date, 1), "yyyy-MM-dd")}`}
              >{`>`}</Link>
            </div>
          </div>
          <div>
            <Link
              className={cn(demo && "hidden")}
              href={`/timesheets/${format(new Date(), "yyyy-MM-dd")}`}
            >
              <Badge className="px-2 mx-2">i dag</Badge>
            </Link>
          </div>
          <div className="flex w-full min-h-24 my-4 gap-2">
            {daysInWeek.map((day) => (
              <Timesheet key={day} default={day} timesheets={data[day]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TimesheetWeekOverviewDay = async (props: { date: Date }) => {
  unstable_noStore();
  const { date } = props;
  const resp = await getMyTimesheetsForTheWeekByDate({
    date,
  });

  if (!resp?.data) {
    return null;
  }

  const data = resp?.data;

  return <TimesheetWeekOverviewDayLayout date={date} data={data} />;
};

const Loader = () => {
  return (
    <div className="w-full">
      <div className="h-1.5 w-full bg-blue-100 overflow-hidden">
        <div className="animate-progress w-full h-full bg-blue-500 origin-left-right"></div>
      </div>
    </div>
  );
};

export const TimesheetWeekOverviewDayLoading = ({
  defaultDate,
}: {
  defaultDate: string;
}) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full justify-between mt-6">
        <div className="flex flex-col w-full justify-center items-center">
          <h2 className="text-2xl font-bold capitalize">my Timesheets</h2>
          <div className="flex flex-col rounded-full h-10 shadow min-w-72 justify-end overflow-hidden my-4">
            <div className=" flex items-center justify-between align-bottom">
              <Link
                className="px-2"
                href={`/timesheets/${format(
                  subWeeks(defaultDate, 1),
                  "yyyy-MM-dd"
                )}`}
              >{`<`}</Link>
              <h3 className="text-xl">
                Week {format(defaultDate, "I")} of {format(defaultDate, "yyyy")}
              </h3>
              <Link
                className="px-2"
                href={`/timesheets/${format(
                  addWeeks(defaultDate, 1),
                  "yyyy-MM-dd"
                )}`}
              >{`>`}</Link>
            </div>
            <Loader />
          </div>
          <SkeletonBadge />
        </div>
      </div>

      <div className="flex w-full min-h-24 my-4 gap-2">
        <Skeleton className="flex flex-col items-center w-full bg-slate-200" />
        <Skeleton className="flex flex-col items-center w-full bg-slate-200" />
        <Skeleton className="flex flex-col items-center w-full bg-slate-200" />
        <Skeleton className="flex flex-col items-center w-full bg-slate-200" />
        <Skeleton className="flex flex-col items-center w-full bg-slate-200" />
        <Skeleton className="flex flex-col items-center w-full bg-slate-200" />
        <Skeleton className="flex flex-col items-center w-full bg-slate-200" />
      </div>
    </div>
  );
};

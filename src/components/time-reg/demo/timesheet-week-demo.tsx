"use client";
import { ConfettiButton } from "@/components/magicui/confetti";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { todayAsYYYYMMDD } from "@/lib/utils";
import { wait } from "@/lib/wait";
import { GetMyTimesheetsByWeek } from "@/server/timesheet/queries";
import { eachDayOfInterval, endOfWeek, interval, startOfWeek } from "date-fns";
import { useState } from "react";
import { TimesheetForm } from "../form";
import { TimesheetWeekOverviewDayLayout } from "../timesheet-overview-day";

export const TimesheetWeekDemo = () => {
  const date = todayAsYYYYMMDD;

  const start = startOfWeek(date, {
    weekStartsOn: 1,
  });
  const end = endOfWeek(date, {
    weekStartsOn: 1,
  });
  const week = interval(start, end);

  const daysOfWeek = eachDayOfInterval(week).reduce(
    (prev: { [key: string]: GetMyTimesheetsByWeek[] }, current) => {
      return {
        ...prev,
        [current.toDateString()]: [],
      };
    },
    {}
  );

  const [state, setState] = useState<Record<string, GetMyTimesheetsByWeek[]>>({
    ...daysOfWeek,
  });

  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center gap-3  w-full p-7 rounded-xl shadow-2xl ">
      <TimesheetWeekOverviewDayLayout date={new Date(date)} data={state} demo />
      {/* <LatestUniqueTimesheets /> */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Button asChild variant={"default"} className={"max-w-96"}>
          <DialogTrigger>New timesheet</DialogTrigger>
        </Button>

        <DialogContent>
          <TimesheetForm
            onSubmit={(values) => {
              const newDate = new Date(values.date);
              const newDateString = newDate.toDateString();
              const newTimesheet = {
                ...values,
                createdAt: newDateString,
                loggedAt: newDateString,
              };

              setState(
                (prev) =>
                  ({
                    ...prev,
                    [newDateString]: [...prev[newDateString], newTimesheet],
                  } as Record<string, GetMyTimesheetsByWeek[]>)
              );
              wait(200).then(() => {
                setIsOpen(false);
              });
            }}
          >
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Cancel
            </Button>
            {/* <ConfettiFireworks type="submit" className="ml-auto min-w-28">
            Save
          </ConfettiFireworks> */}
            <ConfettiButton type="submit" className="ml-auto min-w-28">
              Save
            </ConfettiButton>
          </TimesheetForm>
        </DialogContent>
      </Dialog>
    </div>
  );
};

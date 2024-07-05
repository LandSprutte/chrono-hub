"use client";
import { ConfettiButton } from "@/components/magicui/confetti";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { todayAsYYYYMMDD } from "@/lib/utils";
import { wait } from "@/lib/wait";
import { GetMyTimesheetsByWeek } from "@/server/timesheet/queries";
import { eachDayOfInterval, endOfWeek, interval, startOfWeek } from "date-fns";
import { useRef, useState } from "react";
import { TimesheetForm } from "../form";
import { TimesheetWeekOverviewDayLayout } from "../timesheet-overview-day";
import confetti from "canvas-confetti";

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

  const ref = useRef<HTMLButtonElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center gap-3  w-full p-4 md:p-7 rounded-xl shadow-2xl ">
      <TimesheetWeekOverviewDayLayout date={new Date(date)} data={state} demo />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Button asChild variant={"default"} className={"max-w-96"}>
          <DialogTrigger>New timesheet</DialogTrigger>
        </Button>

        <DialogContent>
          <TimesheetForm
            onSubmit={(values) => {
              if (values.hours === 0 && values.minutes === 0) {
                return;
              }
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
              if (!ref.current) {
                setIsOpen(false);
                return;
              }
              const rect = ref?.current.getBoundingClientRect();
              const x = rect.left + rect.width / 2;
              const y = rect.top + rect.height / 2;
              confetti({
                origin: {
                  x: x / window.innerWidth,
                  y: y / window.innerHeight,
                },
              });
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
            <ConfettiButton
              type="submit"
              className="ml-auto min-w-28"
              ref={ref}
            >
              Save
            </ConfettiButton>
          </TimesheetForm>
        </DialogContent>
      </Dialog>
    </div>
  );
};

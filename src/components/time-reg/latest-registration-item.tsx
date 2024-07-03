import { GetMyTimesheetsByWeek } from "@/server/timesheet/queries";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CopyIcon, PenIcon } from "lucide-react";
import { TimesheetFormDialog } from "./timesheet-form-dialog";

export const LatestRegistrationItem = (timesheet: GetMyTimesheetsByWeek) => {
  return (
    <Card className="min-w-[320px] max-w-[480px]">
      <CardHeader>
        <CardTitle>{format(timesheet.createdAt, "yyyy-MM-dd")}</CardTitle>
        <CardDescription>
          {timesheet.hours} h {timesheet.minutes} m
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{timesheet.content}</p>
      </CardContent>
      <CardFooter className="flex w-full justify-end">
        <TimesheetFormDialog
          icon={<PenIcon className="h-4 w-4 ml-2" />}
          triggerText="Edit"
          customizeBtn={{
            variant: "ghost",
            className: "space-x-2",
          }}
          timesheet={timesheet}
        />
        <TimesheetFormDialog
          icon={<CopyIcon className="h-4 w-4 ml-2" />}
          triggerText="Copy"
          copy
          customizeBtn={{
            variant: "ghost",
            className: "space-x-2",
          }}
          timesheet={timesheet}
        />
      </CardFooter>
    </Card>
  );
};

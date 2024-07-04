import { TimesheetFormDialog } from "@/components/time-reg/timesheet-form-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteTimesheet } from "@/server/timesheet/actions";
import { MoreHorizontal } from "lucide-react";

export const ColumnActions = ({
  timesheet,
}: {
  timesheet: {
    title: string | null;
    id: number;
    content: string;
    createdAt: Date;
    updateAt: Date | null;
    hours: number | null;
    minutes: number;
    userId: string;
    loggedAt: Date;
  };
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(timesheet.id.toString())}
        >
          Copy timesheet ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <TimesheetFormDialog
          triggerText="Edit"
          customizeBtn={{
            variant: "ghost",
            className:
              "w-full h-8 text-start font-normal relative flex cursor-default items-start justify-start select-none rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          }}
          timesheet={timesheet}
        />
        <DropdownMenuItem
          onClick={async () => {
            await deleteTimesheet(timesheet.id);
          }}
          className="text-red-500 focus:bg-red-100 focus:text-red-500 focus:font-semibold"
        >
          delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

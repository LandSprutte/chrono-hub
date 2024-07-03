"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GetMyTimesheets } from "@/server/timesheet/queries";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { ColumnActions } from "./column-actions";

export const columns: ColumnDef<GetMyTimesheets>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      return (
        <div>
          {format(
            new Date(row.getValue("createdAt")).toDateString(),
            "yyyy-MM-dd"
          )}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => {
      const hours = row.hours;
      const minutes = row.minutes;

      return `${hours} hours ${minutes} minutes`;
    },
    header: "Time",
  },
  {
    header: "Description",
    accessorKey: "content",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const timesheet = row.original;

      return <ColumnActions timesheet={timesheet} />;
    },
  },
];

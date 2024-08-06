"use client";
import { GetMyTimesheets } from "@/server/timesheet/queries";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
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
    header: "Created By",
    accessorKey: "user.name",
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

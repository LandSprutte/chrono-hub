"use client";
import { GetMyTimesheets } from "@/server/timesheet/queries";
import { ColumnDef, RowData } from "@tanstack/react-table";
import { format, interval, isWithinInterval } from "date-fns";
import { ColumnActions } from "./column-actions";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

declare module "@tanstack/react-table" {
  //allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range"; // | 'select'
  }
}

export const columns: ColumnDef<GetMyTimesheets>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    meta: {
      filterVariant: "range",
    },
    filterFn: (rows, id, value) => {
      const intva = interval(value.from, value.to);
      return isWithinInterval(rows.getValue("createdAt"), intva);
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
    id: "username",
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

"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Input } from "./input";
import { DatePickerWithRange } from "./date-range";
import { GetMyTimesheets } from "@/server/timesheet/queries";
import { group } from "console";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div className="flex gap-5">
      <div className="w-full">
        <div className="flex gap-3">
          <div className="flex items-center py-4">
            <Input
              placeholder="Søg medarbejder..."
              value={
                (table.getColumn("username")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("username")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
          <div className="flex items-center py-4">
            <DatePickerWithRange
              onSelect={(date) => {
                table.getColumn("createdAt")?.setFilterValue(date);
              }}
            />
          </div>
        </div>
        <div className="rounded-md border bg-white shadow">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <TableSummary data={table.getRowModel().rows} />
    </div>
  );
}

function TableSummary(props: { data: any[] }) {
  const asarr = props.data.map((item) => item);

  const grouped: any[] = asarr.reduce((acc: Record<string, any[]>, curr) => {
    return {
      ...acc,
      [curr.original.userId]: acc[curr.original.userId]
        ? [...acc[curr.original.userId], curr]
        : [curr],
    };
  }, {} as Record<string, { original: GetMyTimesheets[] }>);

  const calculateTotal = (value: { original: GetMyTimesheets }[]) => {
    const hours = value.reduce(
      (acc, curr) => acc + (curr.original.hours ?? 0),
      0
    );
    const minutes = value.reduce(
      (acc, curr) => acc + (curr.original.minutes ?? 0),
      0
    );

    const totalHours = hours + Math.floor(minutes / 60);
    const totalMinutes = minutes % 60;
    return `${totalHours} timer og ${totalMinutes} minutter`;
  };

  const groupedTotal = Object.values(grouped).flat();

  return (
    <div className="w-full pt-[72px]">
      <Table className="bg-white rounded-xl">
        <TableCaption>A summary of timesheets.</TableCaption>
        <TableHeader className="rounded-xl border">
          <TableRow>
            <TableHead>Medarbejder</TableHead>
            <TableHead className="w-[100px]">registrerings antal</TableHead>
            <TableHead></TableHead>
            <TableHead className="text-right">Akkumuleret</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(grouped).map(([key, value]) => (
            <TableRow key={key} className="hover:">
              <TableCell className="font-medium">
                {value[0].original.user.name}
              </TableCell>
              <TableCell>{value.length}</TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right">
                {calculateTotal(value)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow key={"total"} className="bg-slate-200 font-bold">
            <TableCell className="font-medium">Total</TableCell>
            <TableCell>{groupedTotal.length}</TableCell>
            <TableCell></TableCell>
            <TableCell className="text-right">
              {calculateTotal(groupedTotal)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

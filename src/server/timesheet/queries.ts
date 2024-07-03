"use server";
import { authActionClient } from "@/lib/safe-action";
import { AwaitedReturnType, UnwrapArray } from "@/lib/type-helpers";
import { eachDayOfInterval, endOfWeek, interval, startOfWeek } from "date-fns";
import { z } from "zod";
import {
  getMyTimesheetsByWeek,
  getTimesheetsByUser,
  getUniqueTimesheets,
} from "../repo/timesheet-repo";

export const getMyTimesheets = authActionClient
  .schema(z.void())
  .action(async ({ ctx: { user } }) => {
    const timesheets = await getTimesheetsByUser(user.id);

    return timesheets;
  });

export const getMyTimesheetsForTheWeekByDate = authActionClient
  .schema(
    z.object({
      date: z.coerce.date(),
    })
  )
  .action(async ({ parsedInput: { date }, ctx: { user } }) => {
    const start = startOfWeek(date, {
      weekStartsOn: 1,
    });
    const end = endOfWeek(date, {
      weekStartsOn: 1,
    });
    const week = interval(start, end);

    const timesheets = await getMyTimesheetsByWeek(user.id, week);

    const mapped: Record<string, GetMyTimesheetsByWeek[]> = eachDayOfInterval(
      week
    ).reduce((prev: { [key: string]: GetMyTimesheetsByWeek[] }, current) => {
      const ts = timesheets.filter(
        (t) => new Date(t.createdAt).toDateString() === current.toDateString()
      );
      if (!ts) {
        return {
          ...prev,
          [current.toDateString()]: [],
        };
      }

      return {
        ...prev,
        [current.toDateString()]: ts,
      };
    }, {});

    return mapped;
  });

export const getLatestUniqueTimesheets = authActionClient
  .schema(
    z.object({
      count: z.number().optional().default(3),
    })
  )
  .action(async ({ parsedInput, ctx: { user } }) => {
    const timesheets = await getUniqueTimesheets(user.id, parsedInput.count);

    return timesheets;
  });

export type GetMyTimesheetsByWeek = UnwrapArray<
  AwaitedReturnType<typeof getMyTimesheetsByWeek>
>;
export type GetMyTimesheets = UnwrapArray<
  AwaitedReturnType<typeof getTimesheetsByUser>
>;

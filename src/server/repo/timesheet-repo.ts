import "server-only";

import { db } from "@/server/db";
import { NormalizedInterval } from "date-fns";
import { InsertTimesheet, timesheets } from "../db/schema";
import { eq } from "drizzle-orm";

export const createTimesheet = (timesheet: InsertTimesheet) => {
  return db.insert(timesheets).values(timesheet).returning().execute();
};

export const updateTimesheet = (timesheet: InsertTimesheet, id: number) => {
  return db
    .update(timesheets)
    .set(timesheet)
    .where(eq(timesheets.id, id))
    .returning()
    .execute();
};

export const getTimesheetsByUser = async (userId: string) => {
  return db.query.timesheets
    .findMany({
      where: (t, { eq }) => eq(t.userId, userId),
    })
    .execute();
};

export const getMyTimesheetsByWeek = async (
  userId: string,
  interval: NormalizedInterval<Date>
) => {
  return db.query.timesheets
    .findMany({
      where: (t, { eq, and, between }) =>
        and(
          eq(t.userId, userId),
          between(t.createdAt, interval.start, interval.end)
        ),
    })
    .execute();
};

export const getUniqueTimesheets = (userId: string, count: number) => {
  return db.query.timesheets
    .findMany({
      where: (t, { eq }) => eq(t.userId, userId),
      orderBy: (t, { desc }) => desc(t.loggedAt),
      limit: count,
    })
    .execute();
};

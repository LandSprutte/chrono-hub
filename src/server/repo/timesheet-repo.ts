import "server-only";

import { db } from "@/server/db";
import { NormalizedInterval } from "date-fns";
import { eq } from "drizzle-orm";
import { InsertTimesheet, timesheets } from "../db/schema";
import { getOrgUsers } from "../users/queries";

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

export const deleteTimesheetBydId = (id: number) => {
  return db
    .delete(timesheets)
    .where(eq(timesheets.id, id))
    .returning()
    .execute();
};

export const getTimesheetsByUser = async (userId: string) => {
  return db.query.timesheets
    .findMany({
      where: (t, { eq }) => eq(t.userId, userId),
      with: {
        user: true,
      },
    })
    .execute();
};

export const getTimesheetsForOrg = async (userId: string) => {
  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
    with: {
      organization: true,
    },
  });

  if (!user) {
    return [];
  }

  const orgUsers = await getOrgUsers({ orgId: user.organization_id! });
  const userIds = orgUsers?.data?.currentOrg?.users?.map((u) => u.id) ?? [];

  return await db.query.timesheets.findMany({
    where: (t, { inArray }) => inArray(t.userId, userIds),
    with: {
      user: true,
    },
  });
};

export const getTimesheetById = async (id: number) => {
  return db.query.timesheets.findFirst({ where: (t, { eq }) => eq(t.id, id) });
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
export const getTimesheetsByWeek = async (
  interval: NormalizedInterval<Date>,
  orgId: number
) => {
  const usersInOrg = await getOrgUsers({ orgId });

  const userIds = usersInOrg?.data?.currentOrg?.users?.map((u) => u.id) ?? [];
  return db.query.timesheets
    .findMany({
      where: (t, { and, between, inArray }) =>
        and(
          inArray(t.userId, userIds),
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

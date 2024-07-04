"use server";
// Server Actions / Functions
import {
  authActionClient,
  rolesActionClient,
  userHasRoles,
  userRole,
} from "@/lib/safe-action";
import { minutesToHours } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { SelectUser } from "../db/schema";
import {
  createTimesheet,
  deleteTimesheetBydId,
  getTimesheetById,
  updateTimesheet,
} from "../repo/timesheet-repo";
import { timesheetSchema } from "./validation";

const userCanDeleteTimesheet = async (
  user: SelectUser,
  timesheetUserId: number
) => {
  if (userHasRoles([userRole.ghost, userRole.orgAdmin], user)) {
    return true;
  }
  const ts = await getTimesheetById(timesheetUserId);

  return ts?.userId === user.id;
};

export const createNewTimesheet = authActionClient
  .schema(timesheetSchema)
  .action(async ({ parsedInput: input, ctx: { user } }) => {
    const { hours, minutes } = minutesToHours(input.minutes);

    const timesheet = {
      content: input.description,
      userId: user.id,
      hours: input.hours + (hours ?? 0),
      minutes: minutes ?? input.minutes, //TODO this is wrong, you want to add th rest??? myabe not
      createdAt: new Date(input.date),
    };

    const a = input.id
      ? await updateTimesheet(timesheet, input.id)
      : await createTimesheet(timesheet);

    revalidatePath("/"); // TODO
    return a;
  });

export const deleteTimesheet = rolesActionClient([
  userRole.ghost,
  userRole.user,
  userRole.orgAdmin,
])
  .schema(z.number())
  .action(async ({ parsedInput: id, ctx: { user } }) => {
    if (!(await userCanDeleteTimesheet(user, id))) {
      throw new Error("You are not allowed to delete this timesheet");
    }
    const deletedTimesheet = await deleteTimesheetBydId(id);

    revalidatePath("/"); // TODO

    return deletedTimesheet;
  });

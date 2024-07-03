"use server";
// Server Actions / Functions
import { authActionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { createTimesheet, updateTimesheet } from "../repo/timesheet-repo";
import { timesheetSchema } from "./validation";
import { minutesToHours } from "@/lib/utils";

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

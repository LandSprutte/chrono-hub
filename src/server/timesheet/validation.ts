import { z } from "zod";

export const timesheetSchema = z.object({
  date: z.string(),
  hours: z.coerce.number(),
  minutes: z.coerce.number(),
  description: z?.string().max(548),
  id: z.number().optional(),
});

export type Timesheet = z.infer<typeof timesheetSchema>;

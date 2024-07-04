import { z } from "zod";

export const timesheetSchema = z.object({
  date: z.string(),
  hours: z.coerce.number().int().min(0).max(24),
  minutes: z.coerce.number().int().min(0).max(60),
  description: z?.string().max(548),
  id: z.number().optional(),
});

export type Timesheet = z.infer<typeof timesheetSchema>;

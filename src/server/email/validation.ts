import { z } from "zod";

export const invitationSchema = z.object({
  to: z.string(),
  orgId: z.number().optional(),
});

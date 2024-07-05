import { z } from "zod";

export const orgSchema = z.object({
  name: z.string().min(3).max(255),
});

export const roleSchema = z.object({
  role: z.enum(["org_admin", "user"]),
  userId: z.string(),
});

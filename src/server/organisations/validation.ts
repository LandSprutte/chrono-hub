import { z } from "zod";

export const orgSchema = z.object({
  name: z.string().min(3).max(255),
});
import "server-only";

import { db } from "@/server/db";
import { NormalizedInterval } from "date-fns";
import { InsertTimesheet, timesheets } from "../db/schema";
import { eq } from "drizzle-orm";

export const getAll = async () => {
  return db.query.organizations.findMany();
};

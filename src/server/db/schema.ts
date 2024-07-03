import { addDays } from "date-fns";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const organizations = sqliteTable("organizations", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
}));

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  google_id: text("google_id").unique(),
  username: text("username"),
  picture: text("picture"),
  role: text("role", { enum: ["org_admin", "user", "ghost"] }),
  organization_id: integer("organization_id"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updateAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

export const userRelations = relations(users, ({ one }) => ({
  organization: one(organizations, {
    fields: [users.organization_id],
    references: [organizations.id],
  }),
  invitation: one(invitations, {
    fields: [users.email],
    references: [invitations.email],
  }),
}));

export const invitations = sqliteTable("invitations", {
  id: integer("id").primaryKey(),
  email: text("email").unique().notNull(),
  organizationId: integer("organization_id").notNull(),
  role: text("role", { enum: ["org_admin", "user", "ghost"] })
    .$default(() => "user")
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  /**
   * The time the invitation expires
   * after this time the invitation is no longer valid
   * and the user can no longer accept the invitation
   * the user must request a new invitation
   * the default is 14 days from the time the invitation was created
   **/
  expiresAt: integer("expires_at", { mode: "timestamp" })
    .$defaultFn(() => addDays(new Date(), 14))
    .notNull(),
  acceptedAt: integer("accepted_at", { mode: "timestamp" }),
});

export const timesheets = sqliteTable("timesheets", {
  id: integer("id").primaryKey(),
  title: text("title"),
  content: text("content").notNull(),
  hours: integer("hours"),
  minutes: integer("minutes").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updateAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
  /**
   * The time the user logged the timesheet
   * not to be confused with the time the timesheet was created
   * one can logged a timesheet today but created it yesterday
   */
  loggedAt: integer("logged_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const sessions = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull(),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export type InsertInvitation = typeof invitations.$inferInsert;
export type SelectInvitation = typeof invitations.$inferSelect;

export type InsertTimesheet = typeof timesheets.$inferInsert;
export type SelectTimesheet = typeof timesheets.$inferSelect;

export type InsertOrganization = typeof organizations.$inferInsert;
export type SelectOrganization = typeof organizations.$inferSelect;

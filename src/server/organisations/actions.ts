"use server";
import {
  authActionClient,
  rolesActionClient,
  userHasRoles,
  userRole,
} from "@/lib/safe-action";
import { invitations, users, organizations } from "../db/schema";
import { z } from "zod";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { orgSchema, roleSchema } from "./validation";
import { revalidatePath } from "next/cache";
import { getUserByEmail } from "../auth";
import { redirect } from "next/navigation";

export const removeUserFromOrganisation = rolesActionClient([userRole.orgAdmin])
  .schema(
    z.object({
      userId: z.string(),
      email: z.string(),
    })
  )
  .action(async ({ parsedInput: input, ctx: { user } }) => {
    if (input.userId === user.id) {
      throw new Error("You cannot remove yourself from the organisation");
    }

    try {
      await db.transaction(async (trx) => {
        await trx
          .update(users)
          .set({
            organization_id: null,
          })
          .where(eq(users.id, input.userId));

        await trx.delete(invitations).where(eq(invitations.email, input.email));
      });

      return { success: true };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to remove user from organisation");
    }
  });

export const createNewOrganisation = rolesActionClient([userRole.ghost])
  .schema(orgSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    const org = await db
      .insert(organizations)
      .values({
        name: input.name,
      })
      .returning();

    revalidatePath("/organisations");

    return org[0];
  });

export const updateUserRole = rolesActionClient([
  userRole.orgAdmin,
  userRole.ghost,
])
  .schema(roleSchema)
  .action(async ({ parsedInput: input, ctx: { user } }) => {
    if (!userHasRoles([userRole.ghost, userRole.orgAdmin], user)) {
      throw new Error("You do not have permission to update user roles");
    }

    return await db
      .update(users)
      .set({
        role: input.role,
      })
      .where(eq(users.id, input.userId))
      .returning();
  });

export const validateUserIsPartOfOrg = authActionClient
  .schema(z.object({ orgId: z.string() }))
  .action(async ({ parsedInput: input, ctx }) => {
    const user = await getUserByEmail(ctx.user.email);

    if (userHasRoles([userRole.ghost], user)) {
      return ctx;
    }

    if (!user) {
      redirect("/login");
    }

    if (
      user?.organization_id &&
      user.organization_id.toString() !== input.orgId
    ) {
      redirect("/timesheets");
    }

    return ctx;
  });

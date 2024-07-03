"use server";
import { rolesActionClient, userRole } from "@/lib/safe-action";
import { invitations, users } from "../db/schema";
import { z } from "zod";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";

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

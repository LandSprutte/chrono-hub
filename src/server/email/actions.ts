"use server";
import {
  authActionClient,
  rolesActionClient,
  userRole,
} from "@/lib/safe-action";
import { LibsqlError } from "@libsql/client";
import { db } from "../db";
import { invitations } from "../db/schema";
import { getUserOrganisation } from "../organisations/queries";
import { invitationSchema } from "./validation";
import { sendEmail } from ".";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getUserByEmail } from "../auth";

export const sendInvitationsEmail = authActionClient
  .use(async ({ next, ctx }) => {
    const { user } = ctx;

    //TODO: Check if user is allowed to send emails to the organisation
    if (!user) {
      throw new Error("You are not allowed to access this resource");
    }

    // Send emails
    return next({ ctx });
  })
  .schema(invitationSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { to } = parsedInput;

    console.log("Sending email to", to, "on behalf of", ctx.user.email);

    const result = await db.transaction(async (trx) => {
      try {
        const user = await getUserByEmail(ctx.user.email);

        if (!user) {
          throw new Error("User not found");
        }

        if (!user.organization_id) {
          throw new Error("User does not belong to an organization");
        }

        if (user.organization_id === null) {
          throw new Error("User does not belong to an organization");
        }

        const orgId = user.organization_id;

        const org = await getUserOrganisation();

        if (!org?.data) {
          throw new Error("Organization not found");
        }

        const response = await sendEmail(
          to,
          org?.data?.id.toString(),
          ctx.user
        );

        if (!response.success) {
          throw new Error("Failed to send email");
        }

        // Save invitation
        const invitationSavedIn = await trx.insert(invitations).values({
          email: to,
          organizationId: orgId,
        });

        return invitationSavedIn;
      } catch (error) {
        if (error instanceof Error) {
          console.error("Failed to send email", error.message);
        }

        if (error instanceof LibsqlError) {
          throw new Error("Invitation already sent to this email");
        }

        trx.rollback();
      }
    });

    return Boolean(result?.rowsAffected && result?.rowsAffected > 0);
    // return await sendEmail(to, orgName, ctx.user);
  });

export const resendInvitationEmail = rolesActionClient([userRole.orgAdmin])
  .schema(
    z.object({
      invitationId: z.number(),
    })
  )
  .action(async ({ parsedInput, ctx }) => {
    const { invitationId } = parsedInput;
    const invitation = await db.query.invitations.findFirst({
      where: (t, { eq }) => eq(t.id, invitationId),
    });

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    const response = await sendEmail(
      invitation.email,
      invitation.organizationId.toString(),
      ctx.user
    );

    if (!response.success) {
      throw new Error("Failed to send email");
    }

    await db
      .update(invitations)
      .set({
        expiresAt: new Date(),
      })
      .where(eq(invitations.id, invitationId));

    return response;
  });

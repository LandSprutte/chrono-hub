import "server-only";
import { config } from "@/config";
import { Resend } from "resend";
import { User } from "lucia";
import { SelectUser } from "../db/schema";
import InviteUserEmail from "@/components/emails/invite-email";

const resend = new Resend(config.env.EMAIL_API_KEY);

export const sendEmail = async (
  to: string,
  orgName: string,
  onbehalf: User | SelectUser
) => {
  const response = await resend.emails.send({
    from: `Chrono hub invitation! 💌 <${config.env.SENDER_EMAIL}>`,
    to,
    subject: `${orgName}, har inviteret dig til et nyt time registreringssystem!`,
    react: (
      <InviteUserEmail
        orgName={orgName}
        invitedByUsername={onbehalf.email.split("@")[0]}
        inviteLink={`${config.env.HOST_URL}/login/google`}
        invitedByEmail={onbehalf.email}
        username={to.split("@")[0]}
      />
    ),
  });

  return { success: !!response.data?.id };
};

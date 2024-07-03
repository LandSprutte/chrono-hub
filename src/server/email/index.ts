import "server-only";
import { config } from "@/config";
import { Resend } from "resend";
import { User } from "lucia";
import { SelectUser } from "../db/schema";

const resend = new Resend(config.env.EMAIL_API_KEY);

export const sendEmail = async (
  to: string,
  orgName: string,
  onbehalf: User | SelectUser
) => {
  const response = await resend.emails.send({
    from: config.env.SENDER_EMAIL,
    to,
    subject: `${orgName}, har inviteret dig til et nyt time registreringssystem!`,
    html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
  });

  console.log(response.error);

  return { success: !!response.data?.id };
};

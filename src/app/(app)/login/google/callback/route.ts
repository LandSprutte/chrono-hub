import { config } from "@/config";
import { google, lucia } from "@/server/auth";
import { db } from "@/server/db";
import { invitations, users } from "@/server/db/schema";
import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";

const setSessionAndRedirect = async (
  userId: string,
  url: string = "/timesheets"
) => {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return new Response(null, {
    status: 302,
    headers: {
      Location: url,
    },
  });
};

// todo: this should be tested at some point
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);

  console.log("url", url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const codeVerifier =
    cookies().get("google_oauth_code_verifier")?.value ?? null;
  const storedState = cookies().get("google_oauth_state")?.value ?? null;

  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !codeVerifier
  ) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);

    const googleUserResponse = await fetch(config.env.GOOGLE_USER_INFO_URL, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const googleUser: GoogleUser = await googleUserResponse.json();

    console.log("[googleUser]: ", googleUser.id);

    //TODO: replace repository code
    const existingUser = await db.query.users
      .findFirst({
        where: (t, { eq }) => eq(t.google_id, googleUser.id),
      })
      .catch((e) => {
        console.log("[DB] [existingUser] ", e);
      });

    console.log("[DB] [existingUser]: ", existingUser);

    if (existingUser) {
      return setSessionAndRedirect(existingUser.id);
    }

    const userPendingHasBeenInvitation = await db.query.invitations.findFirst({
      where: (t, { eq, and, isNull, gte }) =>
        and(
          eq(t.email, googleUser.email),
          isNull(t.acceptedAt),
          gte(t.expiresAt, new Date())
        ),
    });
    const userId = generateIdFromEntropySize(10); // 16 characters long

    if (!userPendingHasBeenInvitation) {
      await db
        .insert(users)
        .values({
          id: userId,
          google_id: googleUser.id,
          username: googleUser.given_name ?? "",
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
        })
        .execute()
        .catch((res) => {
          console.log("res", res);
        });
      return setSessionAndRedirect(userId);
    }

    // USER HAS BEEN INVITED BY ORG ADMIN
    //TODO: replace repository code
    await db
      .insert(users)
      .values({
        id: userId,
        google_id: googleUser.id,
        username: googleUser.given_name ?? "",
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        organization_id: userPendingHasBeenInvitation.organizationId,
        role: userPendingHasBeenInvitation.role,
      })
      .execute()
      .catch((res) => {
        console.log("res", res);
      });

    await db
      .update(invitations)
      .set({
        acceptedAt: new Date(),
      })
      .where(eq(invitations.email, googleUser.email))
      .execute()
      .catch((res) => {
        console.log("res", res);
      });

    return setSessionAndRedirect(userId);
  } catch (e) {
    console.log("e", e);
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  verified_email: boolean;
  locale: string;
  given_name: string;
}

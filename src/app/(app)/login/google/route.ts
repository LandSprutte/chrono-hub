import { config } from "@/config";
import { google } from "@/server/auth";
import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile", "email"],
  });

  cookies().set("google_oauth_state", state, {
    path: "/",
    secure: config.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10, // 10 minutes
    sameSite: "lax",
  });

  cookies().set("google_oauth_code_verifier", codeVerifier, {
    path: "/",
    secure: config.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10, // 10 minutes
    sameSite: "lax",
  });

  return Response.redirect(url);
}

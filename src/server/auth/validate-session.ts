import "server-only";
import { validateSession } from "./index";
import { cache } from "react";

export const getAuthedUser = cache(async () => {
  const session = await validateSession();
  if (!session?.user) {
    return undefined;
  }
  return session.user;
});

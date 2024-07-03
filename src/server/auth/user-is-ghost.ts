import "server-only";
import { config } from "@/config";
import { User } from "lucia";

export const userIsGhost = (user: User) => user.email === config.env.GHOST;

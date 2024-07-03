import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const todayAsYYYYMMDD = format(new Date(), "yyyy-MM-dd");

export const minutesToHours = (minutes: number) => {
  // TODO: download vitest and test this
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;

  return { hours, minutes: restMinutes };
};

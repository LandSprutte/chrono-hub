import { todayAsYYYYMMDD } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function Page() {
  redirect(`/timesheets/${todayAsYYYYMMDD}`);
}

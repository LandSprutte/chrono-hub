"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createNewTimesheet } from "@/server/timesheet/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { timesheetSchema } from "../../server/timesheet/validation";
import { GetMyTimesheetsByWeek } from "@/server/timesheet/queries";

type Props = PropsWithChildren<{
  onSuccess?: () => void;
  timesheet?: GetMyTimesheetsByWeek | null;
  copy?: boolean;
  onSubmit?: (data: z.infer<typeof timesheetSchema>) => void;
}>;

export function TimesheetForm(props: Props) {
  const defaults = {
    date: props.timesheet?.createdAt
      ? new Date(props.timesheet?.createdAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    hours: props.timesheet?.hours ?? 7,
    minutes: props.timesheet?.minutes ?? 30,
    description: props.timesheet?.content ?? "",
  };

  const form = useForm<z.infer<typeof timesheetSchema>>({
    resolver: zodResolver(timesheetSchema),
    defaultValues: defaults,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const model = {
      ...data,
      id: props.copy ? undefined : props.timesheet?.id,
    };
    const response = await createNewTimesheet(model);

    response?.data && props.onSuccess && props.onSuccess();
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Daily Work Registration</CardTitle>
        <CardDescription>
          Log your daily work activities and hours.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={
            props.onSubmit ? form.handleSubmit(props.onSubmit) : onSubmit
          }
          className="space-y-8"
        >
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>
                    The date you completed the work
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="7..." {...field} />
                    </FormControl>
                    <FormDescription>
                      The number of hours you worked
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minutes</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="minutes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Description</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormDescription>
                    Describe the work you completed today
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>{props.children}</CardFooter>
        </form>
      </Form>
    </Card>
  );
}

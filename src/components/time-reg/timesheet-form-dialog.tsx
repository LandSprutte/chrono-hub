"use client";

import { cn } from "@/lib/utils";
import { wait } from "@/lib/wait";
import { useState } from "react";
import { ConfettiButton } from "../magicui/confetti";
import { Button, ButtonProps } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { TimesheetForm } from "./form";
import { GetMyTimesheetsByWeek } from "@/server/timesheet/queries";

export const TimesheetFormDialog = (props: {
  timesheet?: GetMyTimesheetsByWeek | null;
  customizeBtn?: Pick<ButtonProps, "className" | "variant">;
  copy?: boolean;
  triggerText?: string;
  icon?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const CompIcon = props.icon ?? null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        asChild
        variant={props.customizeBtn?.variant ?? "default"}
        className={cn(props.customizeBtn?.className, "max-w-96")}
      >
        <DialogTrigger>
          {props.triggerText}
          {props.icon && CompIcon}
        </DialogTrigger>
      </Button>

      <DialogContent>
        {/* hidden accessability */}
        <DialogTitle className="hidden">
          Dail work registration
        </DialogTitle>{" "}
        <TimesheetForm
          copy={props.copy}
          onSuccess={() => {
            wait(300).then(() => {
              setIsOpen(false);
            });
          }}
          timesheet={props.timesheet}
        >
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          {/* <ConfettiFireworks type="submit" className="ml-auto min-w-28">
            Save
          </ConfettiFireworks> */}
          <ConfettiButton type="submit" className="ml-auto min-w-28">
            Save
          </ConfettiButton>
        </TimesheetForm>
        <DialogDescription className="hidden"> </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

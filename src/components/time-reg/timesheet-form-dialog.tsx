"use client";

import { cn } from "@/lib/utils";
import { wait } from "@/lib/wait";
import { GetMyTimesheetsByWeek } from "@/server/timesheet/queries";
import confetti from "canvas-confetti";
import { useRef, useState } from "react";
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

export const TimesheetFormDialog = (props: {
  timesheet?: GetMyTimesheetsByWeek | null;
  customizeBtn?: Pick<ButtonProps, "className" | "variant">;
  copy?: boolean;
  triggerText?: string;
  icon?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

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
            if (!ref.current) {
              setIsOpen(false);
              return;
            }
            const rect = ref?.current.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            confetti({
              origin: {
                x: x / window.innerWidth,
                y: y / window.innerHeight,
              },
            });
            wait(300).then(() => {
              setIsOpen(false);
            });
          }}
          timesheet={props.timesheet}
        >
          <Button
            type="button"
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

          <ConfettiButton type="submit" className="ml-auto min-w-28" ref={ref}>
            Save
          </ConfettiButton>
        </TimesheetForm>
        <DialogDescription className="hidden"> </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

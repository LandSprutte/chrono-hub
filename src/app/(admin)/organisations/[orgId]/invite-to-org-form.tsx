"use client";
import { Button } from "@/components/ui/button";
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
import { sendInvitationsEmail } from "@/server/email/actions";
import { invitationSchema } from "@/server/email/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  addOptimisticUser?: (email: string) => void;
};

export const InviteToOrgForm = (props: Props) => {
  const form = useForm<z.infer<typeof invitationSchema>>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      to: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    props.addOptimisticUser && props.addOptimisticUser(data.to);

    const response = await sendInvitationsEmail(data);

    if (response?.serverError) {
      toast("Failed to invite!", {
        description: response.serverError,
      });
    }

    if (response?.data) {
      form.resetField("to");
      toast("Invite send!", {
        description: "Email invite succesfully send to " + data.to,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    }
  });

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Send invitations</h2>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@doe" {...field} />
                </FormControl>
                <FormDescription>
                  Email you want to join your organisation
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={form.formState.isSubmitting} type="submit">
            Send invitation
          </Button>
        </form>
      </Form>
    </div>
  );
};

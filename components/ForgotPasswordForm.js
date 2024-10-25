"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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
import { resetUserPassword } from "@/lib/actions/userActions";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const formSchema = z.object({
  username: z.string(),
});

export function ForgotPasswordForm() {
  const router = useRouter();
  const [sendingEmail, setSendingEmail] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = async (data) => {
    setSendingEmail(true);

    const { data: result, error } = await resetUserPassword(data.username);

    form.setError("form", {
      type: "custom",
      message:
        "If the email address given exists, a password reset email will be sent to that email.",
    });

    setSendingEmail(false);
  };

  return (
    <Card className="w-full max-w-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-2xl">Password Recovery</CardTitle>
            <CardDescription>
              Enter your email below to recover your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.form && (
              <FormMessage className="text-center mt-4">{`${form.formState.errors.form.message}`}</FormMessage>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={sendingEmail}>
              {sendingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Email
                </>
              ) : (
                <>Send Recovery Email</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

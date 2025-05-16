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

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  resetUserPassword,
  verifyEmailOTP,
} from "@/lib/actions/authenticationActions";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import React, { useState } from "react";

const formSchema = z.object({
  email: z.string(),
  verificationCode: z.string(),
});

export function ForgotPasswordForm() {
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      verificationCode: "",
    },
  });

  const onEmailSubmit = async (data) => {
    try {
      setSendingEmail(true);

      const { data: result, resetError } = await resetUserPassword(data.email);

      setIsEmailSubmitted(true);
      setSendingEmail(false);

      if (resetError) {
        throw new Error("Error sending reset email. Try again.");
      }
    } catch (error) {
      form.setError("form", {
        type: "custom",
        message: error,
      });
    }
  };

  const onOTPSubmit = async (data) => {
    //call verifyOTP action. if error display the error. Otherwise go to the reset page

    const { result, error } = await verifyEmailOTP(
      data.email,
      data.verificationCode
    );

    if (error) {
      form.setError("verificationCode", { type: "custom", message: error });
    } else {
      router.push("/reset");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={
          isEmailSubmitted
            ? form.handleSubmit(onOTPSubmit)
            : form.handleSubmit(onEmailSubmit)
        }
      >
        <CardHeader className="px-0">
          <CardTitle className="text-2xl">Password Recovery</CardTitle>
          <CardDescription>
            Enter your email below to recover your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 flex flex-col gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={isEmailSubmitted}
                    placeholder={
                      isEmailSubmitted ? form.getValues("email") : ""
                    }
                    {...field}
                  />
                </FormControl>
                {isEmailSubmitted && (
                  <p className="text-green-700">
                    A verification code has been sent to your email.
                    <br />
                    Please enter that code below.
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          {isEmailSubmitted && (
            <FormField
              control={form.control}
              name="verificationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormDescription>
                    Please enter the one-time password sent to your email.
                  </FormDescription>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      {...field}
                      containerClassName="justify-center"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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
            ) : isEmailSubmitted ? (
              <>Verify</>
            ) : (
              <>Send Recovery Email</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}

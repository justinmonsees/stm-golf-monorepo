"use client";

import { Button } from "@/components/ui/button";
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
import { verifyEmailOTP } from "@/lib/actions/authenticationActions";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const formSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

z;
export function VerifyOTPForm({ email }) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: "",
    },
  });

  const onSubmit = async (data) => {
    console.log(data);

    //call verifyOTP action. if error display the error. Otherwise go to the reset page
    const { result, error } = verifyEmailOTP(email, data.pin);

    if (error) {
      form.setError("form", { type: "custom", message: error });
    } else {
      form.setError("form", { type: "custom", message: result });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader className="px-0">
          <CardTitle className="text-2xl">Verify OTP</CardTitle>
          <CardDescription>
            Please check your email. We've sent a one time verification code to{" "}
            {email}.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
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
                <FormDescription>
                  Please enter the one-time password sent to your email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.form && (
            <FormMessage className="text-center mt-4">{`${form.formState.errors.form.message}`}</FormMessage>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit">
            Update Password
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}

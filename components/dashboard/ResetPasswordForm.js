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
import { updateUserByID } from "@/lib/actions/userActions";
import { updatePassword } from "@/lib/actions/authenticationActions";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
z;
export function ResetPasswordForm({ user, initReset }) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    const { result, error } = await updatePassword(user.email, data.password);

    if (error) {
      form.setError("form", { type: "custom", message: error });
    } else {
      if (initReset) {
        const { result: userResult, error: userError } = await updateUserByID(
          user.id,
          {
            needs_reset: false,
          }
        );

        if (userError) {
          form.setError("form", { type: "custom", message: userError });
        }
      }
      router.push("/");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader className="px-0">
          <CardTitle className="text-2xl">Create New Password</CardTitle>
          <CardDescription>
            Create a new password for your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} />
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
          <Button className="w-full" type="submit">
            Update Password
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}

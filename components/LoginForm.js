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

import { login } from "@/app/(auth)/login/actions";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export function LoginForm() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const { data: userProfile, error } = await login(
      data.username,
      data.password
    );

    if (userProfile) {
      if (userProfile.needs_reset) {
        alert(
          "A default password has been used. You will now be redirected to change your password."
        );

        router.push("/reset");
      } else {
        router.push("/");
      }
    } else {
      form.setError("form", { type: "custom", message: error });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader className="px-0">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
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
          {form.formState.errors.form && (
            <FormMessage className="text-center mt-4">{`${form.formState.errors.form.message}`}</FormMessage>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit">
            Sign in
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}

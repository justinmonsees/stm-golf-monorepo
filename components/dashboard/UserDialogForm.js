"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DatePicker } from "../ui/datepicker";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "../ui/spinner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addUser, updateUserByID } from "@/lib/actions/userActions";
import { useToast } from "../ui/use-toast";

const formSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  role: z.string(),
});

const USER_OPTIONS = ["user", "admin"];

const UserDialogForm = ({ isFormOpen, formHandler, user = null }) => {
  const { toast } = useToast();
  const router = useRouter();

  const supabase = createClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: user ? user.role : "user",
    },
  });

  // extract the reset function from the form object to be used as a stable
  //  reference inside the useEffect call
  const { reset } = form;

  useEffect(() => {
    if (user) {
      reset({
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      });
    } else {
      reset({
        role: "user",
        firstName: "",
        lastName: "",
        email: "",
      });
    }
  }, [user, isFormOpen, reset]);

  const onSubmit = async (data) => {
    console.log("USER DATA", data);
    formHandler();
    //If there's an existing user, edit the user
    if (user) {
      const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
      };
      const { result, error } = await updateUserByID(user.user_id, updateData);

      if (error) {
        toast({
          variant: "destructive",
          title: result,
          description: error,
        });
      } else {
        toast({
          variant: "success",
          description: result,
        });
        router.refresh();
      }
    }
    //Otherwise we are adding a user
    else {
      const newUserData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
      };

      const { result, error } = await addUser(newUserData);

      if (error) {
        toast({
          variant: "destructive",
          title: result,
          description: error,
        });
      } else {
        toast({
          variant: "success",
          description: result,
        });
        router.refresh();
      }
    }
  };

  return (
    <Dialog
      onOpenChange={formHandler}
      open={isFormOpen}
      defaultOpen={isFormOpen}
    >
      <DialogContent className="sm:max-w-[550px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
              <DialogDescription className="sr-only">
                Add or Edit a User Dialog
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4  ">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1">
                <FormField
                  control={form.control}
                  name="attendeeType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        name="attendeeType"
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={user ? user.role : "user"}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {USER_OPTIONS.map((item, index) => {
                            return (
                              <SelectItem key={index} value={item}>
                                {item}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialogForm;

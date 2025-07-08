"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { convertToLocalDate } from "@/lib/helpers";
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

import { updateAttendeeByID } from "@/lib/actions/attendeeActions";
import { useToast } from "../ui/use-toast";
import { useAttendeeContext } from "@/lib/context/attendeesContext";

const formSchema = z.object({
  attendeeType: z.string().min(1, "Attendee Type is required"),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string().max(12),
  email: z.string().email().optional().or(z.literal("")),
  address1: z.string().optional().or(z.literal("")),
  address2: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z.string().max(2).optional().or(z.literal("")),
  zip: z.string().max(10).optional().or(z.literal("")),
  datePaid: z.date().nullable(),
});

const EditAttendeeDialog = ({ isFormOpen, formHandler, attendee }) => {
  const { toast } = useToast();
  const { attendeeItems } = useAttendeeContext();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attendeeType: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      datePaid: null,
    },
  });

  // extract the reset function from the form object to be used as a stable
  //  reference inside the useEffect call
  const { reset } = form;

  useEffect(() => {
    if (attendee) {
      reset({
        attendeeType: attendeeItems
          ? attendeeItems.find((item) => item.name === attendee.attendee_type)
              ?.item_id
          : "",
        firstName: attendee.first_name,
        lastName: attendee.last_name,
        phoneNumber: attendee.phone_number,
        email: attendee.email,
        address1: attendee.address1,
        address2: attendee.address2,
        city: attendee.city,
        state: attendee.state,
        zip: attendee.zip,
        datePaid: convertToLocalDate(new Date(attendee.date_paid)),
      });
    }
  }, [attendee, isFormOpen, attendeeItems]);

  const onSubmit = async (data) => {
    formHandler();

    const isPaid = data.datePaid ? true : false;

    const attendeeItem = attendeeItems.find(
      (item) => item.item_id === data.attendeeType
    );

    const updateData = {
      attendee_type: attendeeItem.name,
      first_name: data.firstName,
      last_name: data.lastName,
      phone_number: data.phoneNumber,
      email: data.email,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      state: data.state,
      zip: data.zip,
      date_paid: data.datePaid,
      paid: isPaid,
      amount_paid: attendeeItem.cost,
    };
    const { result, error } = await updateAttendeeByID(
      attendee.attendee_id,
      updateData
    );

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
  };

  return (
    <Dialog
      onOpenChange={formHandler}
      open={isFormOpen}
      defaultOpen={isFormOpen}
    >
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Attendee</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Dialog Form to Edit an Attendee
        </DialogDescription>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1">
                <FormField
                  control={form.control}
                  name="attendeeType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attendee Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                attendee
                                  ? attendeeItems.find(
                                      (item) =>
                                        item.name === attendee.attendee_type
                                    ).name
                                  : attendeeItems.find(
                                      (item) => item.name === "Golfer"
                                    ).name
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {attendeeItems.map((item) => {
                            return (
                              <SelectItem
                                key={item.item_id}
                                value={item.item_id}
                              >
                                {item.name}
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

              <div className="grid grid-cols-2 gap-4  ">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

              <div className="grid grid-cols-1 ">
                <FormField
                  control={form.control}
                  name="address1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address 1</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 ">
                <FormField
                  control={form.control}
                  name="address2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address 2</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-9 gap-4 ">
                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-flow-col grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="datePaid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Paid</FormLabel>
                      <DatePicker field={field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="mt-auto"
                  type="button"
                  onClick={() =>
                    form.resetField("datePaid", { defaultValue: null })
                  }
                >
                  Clear
                </Button>
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

export default EditAttendeeDialog;

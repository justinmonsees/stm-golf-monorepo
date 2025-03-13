"use client";

import React from "react";
import {
  Form,
  FormControl,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "../ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCart } from "@/lib/context/cartContext";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const attendeeFormSchema = z.object({
  attendeeType: z.string(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string().min(10),
  email: z.string().email(),
});

const AttendeeRegistrationForm = ({
  attendeeItems,
  cartItemId = null,
  isFormOpen,
  formHandler,
}) => {
  const cart = useCart();
  const { items } = cart;

  const form = useForm({
    resolver: zodResolver(attendeeFormSchema),
    defaultValues: {
      attendeeType: attendeeItems
        ? attendeeItems.find((item) => item.name === "Golfer")?.item_id
        : "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
    },
  });

  // extract the reset function from the form object to be used as a stable
  //  reference inside the useEffect call
  const { reset } = form;

  useEffect(() => {
    if (cartItemId) {
      const cartItem = items.find((item) => item.id === cartItemId);

      reset({
        attendeeType: cartItem.item_id,
        firstName: cartItem.meta.firstName,
        lastName: cartItem.meta.lastName,
        phoneNumber: cartItem.meta.phoneNumber,
        email: cartItem.meta.email,
      });
    } else {
      reset({
        attendeeType: attendeeItems
          ? attendeeItems.find((item) => item.name === "Golfer")?.item_id
          : "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
      });
    }
  }, [cartItemId, isFormOpen, reset, attendeeItems, items]);

  const handleSaveOnly = async (data) => {
    onSubmit(data);
    formHandler();
  };

  const handleSaveAndAdd = async (data) => {
    onSubmit(data);
    form.reset({
      attendeeType: attendeeItems
        ? attendeeItems.find((item) => item.name === "Golfer")?.item_id
        : "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
    });
  };

  const onSubmit = (data) => {
    const selectedItem = attendeeItems.find(
      (item) => item.item_id === data.attendeeType
    );

    //remove the attendee type property from the data object to add to cartItem's meta property
    const { ["attendeeType"]: omitted, ...attendeeInfo } = data;

    cartItemId
      ? cart.editItem(cartItemId, {
          ...selectedItem,
          meta: attendeeInfo,
        })
      : cart.addItem({
          ...selectedItem,
          meta: attendeeInfo,
        });
  };

  return (
    <Dialog
      onOpenChange={formHandler}
      open={isFormOpen}
      defaultOpen={isFormOpen}
    >
      <DialogContent className="sm:max-w-[550px] max-h-[75%] overflow-y-auto ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle className="mb-5">
                {cartItemId ? "Edit Attendee" : "Add Attendee"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4 ">
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
                                cartItemId
                                  ? cart.items.find(
                                      (item) => item.id === cartItemId
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
            </div>

            <DialogFooter>
              <div className="mt-5 flex w-full justify-between">
                <Button onClick={form.handleSubmit(handleSaveAndAdd)}>
                  Save and Add
                </Button>
                <Button onClick={form.handleSubmit(handleSaveOnly)}>
                  Save and Close
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AttendeeRegistrationForm;

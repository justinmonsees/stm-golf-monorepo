"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCart } from "@/lib/context/cartContext";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { FloatingLabelInput } from "../ui/floating-label-input";

export const sponsorSchema = z.object({
  company: z.string().min(1).nullable(),
  businessPhoneNumber: z.string().nullable(),
  address1: z.string().min(1).nullable(),
  address2: z.string().nullable(),
  city: z.string().min(1).nullable(),
  state: z.string().min(2).max(2).nullable(),
  zip: z.string().min(5).nullable(),
  solicitor: z.string().nullable(),
  contactPrefix: z.string().nullable(),
  contactFirstName: z.string().min(1).nullable(),
  contactLastName: z.string().min(1).nullable(),
  contactPhoneNumber: z.string().min(10).nullable(),
  contactEmail: z.string().email().nullable(),
});

export const sponsorDefaultValues = {
  solicitor: "",
  company: "",
  businessPhoneNumber: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  contactPrefix: "",
  contactFirstName: "",
  contactLastName: "",
  contactPhoneNumber: "",
  contactEmail: "",
};

const SponsorCheckoutForm = ({ formControl }) => {
  const cart = useCart();

  const form = useForm({
    resolver: zodResolver(sponsorSchema),
    defaultValues: sponsorDefaultValues,
  });

  const onSubmit = async (data) => {
    console.log("button clicked");
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 ">
            <FormField
              control={form.control}
              name="sponsor.solicitor"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sponsor.company"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      id="sponsor.company"
                      label="Company"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1">
            <FormField
              control={form.control}
              name="sponsor.address1"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      id="sponsor.address1"
                      label="Address 1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1">
            <FormField
              control={form.control}
              name="sponsor.address2"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      id="sponsor.address2"
                      label="Address 2"
                      {...field}
                    />
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
                name="sponsor.city"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput
                        id="sponsor.city"
                        label="City"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-2">
              <FormField
                control={form.control}
                name="sponsor.state"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput
                        id="sponsor.state"
                        label="State"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-3">
              <FormField
                control={form.control}
                name="sponsor.zip"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput
                        id="sponsor.zip"
                        label="Zip Code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 ">
            <FormField
              control={form.control}
              name="sponsor.businessPhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      id="sponsor.businessPhoneNumber"
                      label="Business Phone Number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-8 gap-4  ">
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="sponsor.contactPrefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          id="sponsor.contactPrefix"
                          label="Prefix"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="sponsor.contactFirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          id="sponsor.contactFirstName"
                          label="First Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="sponsor.contactLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          id="sponsor.contactLastName"
                          label="Last Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 ">
              <FormField
                control={form.control}
                name="sponsor.contactPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput
                        id="sponsor.contactPhoneNumber"
                        label="Phone Number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 ">
              <FormField
                control={form.control}
                name="sponsor.contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput
                        id="sponsor.contactEmail"
                        label="Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <Button type="submit">Save changes</Button>
      </form>
    </Form>
  );
};

export default SponsorCheckoutForm;

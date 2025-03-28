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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateInvoicePDF } from "@/lib/invoices/invoice";

export const sponsorSchema = z.object({
  company: z.string().min(1),
  businessPhoneNumber: z.string(),
  address1: z.string().min(1),
  address2: z.string(),
  city: z.string().min(1),
  state: z.string().min(2).max(2),
  zip: z.string().min(5),
  solicitor: z.string(),
  contactPrefix: z.string(),
  contactFirstName: z.string().min(1),
  contactLastName: z.string().min(1),
  contactPhoneNumber: z.string().min(10),
  contactEmail: z.string().email(),
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
    const purchaser = {
      type: "business",
      companyInfo: {
        company: data.company,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        zip: data.zip,
        businessPhoneNumber: data.businessPhoneNumber,
      },
      contactInfo: {
        prefix: data.contactPrefix,
        firstName: data.contactFirstName,
        lastName: data.contactLastName,
        phoneNumber: data.contactPhoneNumber,
        email: data.contactEmail,
      },
    };
    generateInvoicePDF(purchaser, cart.items);
  };

  return (
    <Card className="mx-4">
      <CardContent>
        <CardTitle className="mt-5">Sponsor Information</CardTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 ">
                <FormField
                  control={form.control}
                  name="solicitor"
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
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          id="company"
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
                  name="address1"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          id="address1"
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
                  name="address2"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          id="address2"
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
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingLabelInput
                            id="city"
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
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingLabelInput
                            id="state"
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
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingLabelInput
                            id="zip"
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
                  name="businessPhoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          id="businessPhoneNumber"
                          label="Business Phone Number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <CardTitle className="mt-5">Contact Information</CardTitle>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-8 gap-4  ">
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="contactPrefix"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FloatingLabelInput
                              id="contactPrefix"
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
                      name="contactFirstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FloatingLabelInput
                              id="contactFirstName"
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
                      name="contactLastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FloatingLabelInput
                              id="contactLastName"
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
                    name="contactPhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingLabelInput
                            id="contactPhoneNumber"
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
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingLabelInput
                            id="contactEmail"
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
            <Button type="submit">Generate Invoice</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SponsorCheckoutForm;

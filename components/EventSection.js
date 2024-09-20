"use client";

import React from "react";
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

import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "./ui/datepicker";
import { convertToLocalDate } from "@/lib/helpers";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

import { updateEventByID } from "@/lib/actions/eventActions";

const formSchema = z.object({
  eventDate: z.date(),
  arrivalTime: z.string().min(1),
  startTime: z.string().min(1),
  venueName: z.string().min(1),
  venueAddress1: z.string().min(1),
  venueAddress2: z.string(),
  venueCity: z.string().min(1),
  venueState: z.string().min(2),
  venueZip: z.string().min(5),
});

const EventSection = ({ events }) => {
  const { toast } = useToast();

  const curEvent = events.find((event) => event.is_current_event === true);

  const localDate = convertToLocalDate(curEvent.event_date);

  const curEventDate = new Date(localDate);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventDate: curEventDate,
      arrivalTime: curEvent.arrival_time,
      startTime: curEvent.start_time,
      venueName: curEvent.venue_name,
      venueAddress1: curEvent.venue_address,
      venueAddress2: curEvent.venue_address2,
      venueCity: curEvent.venue_city,
      venueState: curEvent.venue_state,
      venueZip: curEvent.venue_zip,
    },
  });

  const onSubmit = async (data) => {
    const updateData = {
      event_date: data.eventDate.toISOString(),
      arrival_time: data.arrivalTime,
      start_time: data.startTime,
      venue_name: data.venueName,
      venue_address: data.venueAddress1,
      venue_address2: data.venueAddress2,
      venue_city: data.venueCity,
      venue_state: data.venueState,
      venue_zip: data.venueZip,
    };
    const { result, error } = await updateEventByID(
      curEvent.event_id,
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
    }
  };

  return (
    <div className="w-full py-10 px-20">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="text-4xl">Event Info</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-12 gap-3">
              <h2 className="col-span-12 text-center font-bold text-lg">
                Date/Time
              </h2>
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="eventDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Date</FormLabel>
                      <DatePicker field={field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="arrivalTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arrival Time</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <h2 className="col-span-12 text-center font-bold text-lg">
                Location
              </h2>
              <div className="col-span-12">
                <FormField
                  control={form.control}
                  name="venueName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venue</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12">
                <FormField
                  control={form.control}
                  name="venueAddress1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address 1</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12">
                <FormField
                  control={form.control}
                  name="venueAddress2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address 2</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-5">
                <FormField
                  control={form.control}
                  name="venueCity"
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
              <div className="col-span-5">
                <FormField
                  control={form.control}
                  name="venueState"
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
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="venueZip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button className="col-span-4 col-start-5" type="submit">
                Save Changes
              </Button>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default EventSection;

"use client";

import React from "react";

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

import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "../ui/datepicker";
import { convertToLocalDate } from "@/lib/helpers";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addEvent, updateEventByID } from "@/lib/actions/eventActions";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "../ui/spinner";
import { Switch } from "../ui/switch";

const formSchema = z.object({
  eventDate: z.date(),
  arrivalTime: z.string(),
  startTime: z.string(),
  venueName: z.string(),
  venueAddress1: z.string(),
  venueAddress2: z.string(),
  venueCity: z.string(),
  venueState: z.string().max(2),
  venueZip: z.string().max(5),
  regOpenDate: z.date().nullable(),
  regCloseDate: z.date().nullable(),
  chairperson: z.string().nullable(),
  host: z.string(),
});

const EventDialogForm = ({
  isFormOpen,
  formHandler,
  event = null,
  events,
  committeeMembers,
  hosts,
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const [user, setUser] = useState({});

  useEffect(() => {
    setLoading(true);

    const getUser = async () => {
      const { data: profile } = await supabase
        .from("Profiles")
        .select("user_id, first_name, last_name,role");

      setUser(profile[0]);
      setLoading(false);
    };

    getUser();
  }, [supabase]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventDate: null,
      arrivalTime: "",
      startTime: "",
      venueName: "",
      venueAddress1: "",
      venueAddress2: "",
      venueCity: "",
      venueState: "",
      venueZip: "",
      regOpenDate: null,
      regCloseDate: null,
      chairperson: null,
      host: hosts[0].host_id,
    },
  });

  // extract the reset function from the form object to be used as a stable
  //  reference inside the useEffect call
  const { reset } = form;

  useEffect(() => {
    if (event) {
      reset({
        eventDate: convertToLocalDate(new Date(event.event_date)),
        arrivalTime: event.arrival_time,
        startTime: event.start_time,
        venueName: event.venue_name,
        venueAddress1: event.venue_address,
        venueAddress2: event.venue_address2,
        venueCity: event.venue_city,
        venueState: event.venue_state,
        venueZip: event.venue_zip,
        regOpenDate: convertToLocalDate(new Date(event.reg_open_date)),
        regCloseDate: convertToLocalDate(new Date(event.reg_close_date)),
        chairperson: event.chairperson_id,
        host: event.host_id,
      });
    } else {
      reset({
        eventDate: null,
        arrivalTime: "",
        startTime: "",
        venueName: "",
        venueAddress1: "",
        venueAddress2: "",
        venueCity: "",
        venueState: "",
        venueZip: "",
        regOpenDate: null,
        regCloseDate: null,
        chairperson: null,
        host: hosts[0].host_id,
      });
    }
  }, [event, isFormOpen, reset, hosts]);

  const onSubmit = async (data) => {
    formHandler();
    //If there's an existing event, edit the event

    if (event) {
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
        reg_open_date: data.regOpenDate,
        reg_close_date: data.regCloseDate,
        chairperson_id: data.chairperson,
        host_id: data.host,
      };
      const { result, error } = await updateEventByID(
        event.event_id,
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
    }
    //Otherwise we are adding an event
    else {
      const newEventData = {
        event_date: data.eventDate.toISOString(),
        arrival_time: data.arrivalTime,
        start_time: data.startTime,
        venue_name: data.venueName,
        venue_address: data.venueAddress1,
        venue_address2: data.venueAddress2,
        venue_city: data.venueCity,
        venue_state: data.venueState,
        venue_zip: data.venueZip,
        reg_open_date: data.regOpenDate,
        reg_close_date: data.regCloseDate,
        chairperson_id: data.chairperson,
        host_id: data.host,
      };

      const { result, error } = await addEvent(newEventData);

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

  const handleSwitchEvent = (value) => {
    if (value) {
      const curEventArr = events.filter(
        (event) => event.is_current_event === true
      );

      const curEvent = curEventArr[0];

      form.setValue("arrivalTime", curEvent.arrival_time);
      form.setValue("startTime", curEvent.start_time);
      form.setValue("chairperson", curEvent.chairperson_id);
      form.setValue("venueName", curEvent.venue_name);
      form.setValue("venueAddress1", curEvent.venue_address);
      form.setValue("venueAddress2", curEvent.venue_address2);
      form.setValue("venueCity", curEvent.venue_city);
      form.setValue("venueState", curEvent.venue_state);
      form.setValue("venueZip", curEvent.venue_zip);
    } else {
      form.setValue("arrivalTime", "");
      form.setValue("startTime", "");
      form.setValue("chairperson", "");
      form.setValue("venueName", "");
      form.setValue("venueAddress1", "");
      form.setValue("venueAddress2", "");
      form.setValue("venueCity", "");
      form.setValue("venueState", "");
      form.setValue("venueZip", "");
    }
  };

  return (
    <Dialog
      onOpenChange={formHandler}
      open={isFormOpen}
      defaultOpen={isFormOpen}
    >
      <DialogContent className="sm:max-w-[80%] max-h-[90%] overflow-y-auto">
        <DialogHeader className="mb-2">
          <DialogTitle>{event ? "Edit Event" : "Add Event"}</DialogTitle>
          <DialogDescription className="sr-only">
            Dialog Form to Add or Edit an Event
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <Spinner size="medium" />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex align-middle py-2">
                <span className="mr-4 text-sm">
                  Duplicate information from last event?
                </span>
                {event ? "" : <Switch onCheckedChange={handleSwitchEvent} />}
              </div>

              <div id="DialogBody" className=" grid grid-cols-2 gap-5 pb-5">
                <div id="gridLeftCol">
                  <fieldset
                    id="orgInfo"
                    className=" p-4 border border-stm-red rounded-md"
                  >
                    <legend className="text-stm-red px-2">
                      Organization Information
                    </legend>

                    <FormField
                      control={form.control}
                      name="host"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Host</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    event?.hosts
                                      ? `${event.hosts.name}`
                                      : `${hosts[0].name}`
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {hosts.map((host) => {
                                return (
                                  <SelectItem
                                    key={host.host_id}
                                    value={host.host_id}
                                  >
                                    {`${host.name}`}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="chairperson"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chairperson</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    event?.committee_members
                                      ? `${event.committee_members.first_name} ${event.committee_members.last_name}`
                                      : "Please select a committee member"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {committeeMembers.map((member) => {
                                return (
                                  <SelectItem
                                    key={member.committee_member_id}
                                    value={member.committee_member_id}
                                  >
                                    {`${member.first_name} ${member.last_name}`}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </fieldset>
                  <fieldset className="border border-stm-red rounded-md p-4 grid grid-cols-3 gap-2">
                    <legend className="text-stm-red px-2">Date/Time</legend>

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
                  </fieldset>

                  <fieldset className="border border-stm-red rounded-md p-4 grid grid-cols-2 gap-2">
                    <legend className="text-stm-red px-2">
                      Registration Dates
                    </legend>

                    <FormField
                      control={form.control}
                      name="regOpenDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Open Date</FormLabel>
                          <DatePicker field={field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="regCloseDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Close Date</FormLabel>
                          <DatePicker field={field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </fieldset>
                </div>
                <div id="gridColRight">
                  <fieldset className="border border-stm-red rounded-md p-4 grid grid-cols-12 gap-2 h-full">
                    <legend className="text-stm-red px-2">Location</legend>
                    <div className="col-span-12">
                      <FormField
                        control={form.control}
                        name="venueName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Venue Name</FormLabel>
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
                    <div className="col-span-6">
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
                    <div className="col-span-2">
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
                    <div className="col-span-4">
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
                  </fieldset>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventDialogForm;

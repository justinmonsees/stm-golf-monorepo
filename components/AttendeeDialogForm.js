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
import { DatePicker } from "./ui/datepicker";
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
import { Spinner } from "./ui/spinner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { addAttendee, updateAttendeeByID } from "@/lib/actions/attendeeActions";
import { useToast } from "./ui/use-toast";

const formSchema = z.object({
  attendeeType: z.string(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string().min(10),
  email: z.string().email(),
  address1: z.string().min(1),
  address2: z.string(),
  city: z.string().min(1),
  state: z.string().min(2),
  zip: z.string().min(5),
  datePaid: z.date().nullable(),
});

const AttendeeDialogForm = ({ isFormOpen, formHandler, attendee = null }) => {
  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const [user, setUser] = useState({});
  const [attendeeItems, setAttendeeItems] = useState([]);
  const [currentEventID, setCurrentEventID] = useState("");

  const getUser = async () => {
    const { data: profile } = await supabase
      .from("Profiles")
      .select("user_id, first_name, last_name,role");

    setUser(profile[0]);
  };

  const getAttendeeItems = async () => {
    const { data: items } = await supabase
      .from("Items")
      .select("*")
      .eq("item_type", "attendee");

    setAttendeeItems(items);
  };

  const getCurrentEvent = async () => {
    const { data: eventID } = await supabase
      .from("Events")
      .select("event_id")
      .eq("is_current_event", true);

    setCurrentEventID(eventID[0].event_id);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([getUser(), getAttendeeItems(), getCurrentEvent()]).then(
      (data) => {
        console.log("items received");
        setLoading(false);
      }
    );
  }, []);
  console.log(attendeeItems);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attendeeType: attendeeItems
        ? attendeeItems.find((item) => item.name === "Golfer")?.item_id
        : "",
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

  useEffect(() => {
    if (attendee) {
      form.reset({
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
    } else {
      form.reset({
        attendeeType: attendeeItems
          ? attendeeItems.find((item) => item.name === "Golfer")?.item_id
          : "",
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
      });
    }
  }, [attendee, isFormOpen]);

  const onSubmit = async (data) => {
    console.log(data.attendeeType);
    formHandler();
    //If there's an existing item, edit the item
    if (attendee) {
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
    }
    //Otherwise we are adding an attendee
    else {
      const isPaid = data.datePaid ? true : false;

      const attendeeItem = attendeeItems.find(
        (item) => item.item_id === data.attendeeType
      );

      const newAttendeeData = {
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
        event_id: currentEventID,
      };

      console.log(newAttendeeData);
      const { result, error } = await addAttendee(newAttendeeData);

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
        {loading ? (
          <Spinner size="medium" />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>
                  {attendee ? "Edit Attendee" : "Add Attendee"}
                </DialogTitle>
              </DialogHeader>

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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AttendeeDialogForm;

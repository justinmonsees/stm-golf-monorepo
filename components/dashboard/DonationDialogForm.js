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
  Combobox,
  ComboboxTrigger,
  ComboboxValue,
  ComboboxContent,
} from "../ui/combobox";
import { Input } from "@/components/ui/input";
import { DatePicker } from "../ui/datepicker";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "../ui/spinner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addDonation, updateDonationByID } from "@/lib/actions/donationActions";
import { useToast } from "../ui/use-toast";
import { convertToLocalDate } from "@/lib/helpers";

const formSchema = z.object({
  sponsor: z.string(),
  item: z.string(),
  amountReceived: z.coerce.number(),
  datePaid: z.date(),
  notes: z.string(),
});

const DonationDialogForm = ({
  isFormOpen,
  formHandler,
  donation = null,
  sponsors,
  items,
  curEvent,
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
      sponsor: "",
      item: "",
      amountReceived: "",
      datePaid: "",
      notes: "",
    },
  });

  // extract the reset function from the form object to be used as a stable
  //  reference inside the useEffect call
  const { reset } = form;

  useEffect(() => {
    if (donation) {
      reset({
        sponsor: donation.sponsor_id,
        item: donation.item_id,
        amountReceived: donation.amount_received,
        datePaid: convertToLocalDate(new Date(donation.date_paid)),
        notes: donation.notes,
      });
    } else {
      reset({
        sponsor: "",
        item: "",
        amountReceived: "",
        datePaid: "",
        notes: "",
      });
    }
  }, [donation, isFormOpen, reset]);

  const onSubmit = async (data) => {
    formHandler();
    //If there's an existing item, edit the item
    let isPaid = false;
    if (data.datePaid) {
      isPaid = true;
    }

    if (donation) {
      const updateData = {
        sponsor_id: data.sponsor,
        item_id: data.item,
        amount_received: data.amountReceived,
        date_paid: data.datePaid,
        is_paid: isPaid,
        notes: data.notes,
      };

      const { result, error } = await updateDonationByID(
        donation.donation_id,
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
    //Otherwise we are adding an item
    else {
      const newDonationData = {
        event_id: curEvent.event_id,
        sponsor_id: data.sponsor,
        item_id: data.item,
        amount_received: data.amountReceived,
        date_paid: data.datePaid,
        is_paid: isPaid,
        notes: data.notes,
      };

      const { result, error } = await addDonation(newDonationData);

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
      <DialogContent className="sm:max-w-[550px] max-h-[90%] overflow-y-auto">
        <DialogDescription className="sr-only">
          Dialog Form to Add or Edit a Donation
        </DialogDescription>
        {loading ? (
          <Spinner size="medium" />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>
                  {donation ? "Edit Donation" : "Add Donation"}
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1">
                  <FormField
                    control={form.control}
                    name="sponsor"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Sponsor</FormLabel>
                        <Combobox
                          width={400}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <ComboboxTrigger>
                              <ComboboxValue
                                placeholder={
                                  donation
                                    ? sponsors.find(
                                        (sponsor) =>
                                          sponsor.sponsor_id ===
                                          donation.sponsor_id
                                      ).company_name
                                    : "Select a Sponsor"
                                }
                              />
                            </ComboboxTrigger>
                          </FormControl>
                          <ComboboxContent
                            searchPlaceholder={"Search Sponsors..."}
                            emptyPlaceholder={"No sponsors found."}
                            items={sponsors.map((sponsor) => {
                              return {
                                label: sponsor.company_name,
                                value: sponsor.sponsor_id,
                              };
                            })}
                          />
                        </Combobox>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1">
                  <FormField
                    control={form.control}
                    name="item"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Donation Item</FormLabel>
                        <Combobox
                          width={400}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <ComboboxTrigger>
                              <ComboboxValue
                                placeholder={
                                  donation
                                    ? items.find(
                                        (item) =>
                                          item.item_id === donation.item_id
                                      ).name
                                    : "Select a Donation Item"
                                }
                              />
                            </ComboboxTrigger>
                          </FormControl>
                          <ComboboxContent
                            searchPlaceholder={"Search Items..."}
                            emptyPlaceholder={"No items found."}
                            items={items.map((item) => {
                              return {
                                label: item.name,
                                value: item.item_id,
                              };
                            })}
                          />
                        </Combobox>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="amountReceived"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount Received/Value</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                <div className="grid grid-cols-1">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea className="resize-none" {...field} />
                        </FormControl>
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DonationDialogForm;

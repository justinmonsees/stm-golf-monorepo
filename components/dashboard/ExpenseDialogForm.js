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

import { addExpense, updateExpenseByID } from "@/lib/actions/expenseActions";
import { useToast } from "../ui/use-toast";

const formSchema = z.object({
  expenseCategory: z.string(),
  name: z.string().min(1),
  description: z.string(),
  amountPaid: z.coerce.number(),
  datePaid: z.date().nullable(),
});

const ExpenseDialogForm = ({
  isFormOpen,
  formHandler,
  expense = "",
  expenseCategories,
  curEvent,
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const [user, setUser] = useState({});

  const getUser = async () => {
    const { data: profile } = await supabase
      .from("Profiles")
      .select("user_id, first_name, last_name,role");

    setUser(profile[0]);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([getUser()]).then((data) => {
      console.log("items received");
      setLoading(false);
    });
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      expenseCategory: "",
      description: "",
      amountPaid: "",
      datePaid: null,
    },
  });

  useEffect(() => {
    if (expense) {
      form.reset({
        expenseCategory: expenseCategories
          ? expenseCategories.find(
              (expenseCategory) =>
                expenseCategory.expense_category_id ===
                expense.expense_category_id
            )?.expense_category_id
          : "",
        name: expense.name,
        description: expense.description,
        amountPaid: expense.amount_paid,
        datePaid: convertToLocalDate(new Date(expense.date_paid)),
      });
    } else {
      form.reset({
        expenseCategory: "",
        name: "",
        description: "",
        amountPaid: "",
        datePaid: null,
      });
    }
  }, [expense, isFormOpen]);

  const onSubmit = async (data) => {
    formHandler();
    //If there's an existing expense, edit the expense
    if (expense) {
      const expenseCategory = expenseCategories.find(
        (expenseCat) =>
          expenseCat.expense_category_id === data.expense_category_id
      );

      const updateData = {
        expense_category_id: data.expenseCategory,
        name: data.name,
        description: data.description,
        amount_paid: data.amountPaid,
        date_paid: data.datePaid,
      };
      const { result, error } = await updateExpenseByID(
        expense.expense_id,
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
    //Otherwise we are adding an expense
    else {
      const expenseCategory = expenseCategories.find(
        (expenseCat) => expenseCat.expense_category_id === data.expenseCategory
      );

      const newExpenseData = {
        event_id: curEvent.event_id,
        expense_category_id: expenseCategory.expense_category_id,
        name: data.name,
        description: data.description,
        amount_paid: data.amountPaid,
        date_paid: data.datePaid,
      };

      const { result, error } = await addExpense(newExpenseData);

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
                  {expense ? "Edit Expense" : "Add Expense"}
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1">
                  <FormField
                    control={form.control}
                    name="expenseCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expense Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  expense
                                    ? expenseCategories.find(
                                        (expenseCat) =>
                                          expenseCat.expense_category_id ===
                                          expense.expense_category_id
                                      ).expense_category_id
                                    : "Select a category"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {expenseCategories.map((expenseCat) => {
                              return (
                                <SelectItem
                                  key={expenseCat.expense_category_id}
                                  value={expenseCat.expense_category_id}
                                >
                                  {expenseCat.name}
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
                <div className="grid grid-cols-1 gap-4  ">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4  ">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
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
                    name="amountPaid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount Paid</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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

export default ExpenseDialogForm;

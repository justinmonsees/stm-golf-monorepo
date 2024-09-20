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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "./ui/spinner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  addExpenseCategory,
  updateExpenseCategoryByID,
} from "@/lib/actions/expenseCategoryActions";
import { useToast } from "./ui/use-toast";

const formSchema = z.object({
  expenseCategoryName: z.string().min(1),
});

const ExpenseCategoryDialogForm = ({
  isFormOpen,
  formHandler,
  expenseCategory = null,
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expenseCategoryName: "",
    },
  });

  useEffect(() => {
    if (expenseCategory) {
      form.reset({
        expenseCategoryName: expenseCategory.name,
      });
    } else {
      form.reset({
        expenseCategoryName: "",
      });
    }
  }, [expenseCategory, isFormOpen]);

  const onSubmit = async (data) => {
    formHandler();
    //If there's an existing item, edit the item
    if (expenseCategory) {
      const updateData = {
        name: data.expenseCategoryName,
      };
      const { result, error } = await updateExpenseCategoryByID(
        expenseCategory.expense_category_id,
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
    //Otherwise we are adding an expense category
    else {
      const newExpenseCategoryData = {
        name: data.expenseCategoryName,
      };
      //console.log("ADDING EXPENSE CATEGORY", newItemData);
      const { result, error } = await addExpenseCategory(
        newExpenseCategoryData
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
  };

  return (
    <Dialog
      onOpenChange={formHandler}
      open={isFormOpen}
      defaultOpen={isFormOpen}
    >
      <DialogContent className="sm:max-w-[425px]">
        {loading ? (
          <Spinner size="medium" />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>
                  {expenseCategory
                    ? "Edit Expense Category"
                    : "Add Expense Category"}
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 ">
                  <FormField
                    control={form.control}
                    name="expenseCategoryName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expense Category Name</FormLabel>
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
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseCategoryDialogForm;

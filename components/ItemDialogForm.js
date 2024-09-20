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
import { addItem, updateItemByID } from "@/lib/actions/itemActions";
import { useToast } from "./ui/use-toast";

const formSchema = z.object({
  itemName: z.string().min(1),
  itemCost: z.coerce.number(),
  itemType: z.string().min(1),
  itemImage: z.string(),
});

const ItemDialogForm = ({ isFormOpen, formHandler, item = null }) => {
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
    setLoading(false);
  };
  useEffect(() => {
    setLoading(true);
    getUser();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: "",
      itemCost: "",
      itemType: "",
      itemImage: "",
    },
  });

  useEffect(() => {
    if (item) {
      let itemImage = "";
      if (item.item_image) {
        itemImage = item.item_image;
      }
      form.reset({
        itemName: item.name,
        itemCost: item.cost,
        itemType: item.item_type,
        itemImage: itemImage,
      });
    } else {
      form.reset({
        itemName: "",
        itemCost: "",
        itemType: "",
        itemImage: "",
      });
    }
  }, [item, isFormOpen]);

  const onSubmit = async (data) => {
    formHandler();
    //If there's an existing item, edit the item
    if (item) {
      const updateData = {
        name: data.itemName,
        cost: data.itemCost,
        item_type: data.itemType,
        item_image: data.itemImage,
      };
      const { result, error } = await updateItemByID(item.item_id, updateData);

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
      const newItemData = {
        name: data.itemName,
        cost: data.itemCost,
        item_type: data.itemType,
        item_image: data.itemImage,
      };
      console.log("ADDING ITEM", newItemData);
      const { result, error } = await addItem(newItemData);

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
                <DialogTitle>{item ? "Edit Item" : "Add Item"}</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 ">
                  <FormField
                    control={form.control}
                    name="itemName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1">
                  <FormField
                    control={form.control}
                    name="itemCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Cost</FormLabel>
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
                    name="itemType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Type</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div
                  className={`${
                    user.role != "admin" ? "hidden" : ""
                  } grid grid-cols-1 `}
                >
                  <FormField
                    control={form.control}
                    name="itemImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Image</FormLabel>
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

export default ItemDialogForm;
